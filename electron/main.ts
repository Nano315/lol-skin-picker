import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  Tray,
  nativeImage,
  screen,
} from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { LcuWatcher, type LcuStatus, type LockCreds } from "./lcu.js";
import { GameflowWatcher } from "./gameflow.js";
import { ChampionSkinWatcher, type OwnedSkin } from "./championSkins.js";

import { autoUpdater } from "electron-updater";

import { promises as fs } from "node:fs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ---------------- instances ---------------- */
let win: BrowserWindow | null = null;

const lcu = new LcuWatcher();
const gameflow = new GameflowWatcher();
const skins = new ChampionSkinWatcher();

let tray: Tray | null = null;

// ---- settings (persist écran) ----
type Settings = { displayId?: number };
const settingsPath = join(app.getPath("userData"), "settings.json");

async function loadSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(settingsPath, "utf-8");
    return JSON.parse(raw) as Settings;
  } catch {
    return {};
  }
}

async function saveSettings(s: Settings) {
  try {
    // le dossier userData existe déjà, mais au cas où :
    await fs.writeFile(settingsPath, JSON.stringify(s, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
}

function centerInDisplay(d: Electron.Display, width: number, height: number) {
  const wa = d.workArea; // zone utile (sans la barre des tâches)
  const x = Math.floor(wa.x + (wa.width - width) / 2);
  const y = Math.floor(wa.y + (wa.height - height) / 2);
  return { x, y };
}

/* ---------------- relais vers renderer ---------------- */
lcu.on("status", (status: LcuStatus, creds?: LockCreds) => {
  win?.webContents.send("lcu-status", status);

  if (status === "connected" && creds) {
    win?.show();
    /* (re)déploie TOUT avec les nouvelles credenciales */
    gameflow.setCreds(creds);

    skins.setCreds(creds); // hard-reset
    skins.start(); // démarre immédiatement, même hors ChampSelect
  } else {
    gameflow.stop();
    skins.stop();
    win?.hide();
  }
});

gameflow.on("phase", (phase) => {
  win?.webContents.send("gameflow-phase", phase);
  /* plus besoin de start/stop ici */
});

/* ---------------- relais vers renderer ---------------- */
skins.on(
  "skins",
  ((list: OwnedSkin[]) => {
    win?.webContents.send("owned-skins", list);
  }) as (...args: unknown[]) => void // ← cast ajouté
);

skins.on("selection", ((sel) => win?.webContents.send("selection", sel)) as (
  ...args: unknown[]
) => void);

skins.on("icon", (id: number) => {
  win?.webContents.send("summoner-icon", id);
});

/* ---------------- fenêtre ---------------- */
async function createWindow() {
  const resolveAsset = (relPath: string) =>
    app.isPackaged
      ? join(process.resourcesPath, relPath)
      : join(__dirname, "..", "public", relPath);

  // --- récupère écran sauvegardé + choisit un écran valide ---
  const settings = await loadSettings();
  const displays = screen.getAllDisplays();
  const width = 900;
  const height = 645;

  let targetDisplay =
    displays.find((d) => d.id === settings.displayId) ??
    screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ??
    screen.getPrimaryDisplay();

  const { x, y } = centerInDisplay(targetDisplay, width, height);

  win = new BrowserWindow({
    x, // <— on force la position centrée sur l’écran choisi
    y,
    width,
    height,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    icon: resolveAsset("icon.ico"),
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  const trayIcon = nativeImage.createFromPath(resolveAsset("icon.ico"));
  tray = new Tray(trayIcon);
  tray.setToolTip("LoL Skin Picker");
  tray.on("double-click", () => (win!.isVisible() ? win!.hide() : win!.show()));

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await win.loadFile(join(__dirname, "..", "dist", "index.html"));
  }

  // ---- persiste l'écran courant (avec petit debounce) ----
  let moveTimer: NodeJS.Timeout | null = null;
  const persistCurrentDisplay = () => {
    if (!win) return;
    const d = screen.getDisplayMatching(win.getBounds());
    saveSettings({ displayId: d.id }).catch(() => {});
  };

  win.on("move", () => {
    if (moveTimer) clearTimeout(moveTimer);
    moveTimer = setTimeout(persistCurrentDisplay, 300);
  });
  // pour être sûr de sauvegarder si l’utilisateur ferme tout de suite
  win.on("close", persistCurrentDisplay);
  win.on("hide", persistCurrentDisplay);

  lcu.start();
}

/* ------------------------------------------------------------ */
function initAutoUpdate() {
  // Ne cherche des updates qu'en production
  if (!app.isPackaged) return;

  autoUpdater.on("checking-for-update", () =>
    console.log("[Updater] checking…")
  );
  autoUpdater.on("update-available", (info) =>
    console.log("[Updater] available", info.version)
  );
  autoUpdater.on("update-not-available", () => console.log("[Updater] none"));
  autoUpdater.on("download-progress", (p) =>
    console.log(`[Updater] ${Math.round(p.percent)} %`)
  );
  autoUpdater.on("update-downloaded", () => {
    console.log("[Updater] downloaded – will install on quit");
    // Installe silencieusement au prochain quit,
    // ou autoUpdater.quitAndInstall() si tu veux le faire immédiatement.
  });

  // Lance la recherche (et download + install silencieuse)
  autoUpdater.checkForUpdatesAndNotify();
}

/* ---------------- IPC synchrone ---------------- */
ipcMain.handle("get-lcu-status", () => lcu.status);
ipcMain.handle("get-gameflow-phase", () => gameflow.phase);
ipcMain.handle("get-owned-skins", () => skins.skins);

ipcMain.handle("get-include-default", () => skins.getIncludeDefault());
ipcMain.handle("toggle-include-default", () => skins.toggleIncludeDefault());
ipcMain.handle("reroll-skin", () => skins.rerollSkin());
ipcMain.handle("reroll-chroma", () => skins.rerollChroma());
ipcMain.handle("get-selection", () => skins.getSelection());
ipcMain.handle("get-auto-roll", () => skins.getAutoRoll());
ipcMain.handle("toggle-auto-roll", () => skins.toggleAutoRoll());

ipcMain.handle("get-summoner-icon", () => skins.getProfileIcon());

app.whenReady().then(() => {
  createWindow();
  initAutoUpdate();
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
