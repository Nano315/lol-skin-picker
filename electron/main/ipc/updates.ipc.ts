import { ipcMain } from "electron";
import { logger } from "../../logger";
import {
  checkForUpdates,
  downloadUpdate,
  getUpdateState,
  installUpdate,
} from "../windows/tray";

/**
 * IPC pour la pastille in-app affichee dans la title bar custom.
 *
 * Le main process est la source de verite : c'est lui qui pilote
 * electron-updater (cf. tray.ts) et qui broadcast l'etat via le canal
 * "updates:status" a chaque transition. Le renderer s'y abonne via
 * le preload et peut aussi recuperer l'etat courant a la demande
 * (utile au mount du composant, apres reload, etc.).
 *
 * Les actions (check, download, install) sont aussi exposees pour
 * que la pastille puisse declencher le flow sans dialog tray.
 */
export function registerUpdatesIpc() {
  ipcMain.handle("updates:getState", () => getUpdateState());

  ipcMain.handle("updates:check", async () => {
    try {
      await checkForUpdates();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`[Updater] IPC check failed: ${message}`);
      throw err;
    }
  });

  ipcMain.handle("updates:download", async () => {
    try {
      await downloadUpdate();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`[Updater] IPC download failed: ${message}`);
      throw err;
    }
  });

  ipcMain.handle("updates:install", () => {
    installUpdate();
  });
}
