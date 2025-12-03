import { app, ipcMain, shell } from "electron";
import path from "node:path";
import { loadSettings, saveSettings } from "../settings";

export function registerMiscIpc() {
  ipcMain.handle("open-external", (_e, url: string) => shell.openExternal(url));

  ipcMain.handle("open-logs-folder", async () => {
    const logFolder = path.join(app.getPath("userData"), "logs");
    const errorMessage = await shell.openPath(logFolder);
    if (errorMessage) {
      console.error("Failed to open log folder:", errorMessage);
    }
  });

  ipcMain.handle("get-open-at-login", async () => {
    const settings = await loadSettings();
    // On peut aussi verifier app.getLoginItemSettings().openAtLogin
    // mais ici on se fie a notre config ou a defaut false
    return settings.openAtLogin ?? false;
  });

  ipcMain.handle("set-open-at-login", async (_e, openAtLogin: boolean) => {
    app.setLoginItemSettings({
      openAtLogin,
      path: app.getPath("exe"), // Important pour Windows
    });

    const settings = await loadSettings();
    settings.openAtLogin = openAtLogin;
    await saveSettings(settings);
  });
}
