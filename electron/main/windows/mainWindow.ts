import { BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;

export function getMainWindow() {
  return win;
}

export async function createMainWindow() {
  const preloadPath = path.join(__dirname, "index.mjs");

  win = new BrowserWindow({
    width: 900,
    height: 645,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const dist = path.join(process.cwd(), "dist");
    await win.loadFile(path.join(dist, "index.html"));
  }

  win.once("ready-to-show", () => win?.show());
  return win;
}
