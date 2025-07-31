import { ipcMain, app, BrowserWindow } from "electron";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let status = "disconnected";
let win = null;
const LOCKFILE_PATHS = [
  "C:\\Riot Games\\League of Legends\\lockfile",
  "C:\\Program Files\\Riot Games\\League of Legends\\lockfile"
];
function readLockfile() {
  for (const p of LOCKFILE_PATHS) {
    try {
      return fs.readFileSync(p, "utf8");
    } catch {
    }
  }
  return null;
}
function watchLcu() {
  setInterval(() => {
    const data = readLockfile();
    const newStatus = data ? "connected" : "disconnected";
    if (newStatus !== status) {
      status = newStatus;
      win == null ? void 0 : win.webContents.send("lcu-status", status);
    }
  }, 2e3);
}
function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: join(__dirname, "preload.mjs"),
      contextIsolation: true
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
  watchLcu();
}
ipcMain.handle("get-lcu-status", () => status);
app.whenReady().then(createWindow);
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
