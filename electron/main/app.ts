import { app, Menu, screen } from "electron";

import {
  LcuWatcher,
  type LcuStatus,
  type LockCreds,
} from "../services/lcuWatcher";
import { GameflowService } from "../services/gameflow.service";
import { SkinsService } from "../services/skins.service";
import { logger } from "../logger";

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
  app.commandLine.appendSwitch("disable-gpu-shader-disk-cache"); // evite le cache GPU
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

logger.info("[App] Initialisation de l'application");

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
  // positionnement restaure
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

  // persist ecran courant (debounce leger)
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
  // 1. Gestion de la connexion globale au client LoL
  lcu.on("status", (status: LcuStatus, creds?: LockCreds) => {
    getMainWindow()?.webContents.send("lcu-status", status);

    if (status === "connected" && creds) {
      // Le client vient de s'ouvrir : on demarre les services
      gameflow.setCreds(creds);
      skins.setCreds(creds);
      skins.start();

      // On affiche la fenetre au demarrage (sauf si une game est deja en cours,
      // ce qui sera corrige une fraction de seconde plus tard par l'event 'phase')
      getMainWindow()?.show();
    } else {
      // Le client s'est ferme : on arrete tout et on cache l'app
      gameflow.stop();
      skins.stop();
      getMainWindow()?.hide();
    }
  });

  // ---------------------------------------------------------
  // 2. AJOUT : Gestion de la visibilite selon la phase de jeu
  // ---------------------------------------------------------
  gameflow.on("phase", (phase: string) => {
    const win = getMainWindow();
    if (!win || win.isDestroyed()) return;

    // "InProgress" signifie que le joueur est en partie (ou ecran de chargement)
    if (phase === "InProgress") {
      if (win.isVisible()) {
        logger.info("[App] Partie detectee : Mise en veille de la fenetre");
        win.hide();
      }
    }
    // Toutes les autres phases (Lobby, ChampSelect, EndOfGame, None...)
    else {
      // On reaffiche la fenetre seulement si elle etait cachee
      // et que le client LoL est toujours connecte
      if (!win.isVisible() && lcu.isConnected()) {
        logger.info("[App] Fin de partie / Lobby : Reaffichage de la fenetre");
        win.show();
      }
    }
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  logger.warn("[App] Deuxieme instance detectee, fermeture de l'app");
  app.quit();
} else {
  app.on("second-instance", () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    logger.info("[App] Application prete, initialisation des services");
    registerAllIpc({ lcu, gameflow, skins, getWin: getMainWindow });
    wireDomainEvents();
    updaterHooks();

    await createWindowWithPrefs();

    lcu.start();
  });
}

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
