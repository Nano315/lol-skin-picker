import { BrowserWindow, app, screen } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../../logger";
import { getDevServerUrl } from "./harden";
import { loadSettings, saveSettings, type CompanionBounds } from "../settings";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Draft Companion — le sidecar qui se docke a cote du client League.
 *
 * Parametres valides par un spike sur Windows 11, ne pas les changer sans
 * refaire la mesure :
 *   - `focusable: false` : cliquer Reroll ne retire pas le focus au client.
 *     C'est LA propriete qui rend le sidecar utilisable en draft.
 *   - `-webkit-app-region: drag` fonctionne malgre ca, donc la barre de titre
 *     suffit a deplacer la fenetre (pas de drag manuel a implementer).
 *   - `alwaysOnTop` niveau "screen-saver" tient au-dessus du client.
 *   - `roundedCorners: false` : Windows 11 arrondirait les 4 angles, alors que
 *     l'arete gauche doit rester plate pour se souder au client.
 */

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 720;
const MIN_WIDTH = 260;
const MAX_WIDTH = 400;
const MIN_HEIGHT = 430;

/** Marge au bord droit de l'ecran, au tout premier affichage. */
const EDGE_MARGIN = 8;

/** Distance en dessous de laquelle la fenetre se colle a un bord d'ecran. */
const SNAP_PX = 24;

/**
 * Delai apres le dernier event `move`/`resize` avant de coller et persister.
 * Windows emet `move` en continu pendant le drag ; `moved` n'existe que sur
 * macOS. On attend donc que ca se calme.
 */
const SETTLE_MS = 160;

let win: BrowserWindow | null = null;
/**
 * Creation en cours. `createCompanionWindow` attend `resolveStartBounds()`
 * (lecture de settings.json) AVANT d'affecter `win` : deux appels concurrents
 * — et il y en a trois sources, dont les deux interrupteurs des reglages —
 * construisaient chacun leur BrowserWindow, le second ecrasant `win`. Le
 * premier devenait alors un renderer fantome, invisible, impossible a fermer,
 * et qui continuait a recevoir chaque `broadcast()`.
 */
let creating: Promise<BrowserWindow> | null = null;
/**
 * Derniere intention exprimee par la machine a etats. Sert d'arbitre quand une
 * creation asynchrone est en vol : sans lui, un `hide` recu pendant la creation
 * etait un no-op (la fenetre n'existait pas encore) puis se faisait ecraser par
 * le `showInactive()` differe.
 */
let wantVisible = false;
let settleTimer: NodeJS.Timeout | null = null;
/** Garde anti-boucle : `setBounds` reemet `move`. */
let snapping = false;

function getPreloadPath() {
  return path.join(__dirname, "index.mjs");
}

/**
 * Position par defaut : collee au bord droit de la zone de travail de l'ecran
 * principal, centree verticalement. C'est l'emplacement libre a cote d'un
 * client League fenetre 1280x720 centre sur un 1920x1080.
 */
function defaultBounds(): CompanionBounds {
  const { workArea } = screen.getPrimaryDisplay();
  const height = Math.min(DEFAULT_HEIGHT, workArea.height);
  return {
    x: workArea.x + workArea.width - DEFAULT_WIDTH - EDGE_MARGIN,
    y: workArea.y + Math.round((workArea.height - height) / 2),
    width: DEFAULT_WIDTH,
    height,
  };
}

/**
 * Une position persistee peut pointer vers un ecran debranche depuis, ou vers
 * une zone devenue hors champ. Sans ce controle la fenetre se rouvrirait
 * invisible, sans moyen de la recuperer autrement qu'en editant settings.json.
 */
function isReachable(bounds: CompanionBounds): boolean {
  return screen.getAllDisplays().some(({ workArea }) => {
    const overlapX =
      Math.min(bounds.x + bounds.width, workArea.x + workArea.width) -
      Math.max(bounds.x, workArea.x);
    const overlapY =
      Math.min(bounds.y + bounds.height, workArea.y + workArea.height) -
      Math.max(bounds.y, workArea.y);
    // Il faut qu'une portion attrapable a la souris reste visible, pas juste
    // un pixel de coin.
    return overlapX >= 80 && overlapY >= 40;
  });
}

function clampSize(bounds: CompanionBounds): CompanionBounds {
  return {
    ...bounds,
    width: Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, bounds.width)),
    height: Math.max(MIN_HEIGHT, bounds.height),
  };
}

async function resolveStartBounds(): Promise<CompanionBounds> {
  const settings = await loadSettings();
  const stored = settings.companionBounds;
  if (!stored) return defaultBounds();

  const candidate = clampSize(stored);
  if (!isReachable(candidate)) {
    logger.warn(
      "[Companion] position enregistree hors ecran, retour a la position par defaut"
    );
    return defaultBounds();
  }
  return candidate;
}

/** Colle la fenetre au bord d'ecran le plus proche, puis persiste. */
function settle() {
  if (!win || win.isDestroyed()) return;

  const bounds = win.getBounds();
  const { workArea } = screen.getDisplayMatching(bounds);

  let { x, y } = bounds;
  const right = workArea.x + workArea.width;
  const bottom = workArea.y + workArea.height;

  if (Math.abs(x - workArea.x) <= SNAP_PX) x = workArea.x;
  if (Math.abs(x + bounds.width - right) <= SNAP_PX) x = right - bounds.width;
  if (Math.abs(y - workArea.y) <= SNAP_PX) y = workArea.y;
  if (Math.abs(y + bounds.height - bottom) <= SNAP_PX) y = bottom - bounds.height;

  if (x !== bounds.x || y !== bounds.y) {
    snapping = true;
    win.setBounds({ ...bounds, x, y });
    snapping = false;
  }

  void saveSettings({ companionBounds: win.getBounds() }).catch(() => {});
}

function scheduleSettle() {
  if (snapping) return;
  if (settleTimer) clearTimeout(settleTimer);
  settleTimer = setTimeout(settle, SETTLE_MS);
}

async function createCompanionWindow(): Promise<BrowserWindow> {
  const bounds = await resolveStartBounds();

  win = new BrowserWindow({
    ...bounds,
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    minHeight: MIN_HEIGHT,

    frame: false,
    show: false,
    resizable: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    focusable: false,
    roundedCorners: false,
    backgroundColor: "#09090b",
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Les garde-fous de navigation sont poses globalement par
  // `app.on("web-contents-created")` : cette fenetre porte les memes bridges
  // preload que la principale, donc exactement les memes protections, sans
  // qu'on ait a y penser ici.

  // Niveau le plus haut accessible sans passer fenetre systeme : c'est lui qui
  // permet de rester devant le client League quand celui-ci a le focus.
  win.setAlwaysOnTop(true, "screen-saver");

  win.on("move", scheduleSettle);
  win.on("resize", scheduleSettle);
  win.on("closed", () => {
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = null;
    win = null;
  });

  const devServerUrl = getDevServerUrl();
  if (devServerUrl) {
    await win.loadURL(`${devServerUrl}#/companion`);
  } else {
    const indexHtml = path.join(__dirname, "../dist/index.html");
    await win.loadFile(indexHtml, { hash: "/companion" });
  }

  logger.info(
    `[Companion] fenetre creee ${bounds.width}x${bounds.height} @ ${bounds.x},${bounds.y}`
  );

  return win;
}

/**
 * Affiche le sidecar, en le creant a la volee la premiere fois.
 *
 * `showInactive()` et pas `show()` : apparaitre ne doit pas arracher le focus
 * au client en pleine draft. Une fois cree, on garde la fenetre en vie et on
 * se contente de la masquer — la recreer a chaque champ select coûterait un
 * remontage React complet au pire moment.
 */
export async function showCompanionWindow(): Promise<void> {
  wantVisible = true;
  if (!win || win.isDestroyed()) {
    creating ??= createCompanionWindow().finally(() => {
      creating = null;
    });
    await creating;
  }

  // Etat relu APRES l'attente : une demande de masquage a pu arriver pendant
  // la creation, et l'afficher malgre tout ferait apparaitre le sidecar hors
  // champ select.
  if (!wantVisible) return;
  if (win && !win.isDestroyed() && !win.isVisible()) {
    win.showInactive();
  }
}

export function hideCompanionWindow(): void {
  wantVisible = false;
  if (win && !win.isDestroyed() && win.isVisible()) win.hide();
}

/** Fermeture complete : quand l'utilisateur desactive l'option, ou a l'arret. */
export function destroyCompanionWindow(): void {
  wantVisible = false;
  if (settleTimer) {
    clearTimeout(settleTimer);
    settleTimer = null;
  }
  if (win && !win.isDestroyed()) win.close();
  win = null;
}

app.on("before-quit", destroyCompanionWindow);
