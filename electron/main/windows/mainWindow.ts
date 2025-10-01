import { BrowserWindow } from "electron";
import path from "node:path";

let win: BrowserWindow | null = null;

export function getMainWindow() {
  return win;
}

export async function createMainWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 645,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "..", "..", "preload", "index.js"),
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
