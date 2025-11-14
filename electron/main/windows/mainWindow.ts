import { BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Taille & ratio de base
const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 645;
// 900x645 simplifié = 60/43
const WINDOW_ASPECT_RATIO = 60 / 43;

let win: BrowserWindow | null = null;

export function getMainWindow() {
  return win;
}

function getPreloadPath() {
  return path.join(__dirname, "index.mjs");
}

function getIconPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "icon.ico");
  }
  return path.join(process.cwd(), "public", "icon.ico");
}

export async function createMainWindow() {
  win = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    minWidth: DEFAULT_WIDTH,
    minHeight: DEFAULT_HEIGHT,
    resizable: true,
    maximizable: true,
    fullscreenable: false,

    show: false,
    icon: getIconPath(),
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Verrouille le ratio 60/43 (≈ 900x645)
  win.setAspectRatio(WINDOW_ASPECT_RATIO);

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexHtml = path.join(__dirname, "../dist/index.html");
    await win.loadFile(indexHtml);
  }

  win.once("ready-to-show", () => win?.show());
  return win;
}
