import { app, shell } from "electron";
import { logger } from "../../logger";
import { isAllowedExternalUrl } from "../../utils/urlSafety";

/**
 * Garde-fous de navigation partages par TOUTES les fenetres de l'app.
 *
 * Extrait de `mainWindow.ts` au moment ou une seconde fenetre (le Draft
 * Companion) a du etre creee : cette fenetre porte les memes bridges preload
 * (`window.lcu`), donc elle doit heriter exactement des memes protections.
 * Dupliquer les regles aurait garanti qu'elles divergent a la premiere
 * correction.
 */

/**
 * Origines qu'une fenetre est autorisee a CHARGER.
 *
 * En production l'app est servie depuis `file://` (loadFile) ; en dev depuis le
 * serveur Vite local. Rien d'autre ne doit pouvoir prendre la place du document,
 * car les fenetres portent les bridges preload (`window.lcu`) : un contenu
 * distant qui y serait charge obtiendrait un acces au League Client local.
 */
const ALLOWED_LOAD_ORIGINS = new Set<string>(["file://"]);

/**
 * URL du serveur de dev Vite, ou `null`.
 *
 * `app.isPackaged` est la garde essentielle : sans elle, definir
 * VITE_DEV_SERVER_URL dans l'environnement d'un utilisateur suffisait a faire
 * charger une URL arbitraire par l'application installee, avec les bridges
 * preload attaches.
 */
export function getDevServerUrl(): string | null {
  if (app.isPackaged) return null;
  return process.env.VITE_DEV_SERVER_URL ?? null;
}

/**
 * Verifie qu'une URL correspond a un document qu'une fenetre peut charger.
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
 * Installe les garde-fous de navigation sur un webContents.
 *
 * Sans eux, une redirection ou un `window.open` pouvait remplacer le document de
 * la fenetre par un site arbitraire tout en conservant l'acces a `window.lcu`.
 */
export function hardenWebContents(contents: Electron.WebContents): void {
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
  //    validation de l'hote (meme liste que le handler IPC open-external —
  //    litteralement la meme, cf. `urlSafety`).
  contents.setWindowOpenHandler(({ url }) => {
    if (isAllowedExternalUrl(url)) {
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
