import { app, ipcMain, shell } from "electron";
import path from "node:path";

export function registerMiscIpc() {
  ipcMain.handle("open-external", (_e, url: string) => shell.openExternal(url));

  ipcMain.handle("open-logs-folder", async () => {
    const logFolder = path.join(app.getPath("userData"), "logs");
    const errorMessage = await shell.openPath(logFolder);
    if (errorMessage) {
      console.error("Failed to open log folder:", errorMessage);
    }
  });
}
