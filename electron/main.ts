import { app, BrowserWindow, ipcMain } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // cert LCU auto-signé

/* ─── ESM -> __dirname/__filename ─── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ─── Détection LCU ─── */
type LcuStatus = "connected" | "disconnected";
let status: LcuStatus = "disconnected";
let win: BrowserWindow | null = null;

/** chemins classiques du lockfile sur Windows */
const LOCKFILE_PATHS = [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile",
];

function readLockfile(): string | null {
  for (const p of LOCKFILE_PATHS) {
    try {
      return fs.readFileSync(p, "utf8");
    } catch {
      /* file absent */
    }
  }
  return null;
}

function watchLcu(): void {
  setInterval(() => {
    const data = readLockfile();
    const newStatus: LcuStatus = data ? "connected" : "disconnected";
    if (newStatus !== status) {
      status = newStatus;
      win?.webContents.send("lcu-status", status); // push vers renderer
    }
  }, 2000);
}

/* ─── Fenêtre ─── */
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

  watchLcu(); // démarre la surveillance
}

/* ─── IPC ─── */
ipcMain.handle("get-lcu-status", () => status);

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
