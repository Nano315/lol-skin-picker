import { ipcMain } from "electron";
import {
  getExclusions,
  setExcluded,
  bulkSetExcluded,
  clearExclusions,
  getAllExclusions,
} from "../exclusions";
import { track } from "../telemetry";

export function registerExclusionsIpc() {
  ipcMain.handle("exclusions:get", (_e, championId: number) =>
    getExclusions(championId)
  );

  ipcMain.handle("exclusions:get-all", () => getAllExclusions());

  ipcMain.handle(
    "exclusions:set",
    (_e, championId: number, id: number, excluded: boolean) => {
      track("skin_exclusion_changed", {
        excluded,
        bulk: false,
        count: 1,
      });
      return setExcluded(championId, id, excluded);
    }
  );

  ipcMain.handle(
    "exclusions:bulk-set",
    (_e, championId: number, ids: number[], excluded: boolean) => {
      track("skin_exclusion_changed", {
        excluded,
        bulk: true,
        count: ids.length,
      });
      return bulkSetExcluded(championId, ids, excluded);
    }
  );

  ipcMain.handle("exclusions:clear", (_e, championId?: number) => {
    track("skin_exclusions_cleared", {
      scope: championId !== undefined ? "champion" : "all",
    });
    return clearExclusions(championId);
  });
}
