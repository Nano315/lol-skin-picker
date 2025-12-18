import { Menu, Tray, nativeImage, app, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import type {
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo,
} from "electron-updater";

const require = createRequire(import.meta.url);

let tray: Tray | null = null;
let manualUpdateRequested = false;

// Type util pour autoUpdater
type AutoUpdater = typeof import("electron-updater")["autoUpdater"];
let autoUpdater: AutoUpdater | null = null;

/**
 * Charge electron-updater uniquement en prod, et de façon safe.
 */
function getAutoUpdater(): AutoUpdater | null {
  if (!app.isPackaged) {
    // Pas d'auto-update en dev
    return null;
  }

  if (autoUpdater) return autoUpdater;

  try {
    ({ autoUpdater } =
      require("electron-updater") as typeof import("electron-updater"));
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

export function setupTray(getWin: () => Electron.BrowserWindow | null) {
  const iconPath = getTrayIconPath();

  if (!iconPath) {
    console.warn("[Tray] icon not found; check extraResources and paths");
    return;
  }

  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);
  tray.setToolTip("LoL Skin Picker");

  const toggleWindow = () => {
    const w = getWin();
    if (!w) return;
    if (w.isVisible() && w.isFocused()) {
      // Si visible et au premier plan, on cache
      w.hide();
    } else {
      // Sinon on montre, restaure et maximize
      if (w.isMinimized()) w.restore();
      w.show();
      w.focus();
      w.maximize();
    }
  };

    const manualCheckForUpdates = () => {
      const au = getAutoUpdater();

      if (!au) {
        dialog.showMessageBox({
          type: "info",
          message: app.isPackaged
            ? "Auto-update unavailable."
            : "Updates unavailable in dev",
        });
        return;
      }

      manualUpdateRequested = true;
      au
        .checkForUpdates()
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          dialog.showErrorBox("Update error", message);
          manualUpdateRequested = false;
        });
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

    // petite API interne
    const trayApi = setupTray as typeof setupTray & { refresh?: () => void };
    trayApi.refresh = refreshTrayMenu;
  }

export function updaterHooks() {
  const au = getAutoUpdater();
  if (!au) return;

  au.on("checking-for-update", () => {
    if (manualUpdateRequested) {
      dialog.showMessageBox({ type: "info", message: "Checking for updates…" });
    }
  });

    au.on("update-available", (info: UpdateInfo) => {
    if (manualUpdateRequested) {
      dialog.showMessageBox({
        type: "info",
        message: "Update available",
        detail: `Version ${info.version} is being downloaded in the background.`,
      });
    }
  });

  au.on("update-not-available", () => {
    if (manualUpdateRequested) {
      dialog.showMessageBox({
        type: "info",
        message: "You're up to date",
        detail: `Current version: ${app.getVersion()}`,
      });
      manualUpdateRequested = false;
    }
  });

    au.on("download-progress", (p: ProgressInfo) => {
      console.log(`[Updater] ${Math.round(p.percent)} %`);
    });

    au.on("update-downloaded", (info: UpdateDownloadedEvent) => {
      if (manualUpdateRequested) {
        manualUpdateRequested = false;
        dialog
        .showMessageBox({
          type: "question",
          buttons: ["Install and Restart", "Later"],
          defaultId: 0,
          cancelId: 1,
          message: "Update ready",
          detail: `Version ${info.version} has been downloaded.`,
        })
          .then(({ response }) => {
            if (response === 0) au.quitAndInstall();
          });
      } else {
        console.log("[Updater] downloaded – will install on quit");
      }
    });
  }
