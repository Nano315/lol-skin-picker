import { ipcMain, BrowserWindow } from "electron";
import type { GameflowService } from "../../services/gameflow.service";

export function registerGameflowIpc(
  gameflow: GameflowService,
  getWin: () => BrowserWindow | null
) {
  ipcMain.handle("get-gameflow-phase", () => gameflow.phase);

  gameflow.on("phase", (phase) => {
    const w = getWin();
    w?.webContents.send("gameflow-phase", phase);
  });
}
