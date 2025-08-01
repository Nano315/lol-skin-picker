import { app, BrowserWindow, ipcMain } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LcuWatcher, type LockCreds, type LcuStatus } from "./lcu.js";
import { GameflowWatcher } from "./gameflow.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win: BrowserWindow | null = null;

/* ── Instancie les watchers ───────────────── */
const lcu = new LcuWatcher();
const gameflow = new GameflowWatcher();

/* Relais vers le renderer */
lcu.on("status", (status: LcuStatus, creds?: LockCreds) => {
  win?.webContents.send("lcu-status", status);
  if (status === "connected" && creds) {
    gameflow.setCreds(creds);
  } else {
    gameflow.stop();
  }
});

gameflow.on("phase", (phase) => {
  win?.webContents.send("gameflow-phase", phase);
});

/* ── Fenêtre ──────────────────────────────── */
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

  lcu.start(); // lance la surveillance
}

/* ── IPC sync (renderer → main) ───────────── */
ipcMain.handle("get-lcu-status", () => lcu.status);
ipcMain.handle("get-gameflow-phase", () => gameflow.phase);

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
