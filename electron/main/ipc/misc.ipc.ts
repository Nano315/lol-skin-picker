import { app, ipcMain, shell } from "electron";

export function registerMiscIpc() {
  ipcMain.handle("open-external", (_e, url: string) => shell.openExternal(url));

  ipcMain.handle("get-auto-launch", () => {
    return app.getLoginItemSettings().openAtLogin;
  });

  ipcMain.handle("set-auto-launch", (_e, enable: boolean) => {
    if (!app.isPackaged) {
      return false;
    }

    app.setLoginItemSettings({ openAtLogin: enable });
    return app.getLoginItemSettings().openAtLogin;
  });
}
