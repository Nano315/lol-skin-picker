import { ipcMain } from "electron";
import type { LcuWatcher } from "../../services/lcuWatcher";

export function registerLcuIpc(lcu: LcuWatcher) {
  ipcMain.handle("get-lcu-status", () => lcu.status);

  ipcMain.handle("lcu:getIdentity", async () => {
    return lcu.getIdentity();
  });

  ipcMain.handle("lcu:getFriends", async () => {
    return lcu.getFriends();
  });
}
