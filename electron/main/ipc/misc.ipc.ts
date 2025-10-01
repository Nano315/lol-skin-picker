import { ipcMain, shell } from "electron";

export function registerMiscIpc() {
  ipcMain.handle("open-external", (_e, url: string) => shell.openExternal(url));
}
