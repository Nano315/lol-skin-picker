import { ipcMain, BrowserWindow } from "electron";
import { SkinsService } from "../../services/skins.service";
import { track } from "../telemetry";

export function registerSkinsIpc(
  svc: SkinsService,
  getWin: () => BrowserWindow | null
) {
  ipcMain.handle("get-owned-skins", () => svc.skins);

  ipcMain.handle("get-include-default", () => svc.getIncludeDefault());
  ipcMain.handle("toggle-include-default", () => {
    svc.toggleIncludeDefault();
    track("setting_changed", { key: "include_default", value: svc.getIncludeDefault() });
  });
  ipcMain.handle("set-include-default", (_e, v: boolean) => {
    svc.setIncludeDefault(!!v);
    track("setting_changed", { key: "include_default", value: !!v });
  });

  ipcMain.handle("get-auto-roll", () => svc.getAutoRoll());
  ipcMain.handle("toggle-auto-roll", () => {
    svc.toggleAutoRoll();
    track("setting_changed", { key: "auto_roll", value: svc.getAutoRoll() });
  });
  ipcMain.handle("set-auto-roll", (_e, v: boolean) => {
    svc.setAutoRoll(!!v);
    track("setting_changed", { key: "auto_roll", value: !!v });
  });

  ipcMain.handle("get-performance-mode", () => svc.getPerformanceMode());
  ipcMain.handle("toggle-performance-mode", () => {
    svc.togglePerformanceMode();
    track("setting_changed", { key: "performance_mode", value: svc.getPerformanceMode() });
  });
  ipcMain.handle("set-performance-mode", (_e, v: boolean) => {
    svc.setPerformanceMode(!!v);
    track("setting_changed", { key: "performance_mode", value: !!v });
  });

  ipcMain.handle("reroll-skin", () => svc.rerollSkin());
  ipcMain.handle("reroll-chroma", () => svc.rerollChroma());

  ipcMain.handle("get-selection", () => svc.getSelection());
  ipcMain.handle("get-summoner-icon", () => svc.getProfileIcon());

  ipcMain.handle("get-summoner-name", () => svc.getSummonerName());
  svc.on("summoner-name", (name) =>
    getWin()?.webContents.send("summoner-name", name)
  );

  ipcMain.handle("apply-skin-id", (_e, skinId: unknown) => {
    if (
      typeof skinId !== "number" ||
      !Number.isInteger(skinId) ||
      skinId < 0 ||
      skinId > 1_000_000_000
    ) {
      return false;
    }
    return svc.applySkin(skinId);
  });

  svc.on("skins", (list) => getWin()?.webContents.send("owned-skins", list));
  svc.on("selection", (sel) => getWin()?.webContents.send("selection", sel));
  svc.on("icon", (id) => getWin()?.webContents.send("summoner-icon", id));
}
