import { BrowserWindow, ipcMain } from "electron";

export function registerWindowIpc(getWin: () => BrowserWindow | null) {
  ipcMain.handle("window:minimize", () => {
    getWin()?.minimize();
  });

  ipcMain.handle("window:toggleMaximize", () => {
    const w = getWin();
    if (!w) return;
    if (w.isMaximized()) {
      w.unmaximize();
    } else {
      w.maximize();
    }
  });

  ipcMain.handle("window:close", () => {
    getWin()?.close();
  });

  ipcMain.handle("window:isMaximized", () => {
    return getWin()?.isMaximized() ?? false;
  });
}
