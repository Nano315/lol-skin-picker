import { ipcMain } from "electron";
import {
  getHistorySettings,
  setHistorySettings,
  getRecentHistory,
  clearHistory,
  addSkinToHistory,
  type HistoryEntry,
} from "../history";
import type { SkinsService } from "../../services/skins.service";

export function registerHistoryIpc(skins?: SkinsService) {
  ipcMain.handle("get-history-settings", () => getHistorySettings());

  ipcMain.handle(
    "set-history-settings",
    async (_e, settings: { historySize?: number; historyEnabled?: boolean }) => {
      await setHistorySettings(settings);
      // Sync with SkinsService
      if (skins) {
        if (settings.historySize !== undefined) {
          skins.setHistorySize(settings.historySize);
        }
        if (settings.historyEnabled !== undefined) {
          skins.setHistoryEnabled(settings.historyEnabled);
        }
      }
    }
  );

  ipcMain.handle("get-recent-history", (_e, championId: number) =>
    getRecentHistory(championId)
  );

  ipcMain.handle(
    "add-to-history",
    async (_e, championId: number, skinId: number, chromaId: number) => {
      const settings = await getHistorySettings();
      const entry: HistoryEntry = {
        skinId,
        chromaId,
        timestamp: Date.now(),
      };
      await addSkinToHistory(championId, entry, settings.historySize);
    }
  );

  ipcMain.handle("clear-history", (_e, championId?: number) =>
    clearHistory(championId)
  );
}
