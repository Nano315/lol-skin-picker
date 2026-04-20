import { Menu, Tray, nativeImage, app, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import type {
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo,
} from "electron-updater";
import { logger } from "../../logger";

const require = createRequire(import.meta.url);

let tray: Tray | null = null;

// Etat partage entre les evenements electron-updater et les actions utilisateur.
//   manualCheckInFlight  : un click tray "Check for Updates" est en cours (on
//                          pilote tout a la main, on court-circuite le flux auto)
//   downloadInProgress   : evite les doubles downloads si l'utilisateur reclique
let manualCheckInFlight = false;
let downloadInProgress = false;

type AutoUpdater = typeof import("electron-updater")["autoUpdater"];
let autoUpdater: AutoUpdater | null = null;
let updaterChannel: "latest" | "beta" = "latest";
let listenersRegistered = false;

/**
 * Lit le canal de mise a jour depuis le package.json embarque.
 * electron-builder injecte extraMetadata.updateChannel au moment du build
 * ("latest" pour la config release, "beta" pour la config beta).
 *
 * On utilise app.getAppPath() plutot qu'un require("../../package.json")
 * fragile : le chemin relatif est casse dans l'asar selon la facon dont le
 * bundler reecrit les chemins. getAppPath() renvoie toujours la racine
 * logique de l'app (app.asar en prod).
 */
function readUpdateChannel(): "latest" | "beta" {
  try {
    const pkgPath = path.join(app.getAppPath(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return pkg.updateChannel === "beta" ? "beta" : "latest";
  } catch (err) {
    logger.warn(
      `[Updater] Could not read updateChannel, defaulting to "latest": ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return "latest";
  }
}

/**
 * Charge electron-updater (prod uniquement) et configure l'instance partagee.
 * Tout le code qui a besoin de l'updater passe par ici : garantit que la
 * configuration (canal, autoDownload, etc.) est appliquee une seule fois.
 */
function getAutoUpdater(): AutoUpdater | null {
  if (!app.isPackaged) {
    // Pas d'auto-update en dev : electron-updater veut un installeur signe
    // et une URL de publish accessible.
    return null;
  }

  if (autoUpdater) return autoUpdater;

  try {
    ({ autoUpdater } =
      require("electron-updater") as typeof import("electron-updater"));

    updaterChannel = readUpdateChannel();

    // Verrouille le canal : la version beta ne verra JAMAIS les releases
    // stables (et inversement) car electron-updater ne lit que <channel>.yml.
    autoUpdater!.channel = updaterChannel;

    // On prend la main sur le download ET sur l'installation. Sans ca, un
    // check (auto ou manuel) peut telecharger + preparer l'install sans que
    // l'utilisateur voie quoi que ce soit -> c'est ce qui donnait l'impression
    // que "ca installe tout seul".
    autoUpdater!.autoDownload = false;
    autoUpdater!.autoInstallOnAppQuit = false;

    // Garde-fous :
    //   - pas de downgrade,
    //   - prereleases autorisees UNIQUEMENT sur le canal beta (les versions beta
    //     embarquent un suffixe -beta.N, ce sont techniquement des prereleases).
    //     Sur le canal stable, allowPrerelease=false empeche tout debordement
    //     accidentel vers une beta (ceinture + bretelles avec channel=beta/latest).
    autoUpdater!.allowDowngrade = false;
    autoUpdater!.allowPrerelease = updaterChannel === "beta";

    autoUpdater!.logger = logger as unknown as Console;

    logger.info(
      `[Updater] Initialised on channel "${updaterChannel}" (current v${app.getVersion()})`,
    );
    return autoUpdater;
  } catch (err) {
    console.error("[Updater] electron-updater not available:", err);
    return null;
  }
}

function getTrayIconPath() {
  if (app.isPackaged) {
    const p = path.join(process.resourcesPath, "icon.ico");
    if (fs.existsSync(p)) return p;
    console.warn("[Tray] Not found:", p);
    return "";
  } else {
    const p = path.join(process.cwd(), "public", "icon.ico");
    if (fs.existsSync(p)) return p;
    console.warn("[Tray] Not found (dev):", p);
    return "";
  }
}

/**
 * Affiche une message box.
 * Ne parente PAS sur la fenetre quand elle est masquee : sinon la popup
 * peut ne jamais s'afficher (ou rester derriere le tray), ce qui expliquait
 * les "aucun affichage" quand on cliquait sur Check for Updates depuis le tray.
 */
function showDialog(
  getWin: () => Electron.BrowserWindow | null,
  opts: Electron.MessageBoxOptions,
) {
  const parent = getWin();
  if (parent && !parent.isDestroyed() && parent.isVisible()) {
    return dialog.showMessageBox(parent, opts);
  }
  return dialog.showMessageBox(opts);
}

function channelLabel() {
  return updaterChannel === "beta" ? "Beta" : "Stable";
}

/**
 * Verifie qu'une version appartient bien au canal courant.
 *
 * Pourquoi : electron-updater v6 a un comportement surprenant avec
 * allowPrerelease=true + channel="beta". Quand une release STABLE plus recente
 * qu'une beta existe (ex: on sort 7.3.2 stable apres 7.3.2-beta.2), le
 * GitHubProvider (voir node_modules/electron-updater/out/providers/GitHubProvider.js,
 * methode getLatestVersion) selectionne quand meme la stable comme candidate,
 * echoue a trouver beta.yml, puis FALLBACK sur latest.yml — et propose donc la
 * stable a un utilisateur beta.
 *
 * On filtre ici : un user beta n'accepte QUE des versions avec "-beta", un
 * user stable n'accepte QUE des versions sans suffixe prerelease.
 */
function isVersionForChannel(
  version: string,
  channel: "latest" | "beta",
): boolean {
  const isBetaVersion = version.includes("-beta");
  return channel === "beta" ? isBetaVersion : !isBetaVersion;
}

export function setupTray(getWin: () => Electron.BrowserWindow | null) {
  const iconPath = getTrayIconPath();

  if (!iconPath) {
    console.warn("[Tray] icon not found; check extraResources and paths");
    return;
  }

  // S'assure que l'updater est initialise AVANT de construire le menu : c'est
  // lui qui renseigne updaterChannel, qu'on affiche dans le tooltip.
  getAutoUpdater();

  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);
  tray.setToolTip(
    `LoL Skin Picker — v${app.getVersion()} (${channelLabel()})`,
  );

  const toggleWindow = () => {
    const w = getWin();
    if (!w) return;
    if (w.isVisible() && w.isFocused()) {
      w.hide();
    } else {
      if (w.isMinimized()) w.restore();
      w.show();
      w.focus();
      w.maximize();
    }
  };

  const manualCheckForUpdates = async () => {
    const au = getAutoUpdater();

    if (!au) {
      showDialog(getWin, {
        type: "info",
        title: "LoL Skin Picker",
        message: app.isPackaged
          ? "Auto-update unavailable."
          : "Updates unavailable in dev",
      });
      return;
    }

    if (manualCheckInFlight) return;

    if (downloadInProgress) {
      showDialog(getWin, {
        type: "info",
        title: "LoL Skin Picker",
        message: "An update is already downloading",
        detail: "Please wait for the current download to finish.",
      });
      return;
    }

    manualCheckInFlight = true;
    logger.info(`[Updater] Manual check requested (channel=${updaterChannel})`);

    // On ne peut PAS se baser sur la valeur de retour de checkForUpdates :
    //   - result.downloadPromise n'est renseigne que si autoDownload=true
    //   - result.updateInfo est toujours renseigne (meme quand on est a jour),
    //     du coup impossible de savoir "update dispo ou non" juste avec ca.
    // Solution fiable : on ecoute les events update-available / update-not-available
    // qui sont emis par electron-updater a l'issue de sa logique interne (semver
    // compare, canal, allowDowngrade, etc.).
    type Outcome =
      | { kind: "available"; info: UpdateInfo }
      | { kind: "not-available" }
      | { kind: "error"; error: Error };

    const outcome = await new Promise<Outcome>((resolve) => {
      let settled = false;
      const cleanup = () => {
        au.removeListener("update-available", onAvailable);
        au.removeListener("update-not-available", onNotAvailable);
        au.removeListener("error", onError);
      };
      const onAvailable = (info: UpdateInfo) => {
        if (settled) return;
        settled = true;
        cleanup();
        // Protege contre le fallback cross-canal d'electron-updater v6
        // (cf. commentaire de isVersionForChannel).
        if (!isVersionForChannel(info.version, updaterChannel)) {
          logger.info(
            `[Updater] Ignoring cross-channel release v${info.version} (current channel "${updaterChannel}")`,
          );
          resolve({ kind: "not-available" });
          return;
        }
        resolve({ kind: "available", info });
      };
      const onNotAvailable = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve({ kind: "not-available" });
      };
      const onError = (err: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve({ kind: "error", error: err });
      };

      au.on("update-available", onAvailable);
      au.on("update-not-available", onNotAvailable);
      au.on("error", onError);

      au.checkForUpdates().catch((err: unknown) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve({
          kind: "error",
          error: err instanceof Error ? err : new Error(String(err)),
        });
      });
    });

    try {
      const current = app.getVersion();

      if (outcome.kind === "error") {
        throw outcome.error;
      }

      if (outcome.kind === "not-available") {
        await showDialog(getWin, {
          type: "info",
          title: "LoL Skin Picker",
          message: "You're up to date",
          detail: `Current version: ${current}\nChannel: ${channelLabel()}`,
          buttons: ["OK"],
        });
        return;
      }

      const latest = outcome.info.version;
      const { response } = await showDialog(getWin, {
        type: "question",
        title: "LoL Skin Picker",
        message: "Update available",
        detail:
          `A new ${channelLabel()} version is available.\n\n` +
          `Current: ${current}\nNew: ${latest}\n\n` +
          `Download and install it now?`,
        buttons: ["Download", "Later"],
        defaultId: 0,
        cancelId: 1,
      });

      if (response !== 0) {
        logger.info("[Updater] User postponed download");
        return;
      }

      downloadInProgress = true;
      // La suite se joue via le handler "update-downloaded" qui proposera
      // l'installation quand le download sera fini.
      await au.downloadUpdate();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`[Updater] Manual check failed: ${message}`);
      downloadInProgress = false;
      dialog.showErrorBox("Update error", message);
    } finally {
      manualCheckInFlight = false;
    }
  };

  const refreshTrayMenu = () => {
    const w = getWin();
    const visible = !!w && w.isVisible();
    const label = visible ? "Hide App" : "Show App";
    const menu = Menu.buildFromTemplate([
      { label, click: toggleWindow },
      { type: "separator" },
      { label: "Check for Updates", click: manualCheckForUpdates },
      { type: "separator" },
      { label: "Quit", role: "quit" },
    ]);
    tray!.setContextMenu(menu);
  };

  tray.on("click", toggleWindow);
  tray.on("double-click", toggleWindow);
  refreshTrayMenu();

  const trayApi = setupTray as typeof setupTray & { refresh?: () => void };
  trayApi.refresh = refreshTrayMenu;
}

/**
 * Branche les handlers electron-updater une bonne fois pour toutes.
 * Les events utilises ici ne servent QUE au flux automatique (check au boot,
 * check periodique toutes les 4h) : le flux manuel est entierement pilote
 * par les promesses dans manualCheckForUpdates.
 */
export function updaterHooks(getWin: () => Electron.BrowserWindow | null) {
  const au = getAutoUpdater();
  if (!au || listenersRegistered) return;
  listenersRegistered = true;

  au.on("error", (err: Error) => {
    logger.error(`[Updater] Error: ${err?.message ?? err}`);
    downloadInProgress = false;
  });

  au.on("update-not-available", (info: UpdateInfo) => {
    logger.info(
      `[Updater] Up to date (auto check) — current ${app.getVersion()}, server ${info.version}`,
    );
  });

  au.on("update-available", async (info: UpdateInfo) => {
    logger.info(
      `[Updater] Update available (${info.version}) on channel "${updaterChannel}"`,
    );

    // Garde-fou contre le fallback cross-canal (cf. isVersionForChannel) :
    // si electron-updater nous sert une stable alors qu'on est en beta (ou
    // l'inverse), on ignore silencieusement — pas de download automatique.
    if (!isVersionForChannel(info.version, updaterChannel)) {
      logger.info(
        `[Updater] Ignoring cross-channel release v${info.version} (current channel "${updaterChannel}")`,
      );
      return;
    }

    // Sur un check manuel, c'est manualCheckForUpdates qui appelle
    // downloadUpdate apres confirmation utilisateur. On ne double pas.
    if (manualCheckInFlight || downloadInProgress) return;

    downloadInProgress = true;
    try {
      await au.downloadUpdate();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`[Updater] Auto download failed: ${message}`);
      downloadInProgress = false;
    }
  });

  au.on("download-progress", (p: ProgressInfo) => {
    logger.info(`[Updater] Downloading ${Math.round(p.percent)} %`);
  });

  au.on("update-downloaded", async (info: UpdateDownloadedEvent) => {
    logger.info(`[Updater] Update downloaded: v${info.version}`);
    downloadInProgress = false;

    const { response } = await showDialog(getWin, {
      type: "question",
      title: "LoL Skin Picker",
      message: "Update ready to install",
      detail:
        `Version ${info.version} has been downloaded (${channelLabel()} channel).\n\n` +
        `"Install and Restart" applies it now.\n` +
        `"Later" keeps you on the current version — the update will be applied when you quit the app.`,
      buttons: ["Install and Restart", "Later"],
      defaultId: 0,
      cancelId: 1,
    });

    if (response === 0) {
      // isSilent=true, isForceRunAfter=true : installe silencieusement puis relance.
      au.quitAndInstall(true, true);
    } else {
      // L'utilisateur a choisi "Later" : on arme l'install sur quit, ce qui
      // laisse une porte de sortie propre sans forcer la main.
      au.autoInstallOnAppQuit = true;
      logger.info("[Updater] User chose 'Later' — will install on next quit");
    }
  });
}

// Export pour app.ts (auto-check au demarrage + check periodique)
export { getAutoUpdater };
