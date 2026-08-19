import { BrowserWindow, app } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDevServerUrl } from "./harden";

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
    titleBarStyle: "hidden",
    backgroundColor: "#09090b",
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Garde-fous : installes globalement par `app.on("web-contents-created")`,
  // qui se declenche pendant le `new BrowserWindow` ci-dessus — donc deja en
  // place avant le premier chargement.

  const devServerUrl = getDevServerUrl();
  if (devServerUrl) {
    await win.loadURL(devServerUrl);
    // Open DevTools in dev mode
    win.webContents.openDevTools();
  } else {
    const indexHtml = path.join(__dirname, "../dist/index.html");
    await win.loadFile(indexHtml);
  }

  win.on("maximize", () => {
    win?.webContents.send("window:maximize-change", true);
  });
  win.on("unmaximize", () => {
    win?.webContents.send("window:maximize-change", false);
  });

  win.once("ready-to-show", () => {
    if (win) {
      win.maximize(); // Maximise la fenetre (plein ecran fenetre)
      win.show();
    }
  });

  return win;
}
