import { app, Menu, screen } from "electron";

import {
  LcuWatcher,
  type LcuStatus,
  type LockCreds,
} from "../services/lcuWatcher";
import { GameflowService } from "../services/gameflow.service";
import { SkinsService } from "../services/skins.service";

import { createMainWindow, getMainWindow } from "./windows/mainWindow";
import { registerAllIpc } from "./ipc";
import { setupTray, updaterHooks } from "./windows/tray";
import { loadSettings, saveSettings } from "./settings";
import path from "node:path";

// Dev only: isole le profil et le cache Chromium
if (!app.isPackaged) {
  const devUserData = path.join(app.getPath("appData"), "lol-skin-picker-dev");
  app.setPath("userData", devUserData);
  app.commandLine.appendSwitch(
    "disk-cache-dir",
    path.join(devUserData, "Cache")
  );
  app.commandLine.appendSwitch("disable-gpu-shader-disk-cache"); // évite le cache GPU
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const lcu = new LcuWatcher();
const gameflow = new GameflowService();
const skins = new SkinsService();

function centerInDisplay(d: Electron.Display, width: number, height: number) {
  const wa = d.workArea;
  const x = Math.floor(wa.x + (wa.width - width) / 2);
  const y = Math.floor(wa.y + (wa.height - height) / 2);
  return { x, y };
}

async function createWindowWithPrefs() {
  // positionnement restauré
  const settings = await loadSettings();
  const displays = screen.getAllDisplays();
  const width = 900,
    height = 645;

  const targetDisplay =
    displays.find((d) => d.id === settings.displayId) ??
    screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ??
    screen.getPrimaryDisplay();

  const w = await createMainWindow();
  const { x, y } = centerInDisplay(targetDisplay, width, height);
  w.setBounds({ x, y, width, height });

  Menu.setApplicationMenu(null);
  setupTray(getMainWindow);

  // persist écran courant (debounce léger)
  let moveTimer: NodeJS.Timeout | null = null;
  const persist = () => {
    const current = getMainWindow();
    if (!current) return;
    const d = screen.getDisplayMatching(current.getBounds());
    saveSettings({ displayId: d.id }).catch(() => {});
  };
  w.on("move", () => {
    if (moveTimer) clearTimeout(moveTimer);
    moveTimer = setTimeout(persist, 300);
  });
  w.on("close", persist);
  w.on("hide", persist);
}

function wireDomainEvents() {
  lcu.on("status", (status: LcuStatus, creds?: LockCreds) => {
    getMainWindow()?.webContents.send("lcu-status", status);
    if (status === "connected" && creds) {
      getMainWindow()?.show();

      gameflow.setCreds(creds);
      skins.setCreds(creds);
      skins.start();
    } else {
      gameflow.stop();
      skins.stop();
      getMainWindow()?.hide();
    }
  });
}

app.whenReady().then(async () => {
  await createWindowWithPrefs();
  setupTray(getMainWindow);
  registerAllIpc({ lcu, gameflow, skins, getWin: getMainWindow });
  wireDomainEvents();
  updaterHooks();

  lcu.start();
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
