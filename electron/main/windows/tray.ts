/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Tray, nativeImage, app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import path from "node:path";
import fs from "node:fs";

let tray: Tray | null = null;
let manualUpdateRequested = false;

function resPath(...p: string[]) {
  return app.isPackaged
    ? path.join(process.resourcesPath, ...p)
    : path.join(process.cwd(), ...p);
}

function fileIfExists(...p: string[]) {
  const full = resPath(...p);
  if (fs.existsSync(full)) return full;
  console.warn("[Tray] Not found:", full);
  return "";
}

function loadImageFromPath(p: string) {
  let img = nativeImage.createFromPath(p);
  if (!img.isEmpty()) return img;
  // Fallback: lecture brute (certains .ico-avec-PNG foirent via createFromPath)
  try {
    const buf = fs.readFileSync(p);
    img = nativeImage.createFromBuffer(buf);
  } catch (e) {
    console.warn("[Tray] readFileSync failed:", e);
  }
  return img;
}

function pickTrayImage() {
  // 1) Essayer l’ICO d’abord
  const ico = fileIfExists("assets", "icon.ico");
  if (ico) {
    const img = loadImageFromPath(ico);
    if (!img.isEmpty()) {
      console.log("[Tray] Using ICO:", ico, "size:", img.getSize());
      return img;
    }
    console.warn("[Tray] ICO empty, trying PNG fallback…");
  }

  // 2) Fallback PNG
  const png = fileIfExists("assets", "icon-32.png");
  if (png) {
    const img = loadImageFromPath(png);
    if (!img.isEmpty()) {
      console.log("[Tray] Using PNG:", png, "size:", img.getSize());
      return img;
    }
  }

  return nativeImage.createEmpty();
}

export function setupTray(getWin: () => Electron.BrowserWindow | null) {
  if (tray) return; // singleton

  console.log("[Tray] resourcesPath:", process.resourcesPath);
  console.log("[Tray] cwd:", process.cwd());

  const baseImg = pickTrayImage();
  if (baseImg.isEmpty()) {
    console.warn("[Tray] Aborting: no valid tray image");
    return;
  }

  // Windows aime bien ~16–20px en zone de notif (DPI dépendant).
  const trayImg = baseImg.resize({ width: 16, height: 16 });
  tray = new Tray(trayImg);
  tray.setToolTip("LoL Skin Picker");

  // Workaround: certaines versions d’Electron/Win ne “peignent” pas l’icône tout de suite.
  setTimeout(() => {
    try {
      tray?.setImage(trayImg);
      console.log("[Tray] setImage refresh done");
    } catch (e) {
      console.warn("[Tray] setImage failed:", e);
    }
  }, 500);

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
      const { dialog } = require("electron");
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
