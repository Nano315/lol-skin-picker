/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Tray, nativeImage, app, dialog } from "electron";
import { autoUpdater } from "electron-updater";

let tray: Tray | null = null;
let manualUpdateRequested = false;

export function setupTray(
  resolveAsset: (p: string) => string,
  getWin: () => Electron.BrowserWindow | null
) {
  const trayIcon = nativeImage.createFromPath(resolveAsset("icon.ico"));
  tray = new Tray(trayIcon);
  tray.setToolTip("LoL Skin Picker");

  const toggleWindow = () => {
    const w = getWin();
    if (!w) return;
    if (w.isVisible()) {
      w.hide();
    } else {
      w.show();
      w.focus();
    }
  };

  const manualCheckForUpdates = () => {
    if (!app.isPackaged) {
      dialog.showMessageBox({
        type: "info",
        message: "Updates unavailable in dev",
      });
      return;
    }
    manualUpdateRequested = true;
    autoUpdater.checkForUpdates().catch((err) => {
      dialog.showErrorBox("Update error", err?.message ?? String(err));
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
  (setupTray as any).refresh = refreshTrayMenu;
}

export function updaterHooks() {
  const { autoUpdater } =
    require("electron-updater") as typeof import("electron-updater");

  autoUpdater.on("checking-for-update", () => {
    if (manualUpdateRequested) {
      const { dialog } = require("electron");
      dialog.showMessageBox({ message: "Checking for updates…" });
    }
  });

  autoUpdater.on("update-available", (info: any) => {
    if (manualUpdateRequested) {
      // app never used
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dialog, app } = require("electron");
      dialog.showMessageBox({
        type: "info",
        message: "Update available",
        detail: `Version ${info.version} is being downloaded in the background.`,
      });
    }
  });

  autoUpdater.on("update-not-available", () => {
    if (manualUpdateRequested) {
      const { dialog, app } = require("electron");
      dialog.showMessageBox({
        type: "info",
        message: "You're up to date",
        detail: `Current version: ${app.getVersion()}`,
      });
      manualUpdateRequested = false;
    }
  });

  autoUpdater.on("download-progress", (p: any) => {
    console.log(`[Updater] ${Math.round(p.percent)} %`);
  });

  autoUpdater.on("update-downloaded", (info: any) => {
    const { dialog } = require("electron");
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
        .then(({ response }: any) => {
          if (response === 0) autoUpdater.quitAndInstall();
        });
    } else {
      console.log("[Updater] downloaded – will install on quit");
    }
  });
}
