import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { LcuWatcher, type LcuStatus, type LockCreds } from "./lcu.js";
import { GameflowWatcher } from "./gameflow.js";
import { ChampionSkinWatcher, type OwnedSkin } from "./championSkins.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ---------------- instances ---------------- */
let win: BrowserWindow | null = null;

const lcu = new LcuWatcher();
const gameflow = new GameflowWatcher();
const skins = new ChampionSkinWatcher();

let tray: Tray | null = null;

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
function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 645, // 563
    resizable: false, // ← l’utilisateur ne peut plus redimensionner
    maximizable: false, // ← désactive le bouton “plein écran” (Windows / Linux)
    fullscreenable: false, // ← désactive ⌥⌘F sur macOS
    icon: join(__dirname, "../public/icon.ico"),
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null); // supprime entièrement la barre de menu

  /* ---- icône de tray (caché / affiché) ---- */
  const trayIcon = nativeImage.createFromPath(
    join(__dirname, "../public/icon.ico")
  );
  tray = new Tray(trayIcon);
  tray.setToolTip("LoL Skin Picker");
  tray.on("double-click", () => (win!.isVisible() ? win!.hide() : win!.show()));

  if (process.env.VITE_DEV_SERVER_URL) {
    // mode dev
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    //win.webContents.openDevTools();
  } else {
    // *** production ***
    win.loadFile(join(__dirname, "..", "dist", "index.html"));
  }

  lcu.start(); // déclenche toute la chaîne
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

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
