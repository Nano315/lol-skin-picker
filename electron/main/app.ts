import { app, Menu, screen } from "electron";

import {
  LcuWatcher,
  type LcuStatus,
  type LockCreds,
} from "../services/lcuWatcher";
import { GameflowService } from "../services/gameflow.service";
import { SkinsService } from "../services/skins.service";
import { ChampionLibraryService } from "../services/championLibrary.service";
import { ReadyCheckService } from "../services/readyCheck.service";
import { WardsService } from "../services/wards.service";
import { skinLineService } from "../services/skinLineService";
import { logger } from "../logger";

import { createMainWindow, getMainWindow } from "./windows/mainWindow";
import { computePresentation } from "./windows/presentation";
import { hardenWebContents } from "./windows/harden";
import { broadcast } from "./windows/broadcast";
import {
  destroyCompanionWindow,
  hideCompanionWindow,
  showCompanionWindow,
} from "./windows/companionWindow";
import {
  clearCompanionDismissal,
  isCompanionDismissed,
  onCompanionDismissalChange,
} from "./windows/companionDismissal";
import {
  getCompanionPrefs,
  initCompanionPrefs,
  onCompanionPrefsChange,
} from "./companionSettings";
import {
  initHotkeys,
  releaseHotkeys,
  setHotkeysActive,
  type HotkeyAction,
} from "./hotkeys";
import { registerAllIpc } from "./ipc";
import {
  setupTray,
  updaterHooks,
  checkForUpdates as checkForUpdatesPinned,
} from "./windows/tray";
import { loadSettings, saveSettings } from "./settings";
import { initTelemetry, track } from "./telemetry";
import path from "node:path";

// Dev only: isole le profil et le cache Chromium
if (!app.isPackaged) {
  const devUserData = path.join(app.getPath("appData"), "lol-skin-picker-dev");
  app.setPath("userData", devUserData);
  app.commandLine.appendSwitch(
    "disk-cache-dir",
    path.join(devUserData, "Cache")
  );
  app.commandLine.appendSwitch("disable-gpu-shader-disk-cache"); // evite le cache GPU
}

logger.info("[App] Initialisation de l'application");

// Aptabase's SDK requires initialize() to run BEFORE app.whenReady() fires;
// calling it later disables tracking silently.
initTelemetry();

const lcu = new LcuWatcher();
const gameflow = new GameflowService();
const skins = new SkinsService();
const championLibrary = new ChampionLibraryService(lcu);
const readyCheck = new ReadyCheckService();
const wards = new WardsService();

// AUTO-UPDATE: Interval reference for cleanup on quit
let updateCheckInterval: NodeJS.Timeout | null = null;

/**
 * Action de raccourci -> methode du service. Une table plutot qu'une cascade de
 * ternaires : ajouter une quatrieme action devient une ligne, et l'exhaustivite
 * est verifiee par le type au lieu de retomber silencieusement dans le `else`.
 */
const REROLL_BY_ACTION: Record<
  HotkeyAction,
  (svc: SkinsService) => Promise<unknown>
> = {
  both: (svc) => svc.rerollSkin(),
  skin: (svc) => svc.rerollSkinOnly(),
  chroma: (svc) => svc.rerollChroma(),
};

/**
 * Les preferences du sidecar vivent dans `companionSettings` (cache synchrone,
 * lu une fois au demarrage). On s'abonne ici pour reagir a un changement
 * immediatement : activer l'option en pleine champ select doit faire apparaitre
 * la fenetre sans attendre la partie suivante.
 */
onCompanionPrefsChange((prefs) => {
  // Option decochee : on ferme pour de bon plutot que masquer, sinon une
  // fenetre invisible resterait en memoire jusqu'a la fermeture de l'app.
  if (!prefs.enabled) destroyCompanionWindow();
  // Rallumer l'option en pleine draft est une demande explicite : elle prime
  // sur une croix cliquee plus tot dans la meme draft.
  else clearCompanionDismissal();
  applyPresentation();
});

/** La croix du sidecar est une entree de la machine a etats, pas un `hide()`. */
onCompanionDismissalChange(applyPresentation);

/**
 * Applique l'etat de presentation calcule aux fenetres reelles.
 *
 * Toute la logique du "qui est visible quand" vit dans `computePresentation`
 * (fonction pure, testee) — ici on ne fait qu'executer sa decision. Avant, la
 * regle etait recopiee dans les handlers `status` et `phase`, avec des
 * conditions legerement differentes des deux cotes.
 */
function applyPresentation() {
  const prefs = getCompanionPrefs();
  const target = computePresentation({
    companionEnabled: prefs.enabled,
    lcuConnected: lcu.isConnected(),
    phase: gameflow.phase,
    companionDismissed: isCompanionDismissed(),
  });

  // Le sidecar d'abord : en champ select il remplace la fenetre principale, et
  // l'ouvrir avant de masquer l'autre evite un clignotement du bureau entre
  // les deux.
  if (target.companion === "shown") {
    void showCompanionWindow().catch((err) =>
      logger.warn("[Companion] ouverture impossible", err)
    );
  } else {
    hideCompanionWindow();
  }

  // Les raccourcis globaux vivent exactement le temps du sidecar : ils sont
  // captes pour tout le systeme, on ne les garde pas une seconde de plus que
  // la fenetre qui les documente.
  setHotkeysActive(target.companion === "shown" && prefs.hotkeysEnabled);

  const win = getMainWindow();
  if (!win || win.isDestroyed()) return;

  if (target.main === "shown") {
    if (win.isMinimized()) win.restore();
    if (!win.isVisible()) {
      logger.info(`[App] Fenetre principale affichee (phase=${gameflow.phase})`);
      win.show();
    }
    if (!win.isMaximized()) win.maximize();
  } else if (win.isVisible()) {
    logger.info(`[App] Fenetre principale masquee (phase=${gameflow.phase})`);
    win.hide();
  }
}


async function createWindowWithPrefs() {
  // positionnement restaure
  const settings = await loadSettings();
  const displays = screen.getAllDisplays();

  const targetDisplay =
    displays.find((d) => d.id === settings.displayId) ??
    screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ??
    screen.getPrimaryDisplay();

  const w = await createMainWindow();

  // On deplace la fenetre sur l'ecran cible avant qu'elle ne s'affiche
  // (pour que le maximize se fasse sur le bon ecran)
  const { x, y } = targetDisplay.bounds;
  w.setPosition(x, y);

  // On force le maximize mnt (avant le ready-to-show qui le fera aussi, double sureté)
  // et SURTOUT on ne reset pas les bounds a 900x645
  if (!w.isVisible()) {
     // w.maximize() ici pourrait être prématuré si ready-to-show n'a pas fire,
     // mais mainWindow.ts s'occupe du maximize au ready-to-show.
     // L'important est de NE PAS appeler setBounds avec une taille fixe ici.
  }

  Menu.setApplicationMenu(null);
  setupTray(getMainWindow);

  // persist ecran courant (debounce leger)
  let moveTimer: NodeJS.Timeout | null = null;
  const persist = () => {
    const current = getMainWindow();
    if (!current) return;
    const d = screen.getDisplayMatching(current.getBounds());
    saveSettings({ displayId: d.id }).catch(() => {});
  };
  w.on("move", () => {
    if (moveTimer) clearTimeout(moveTimer);
    moveTimer = setTimeout(persist, 300);
  });
  w.on("close", persist);
  w.on("hide", persist);
}

function wireDomainEvents() {
  // Evite de re-emettre lcu_connected/disconnected si lcuWatcher publie
  // plusieurs fois le meme status (reconnexions silencieuses).
  let lastTrackedStatus: LcuStatus | null = null;

  // 1. Gestion de la connexion globale au client LoL
  lcu.on("status", (status: LcuStatus, creds?: LockCreds) => {
    broadcast("lcu-status", status);

    if (status !== lastTrackedStatus) {
      lastTrackedStatus = status;
      if (status === "connected") track("lcu_connected");
      else if (status === "disconnected") track("lcu_disconnected");
    }

    if (status === "connected" && creds) {
      // Le client vient de s'ouvrir : on demarre les services
      gameflow.setCreds(creds);
      skins.setCreds(creds);
      skins.start();
      readyCheck.setCreds(creds);
      wards.setCreds(creds);
    } else {
      // Le client s'est ferme : on arrete tout.
      gameflow.stop();
      skins.stop();
      readyCheck.setCreds(null);
      wards.setCreds(null);
    }

    // Une seule source de verite pour la visibilite, dans les deux branches.
    // Au passage, demarrer l'app alors qu'une partie tourne deja n'affiche plus
    // la fenetre pour la masquer aussitot : la phase est prise en compte des
    // le premier calcul.
    applyPresentation();
  });

  // Auto-roll du ward au lock du champion. Le SkinsService emet
  // `champion-locked` sur l'edge montant (false → true). On respecte le
  // matchLock global ici plutot que dans WardsService pour eviter le
  // couplage inter-services.
  skins.on("champion-locked", () => {
    if (skins.getMatchLock()) {
      logger.debug("[App] champion-locked reçu mais matchLock actif, skip ward auto-roll");
      return;
    }
    void wards.rollAndApply();
  });

  // ---------------------------------------------------------
  // 2. AJOUT : Gestion de la visibilite selon la phase de jeu
  // ---------------------------------------------------------
  gameflow.on("phase", (phase: string) => {
    // "InProgress" signifie que le joueur est en partie (ou ecran de chargement).
    // C'est aussi le seul moment où on peut affirmer que le skin sélectionné
    // a vraiment été "joué" — pendant le champ select l'utilisateur peut
    // reroll/hover une douzaine d'options avant de se décider, et persister
    // chacune polluerait l'historique du carrousel standby de Solo. Le commit
    // unique ici résout ça.
    if (phase === "InProgress") {
      skins
        .commitSelectionToHistory()
        .catch((err) =>
          logger.warn("[Skins] commitSelectionToHistory failed", err)
        );
    }

    // La croix du sidecar ne vaut que pour la draft en cours : des qu'on en
    // sort, elle est oubliee. A faire AVANT `applyPresentation`, qui la lit.
    if (phase !== "ChampSelect") clearCompanionDismissal();

    // La visibilite (masquer en partie, reafficher au retour, montrer le
    // sidecar en draft) est entierement deleguee a la machine a etats.
    applyPresentation();
  });
}

// Filet de securite global. C'est le SEUL point de durcissement : `app.on
// ("web-contents-created")` se declenche pendant `new BrowserWindow(...)`,
// avant tout chargement, donc chaque fenetre est couverte par construction.
// Appeler `hardenWebContents` fenetre par fenetre laissait la protection
// dependre du fait qu'on y pense — et une fenetre oubliee ne se voyait pas :
// elle heritait de garde-fous plus faibles, en silence.
app.on("web-contents-created", (_event, contents) => {
  hardenWebContents(contents);
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  logger.warn("[App] Deuxieme instance detectee, fermeture de l'app");
  app.quit();
} else {
  app.on("second-instance", () => {
    // Passe par la machine a etats plutot que de refaire show/maximize a la
    // main : relancer l'app pendant une draft ne doit pas faire surgir la
    // fenetre principale maximisee par-dessus le sidecar.
    applyPresentation();
    getMainWindow()?.focus();
  });

  app.whenReady().then(async () => {
    logger.info("[App] Application prete, initialisation des services");

    // Initialize skin line service (Story 6.1) - fetches CDragon data if cache expired
    await skinLineService.initialize();

    // Restore the persisted auto-accept preference before any phase event fires.
    const persistedSettings = await loadSettings();
    readyCheck.setAutoAccept(persistedSettings.autoAcceptMatch ?? false);

    // Idem pour le sidecar : la preference doit etre connue avant le premier
    // calcul de presentation, sinon un demarrage en pleine champ select
    // ouvrirait la fenetre principale au lieu du sidecar.
    await initCompanionPrefs();

    // Les rerolls sont declenches directement sur le service : passer par un
    // renderer ferait dependre un raccourci global de la presence d'une
    // fenetre, alors que SkinsService est la source de verite et porte deja
    // ses propres gardes (match lock, pool vide).
    initHotkeys((action: HotkeyAction) => {
      void REROLL_BY_ACTION[action](skins).catch((err) =>
        logger.warn(`[Hotkeys] reroll ${action} echoue`, err)
      );
    });

    // Same idea for the ward auto-roll toggle — populates the service before
    // the first champion-lock can fire.
    await wards.initFromSettings();

    // Apply the persisted (or default) openAtLogin preference to the OS login
    // items registry. Without this step, a fresh install would display "Run on
    // startup = true" in Settings while the OS hasn't been told to launch the
    // app — the toggle would be a lie. On first launch we also persist the
    // default so subsequent reads are stable and the user can flip it off.
    if (!app.isPackaged) {
      logger.debug("[App] Dev build: skip openAtLogin OS sync");
    } else {
      const openAtLoginPref = persistedSettings.openAtLogin ?? true;
      app.setLoginItemSettings({
        openAtLogin: openAtLoginPref,
        path: app.getPath("exe"),
      });
      if (persistedSettings.openAtLogin === undefined) {
        await saveSettings({ openAtLogin: openAtLoginPref });
      }
    }

    registerAllIpc({
      lcu,
      gameflow,
      skins,
      championLibrary,
      readyCheck,
      wards,
      getWin: getMainWindow,
    });
    wireDomainEvents();
    updaterHooks(getMainWindow);

    await createWindowWithPrefs();

    lcu.start();

    // AUTO-UPDATE: Check 10s after startup (AC: 1)
    // On passe par checkForUpdatesPinned (pas directement par getAutoUpdater) :
    // sur le canal beta, ca force d'abord la resolution de la derniere
    // prerelease via l'API GitHub, pour contourner le bug d'iteration du
    // GitHubProvider. Sur stable, c'est un simple passe-plat.
    setTimeout(() => {
      logger.info("[Updater] Auto-check at startup");
      checkForUpdatesPinned().catch((err) => {
        console.error("[Updater] Startup check failed:", err);
      });
    }, 10000);

    // AUTO-UPDATE: Check every 15 minutes.
    // L'auto-download a ete supprime (cf. updaterHooks dans tray.ts) :
    // les checks ne font plus que mettre a jour l'etat de la pastille
    // in-app. On peut donc se permettre une frequence elevee sans rien
    // imposer a l'utilisateur. 15 min = 4 req/h vers l'API GitHub par
    // user, bien en dessous du rate limit non-authentifie de 60/h/IP.
    updateCheckInterval = setInterval(() => {
      logger.info("[Updater] Periodic check (15min interval)");
      checkForUpdatesPinned().catch((err) => {
        console.error("[Updater] Periodic check failed:", err);
      });
    }, 900000); // 15 minutes in ms
  });
}

// AUTO-UPDATE: Cleanup interval on quit
app.on("before-quit", () => {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
});

// Un raccourci global reste enregistre aupres de l'OS tant qu'on ne le libere
// pas : sans ca, Alt+R resterait capte apres la fermeture de l'app.
app.on("will-quit", releaseHotkeys);


app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
