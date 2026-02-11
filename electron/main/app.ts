import { app, Menu, screen } from "electron";

import {
  LcuWatcher,
  type LcuStatus,
  type LockCreds,
} from "../services/lcuWatcher";
import { GameflowService } from "../services/gameflow.service";
import { SkinsService } from "../services/skins.service";
import { skinLineService } from "../services/skinLineService";
import { logger } from "../logger";

import { createMainWindow, getMainWindow } from "./windows/mainWindow";
import { registerAllIpc } from "./ipc";
import { setupTray, updaterHooks, getAutoUpdater } from "./windows/tray";
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

// AUTO-UPDATE: Interval reference for cleanup on quit
let updateCheckInterval: NodeJS.Timeout | null = null;


async function createWindowWithPrefs() {
  // positionnement restaure
  const settings = await loadSettings();
  const displays = screen.getAllDisplays();

  const targetDisplay =
    displays.find((d) => d.id === settings.displayId) ??
    screen.getDisplayNearestPoint(screen.getCursorScreenPoint()) ??
    screen.getPrimaryDisplay();

  const w = await createMainWindow();

  // On deplace la fenetre sur l'ecran cible avant qu'elle ne s'affiche
  // (pour que le maximize se fasse sur le bon ecran)
  const { x, y } = targetDisplay.bounds;
  w.setPosition(x, y);

  // On force le maximize mnt (avant le ready-to-show qui le fera aussi, double sureté)
  // et SURTOUT on ne reset pas les bounds a 900x645
  if (!w.isVisible()) {
     // w.maximize() ici pourrait être prématuré si ready-to-show n'a pas fire,
     // mais mainWindow.ts s'occupe du maximize au ready-to-show.
     // L'important est de NE PAS appeler setBounds avec une taille fixe ici.
  }

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
      const w = getMainWindow();
      if (w) {
          if (w.isMinimized()) w.restore();
          w.show();
          w.maximize(); // Force maximize au démarrage connecté
      }
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
        win.maximize(); // Force maximize au retour de game
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
      win.show();
      win.focus();
      win.maximize(); // UX Request: Force maximize on restore
    }
  });

  app.whenReady().then(async () => {
    logger.info("[App] Application prete, initialisation des services");

    // Initialize skin line service (Story 6.1) - fetches CDragon data if cache expired
    await skinLineService.initialize();

    registerAllIpc({ lcu, gameflow, skins, getWin: getMainWindow });
    wireDomainEvents();
    updaterHooks(getMainWindow);

    await createWindowWithPrefs();

    lcu.start();

    // AUTO-UPDATE: Check 10s after startup (AC: 1)
    setTimeout(() => {
      logger.info("[Updater] Auto-check at startup");
      getAutoUpdater()?.checkForUpdates().catch((err) => {
        console.error("[Updater] Startup check failed:", err);
      });
    }, 10000);

    // AUTO-UPDATE: Check every 4 hours (AC: 2)
    updateCheckInterval = setInterval(() => {
      logger.info("[Updater] Periodic check (4h interval)");
      getAutoUpdater()?.checkForUpdates().catch((err) => {
        console.error("[Updater] Periodic check failed:", err);
      });
    }, 14400000); // 4 hours in ms
  });
}

// AUTO-UPDATE: Cleanup interval on quit
app.on("before-quit", () => {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
});

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
