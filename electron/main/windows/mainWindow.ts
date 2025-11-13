import { BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;

export function getMainWindow() {
  return win;
}

function getPreloadPath() {
  return path.join(__dirname, "index.mjs");
}

function getIconPath() {
  if (app.isPackaged) {
    // en prod, electron-builder met icon.ico dans resources/
    return path.join(process.resourcesPath, "icon.ico");
  }
  // en dev, on va chercher dans public/
  return path.join(process.cwd(), "public", "icon.ico");
}

export async function createMainWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 645,
    resizable: false,
    maximizable: false,
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

  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const dist = path.join(process.cwd(), "dist");
    await win.loadFile(path.join(dist, "index.html"));
  }

  win.once("ready-to-show", () => win?.show());
  return win;
}
