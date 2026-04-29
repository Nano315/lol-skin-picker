import { ipcMain } from "electron";
import type { ChampionLibraryService } from "../../services/championLibrary.service";

export function registerChampionLibraryIpc(svc: ChampionLibraryService) {
  ipcMain.handle("championLibrary:getOwned", () => svc.getOwnedChampions());

  ipcMain.handle("championLibrary:getSkins", (_e, championId: number) =>
    svc.getSkinsForChampion(championId)
  );

  ipcMain.handle("championLibrary:invalidate", () => {
    svc.invalidateCache();
  });
}
