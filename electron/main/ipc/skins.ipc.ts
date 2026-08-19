import { ipcMain } from "electron";
import { SkinsService } from "../../services/skins.service";
import { track } from "../telemetry";
import { broadcast } from "../windows/broadcast";

export function registerSkinsIpc(svc: SkinsService) {
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
  ipcMain.handle("reroll-skin-only", () => svc.rerollSkinOnly());
  ipcMain.handle("reroll-chroma", () => svc.rerollChroma());

  ipcMain.handle("get-match-lock", () => svc.getMatchLock());
  ipcMain.handle("set-match-lock", (_e, locked: unknown) => {
    const next = !!locked;
    svc.setMatchLock(next);
    track("match_lock_toggled", { locked: next });
    // Le lock est bascule depuis DEUX fenetres (widget principal et sidecar de
    // draft), chacune avec son propre `matchLockStore`. Le main process est
    // l'arbitre : il rediffuse pour que les deux convergent — et c'est ce qui
    // permet a la fenetre principale de pousser `set-skin-lock` au serveur de
    // rooms meme quand la bascule vient du sidecar.
    broadcast("match-lock-changed", next);
  });

  ipcMain.handle("get-selection", () => svc.getSelection());
  ipcMain.handle("get-summoner-icon", () => svc.getProfileIcon());

  ipcMain.handle("get-summoner-name", () => svc.getSummonerName());
  svc.on("summoner-name", (name) => broadcast("summoner-name", name));

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

  // Ces trois events pilotent tout l'affichage du skin courant : ils doivent
  // atteindre la fenetre principale ET le sidecar de draft.
  svc.on("skins", (list) => broadcast("owned-skins", list));
  svc.on("selection", (sel) => broadcast("selection", sel));
  svc.on("icon", (id) => broadcast("summoner-icon", id));
}
