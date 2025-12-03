import { ipcMain, BrowserWindow } from "electron";
import { SkinsService } from "../../services/skins.service";

export function registerSkinsIpc(
  svc: SkinsService,
  getWin: () => BrowserWindow | null
) {
  ipcMain.handle("get-owned-skins", () => svc.skins);

  ipcMain.handle("get-include-default", () => svc.getIncludeDefault());
  ipcMain.handle("toggle-include-default", () => svc.toggleIncludeDefault());
  ipcMain.handle("set-include-default", (_e, v: boolean) =>
    svc.setIncludeDefault(!!v)
  );

  ipcMain.handle("get-auto-roll", () => svc.getAutoRoll());
  ipcMain.handle("toggle-auto-roll", () => svc.toggleAutoRoll());
  ipcMain.handle("set-auto-roll", (_e, v: boolean) => svc.setAutoRoll(!!v));

  ipcMain.handle("get-performance-mode", () => svc.getPerformanceMode());
  ipcMain.handle("toggle-performance-mode", () => svc.togglePerformanceMode());
  ipcMain.handle("set-performance-mode", (_e, v: boolean) =>
    svc.setPerformanceMode(!!v)
  );

  ipcMain.handle("reroll-skin", () => svc.rerollSkin());
  ipcMain.handle("reroll-chroma", () => svc.rerollChroma());

  ipcMain.handle("get-selection", () => svc.getSelection());
  ipcMain.handle("get-summoner-icon", () => svc.getProfileIcon());

  ipcMain.handle("get-summoner-name", () => svc.getSummonerName());
  svc.on("summoner-name", (name) =>
    getWin()?.webContents.send("summoner-name", name)
  );

  ipcMain.handle("apply-skin-id", (_e, skinId: number) =>
    svc.applySkin(skinId)
  );

  svc.on("skins", (list) => getWin()?.webContents.send("owned-skins", list));
  svc.on("selection", (sel) => getWin()?.webContents.send("selection", sel));
  svc.on("icon", (id) => getWin()?.webContents.send("summoner-icon", id));
}
