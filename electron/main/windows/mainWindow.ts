import { BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIN_WIDTH = 900;
const MIN_HEIGHT = 645;

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
    width: 1280,
    height: 720,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    resizable: true,
    maximizable: true,
    fullscreenable: true,

    show: false,
    icon: getIconPath(),
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexHtml = path.join(__dirname, "../dist/index.html");
    await win.loadFile(indexHtml);
  }

  win.once("ready-to-show", () => {
    if (win) {
      win.maximize(); // Maximise la fenêtre (plein écran fenêtré)
      win.show();
    }
  });

  return win;
}
