import { ipcMain } from "electron";
import type { LcuWatcher } from "../../services/lcuWatcher";

export function registerLcuIpc(lcu: LcuWatcher) {
  ipcMain.handle("get-lcu-status", () => lcu.status);
}
