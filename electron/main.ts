import { app, BrowserWindow, ipcMain } from "electron";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import fetch from "node-fetch";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // certificat auto-signé

/* ── ESM helpers ─────────────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ── Types & state ───────────────────────── */
type LcuStatus = "connected" | "disconnected";
let lcuStatus: LcuStatus = "disconnected";
let gameflowPhase = "Unknown";

let win: BrowserWindow | null = null;
let gameflowTimer: ReturnType<typeof setInterval> | null = null;

/* ── Lockfile helpers ────────────────────── */
const LOCKFILE_PATHS = [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile",
];

interface LockCreds {
  port: string;
  password: string;
  protocol: string; // normally https
}
let creds: LockCreds | null = null;

function readLockfile(): string | null {
  for (const p of LOCKFILE_PATHS) {
    try {
      return fs.readFileSync(p, "utf8");
    // eslint-disable-next-line no-empty
    } catch {}
  }
  return null;
}

function parseLock(line: string): LockCreds | null {
  const parts = line.trim().split(":");
  // format: ProcessName:PID:Port:Password:Protocol
  if (parts.length < 5) return null;
  return { port: parts[2], password: parts[3], protocol: parts[4] };
}

/* ── Gameflow polling ────────────────────── */
async function pollGameflow() {
  if (!creds) return;
  const url = `${creds.protocol}://127.0.0.1:${creds.port}/lol-gameflow/v1/gameflow-phase`;
  const auth = Buffer.from(`riot:${creds.password}`).toString("base64");

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) throw new Error(String(res.status));
    let txt = await res.text(); // string e.g. "ChampSelect"
    txt = txt.replace(/"/g, "");
    if (txt !== gameflowPhase) {
      gameflowPhase = txt;
      win?.webContents.send("gameflow-phase", gameflowPhase);
    }
  } catch {
    // échec → probablement déconnecté
    stopPolling();
    setDisconnected();
  }
}

function startPolling() {
  if (gameflowTimer) return;
  gameflowTimer = setInterval(pollGameflow, 2000);
}
function stopPolling() {
  if (gameflowTimer) clearInterval(gameflowTimer);
  gameflowTimer = null;
}

/* ── LCU watcher ─────────────────────────── */
function setDisconnected() {
  if (lcuStatus !== "disconnected") {
    lcuStatus = "disconnected";
    creds = null;
    gameflowPhase = "Unknown";
    win?.webContents.send("lcu-status", lcuStatus);
    win?.webContents.send("gameflow-phase", gameflowPhase);
  }
}

function watchLcu() {
  setInterval(() => {
    const raw = readLockfile();
    if (!raw) {
      setDisconnected();
      return;
    }

    if (lcuStatus === "disconnected") {
      const parsed = parseLock(raw);
      if (!parsed) return;
      creds = parsed;
      lcuStatus = "connected";
      win?.webContents.send("lcu-status", lcuStatus);
      startPolling();
      pollGameflow(); // première requête immédiate
    }
  }, 2000);
}

/* ── Fenêtre & IPC ───────────────────────── */
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

  watchLcu();
}

ipcMain.handle("get-lcu-status", () => lcuStatus);
ipcMain.handle("get-gameflow-phase", () => gameflowPhase);

app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
