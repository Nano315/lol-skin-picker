import { BrowserWindow, app, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { logger } from "../../logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIN_WIDTH = 900;
const MIN_HEIGHT = 645;

/**
 * Origines que la fenetre principale est autorisee a CHARGER.
 *
 * En production l'app est servie depuis `file://` (loadFile) ; en dev depuis le
 * serveur Vite local. Rien d'autre ne doit pouvoir prendre la place du document,
 * car la fenetre porte les bridges preload (`window.lcu`) : un contenu distant
 * qui y serait charge obtiendrait un acces au League Client local.
 */
const ALLOWED_LOAD_ORIGINS = new Set<string>(["file://"]);

/** Hotes vers lesquels un lien peut etre ouvert — dans le navigateur externe. */
const ALLOWED_EXTERNAL_HOSTS = new Set<string>([
  "discord.com",
  "www.discord.com",
  "github.com",
  "www.github.com",
  "raw.githubusercontent.com",
  "communitydragon.org",
  "www.communitydragon.org",
  "riotgames.com",
  "www.riotgames.com",
]);

let win: BrowserWindow | null = null;

export function getMainWindow() {
  return win;
}

/**
 * Verifie qu'une URL correspond a un document que la fenetre peut charger.
 *
 * On compare l'ORIGINE parsee, jamais un prefixe de chaine : un
 * `startsWith("http://localhost:5173")` serait contourne par
 * `http://localhost:5173.evil.com`.
 */
function isAllowedLoadUrl(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol === "file:") return true;

  // Le serveur de dev n'est autorise que hors build packagee.
  const devServer = getDevServerUrl();
  if (devServer) {
    try {
      if (parsed.origin === new URL(devServer).origin) return true;
    } catch {
      /* URL de dev invalide : on refuse */
    }
  }

  return ALLOWED_LOAD_ORIGINS.has(parsed.origin);
}

/**
 * URL du serveur de dev Vite, ou `null`.
 *
 * `app.isPackaged` est la garde essentielle : sans elle, definir
 * VITE_DEV_SERVER_URL dans l'environnement d'un utilisateur suffisait a faire
 * charger une URL arbitraire par l'application installee, avec les bridges
 * preload attaches.
 */
function getDevServerUrl(): string | null {
  if (app.isPackaged) return null;
  return process.env.VITE_DEV_SERVER_URL ?? null;
}

/**
 * Installe les garde-fous de navigation sur un webContents.
 *
 * Sans eux, une redirection ou un `window.open` pouvait remplacer le document de
 * la fenetre par un site arbitraire tout en conservant l'acces a `window.lcu`.
 */
function hardenWebContents(contents: Electron.WebContents): void {
  // 1. Navigation du document : tout ce qui n'est pas l'app est refuse.
  contents.on("will-navigate", (event, url) => {
    if (isAllowedLoadUrl(url)) return;
    event.preventDefault();
    logger.warn(`[security] will-navigate bloque: ${url}`);
  });

  // 2. Redirections cote serveur (302 vers un hote non autorise).
  contents.on("will-redirect", (event, url) => {
    if (isAllowedLoadUrl(url)) return;
    event.preventDefault();
    logger.warn(`[security] will-redirect bloque: ${url}`);
  });

  // 3. `window.open` / target=_blank : jamais de nouvelle fenetre Electron.
  //    Les liens legitimes partent dans le navigateur du systeme, apres
  //    validation de l'hote (meme liste que le handler IPC open-external).
  contents.setWindowOpenHandler(({ url }) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      logger.warn(`[security] windowOpen bloque (URL invalide): ${url}`);
      return { action: "deny" };
    }
    if (
      parsed.protocol === "https:" &&
      ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname.toLowerCase())
    ) {
      void shell.openExternal(url);
    } else {
      logger.warn(`[security] windowOpen bloque: ${url}`);
    }
    return { action: "deny" };
  });

  // 4. Aucun <webview> n'est utilise dans l'app : si un jour du contenu
  //    hostile en injectait un, il ne doit hériter d'aucun privilege.
  contents.on("will-attach-webview", (event, webPreferences, params) => {
    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
    event.preventDefault();
    logger.warn(`[security] will-attach-webview bloque: ${params.src}`);
  });
}

function getPreloadPath() {
  return path.join(__dirname, "index.mjs");
}

function getIconPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "icon.ico");
  }
  return path.join(process.cwd(), "public", "icon.ico");
}

export async function createMainWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    resizable: true,
    maximizable: true,
    fullscreenable: true,

    show: false,
    icon: getIconPath(),
    titleBarStyle: "hidden",
    backgroundColor: "#09090b",
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Garde-fous installes AVANT le premier chargement, sinon une redirection
  // survenant pendant celui-ci passerait sans controle.
  hardenWebContents(win.webContents);

  const devServerUrl = getDevServerUrl();
  if (devServerUrl) {
    await win.loadURL(devServerUrl);
    // Open DevTools in dev mode
    win.webContents.openDevTools();
  } else {
    const indexHtml = path.join(__dirname, "../dist/index.html");
    await win.loadFile(indexHtml);
  }

  win.on("maximize", () => {
    win?.webContents.send("window:maximize-change", true);
  });
  win.on("unmaximize", () => {
    win?.webContents.send("window:maximize-change", false);
  });

  win.once("ready-to-show", () => {
    if (win) {
      win.maximize(); // Maximise la fenetre (plein ecran fenetre)
      win.show();
    }
  });

  return win;
}
