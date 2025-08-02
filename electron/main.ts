import { app, BrowserWindow, ipcMain } from "electron";
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

/* ---------------- relais vers renderer ---------------- */
lcu.on("status", (status: LcuStatus, creds?: LockCreds) => {
  win?.webContents.send("lcu-status", status);

  if (status === "connected" && creds) {
    /* (re)déploie TOUT avec les nouvelles credenciales */
    gameflow.setCreds(creds);

    skins.setCreds(creds); // hard-reset
    skins.start(); // démarre immédiatement, même hors ChampSelect
  } else {
    gameflow.stop();
    skins.stop();
  }
});

gameflow.on("phase", (phase) => {
  win?.webContents.send("gameflow-phase", phase);
  /* plus besoin de start/stop ici */
});

skins.on("skins", (list: OwnedSkin[]) => {
  win?.webContents.send("owned-skins", list);
});

/* ---------------- fenêtre ---------------- */
function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  lcu.start(); // déclenche toute la chaîne
}

/* ---------------- IPC synchrone ---------------- */
ipcMain.handle("get-lcu-status", () => lcu.status);
ipcMain.handle("get-gameflow-phase", () => gameflow.phase);
ipcMain.handle("get-owned-skins", () => skins.skins);

ipcMain.handle("get-include-default", () => skins.getIncludeDefault());
ipcMain.handle("toggle-include-default", () => skins.toggleIncludeDefault());

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
