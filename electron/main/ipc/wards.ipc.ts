import { ipcMain, BrowserWindow } from "electron";
import type { WardService } from "../../services/wards.service";
import { loadSettings, saveSettings } from "../settings";

export function registerWardsIpc(
  wards: WardService,
  getWin: () => BrowserWindow | null
) {
  ipcMain.handle("get-auto-ward", () => wards.getEnabled());

  ipcMain.handle("toggle-auto-ward", async () => {
    const next = !wards.getEnabled();
    wards.setEnabled(next);
    const s = await loadSettings();
    await saveSettings({ ...s, autoWard: next });
  });

  // events vers renderer (si un jour tu veux afficher la ward courante)
  wards.on("ward-list", (ids) => getWin()?.webContents.send("ward-list", ids));
  wards.on("ward-selection", (id) =>
    getWin()?.webContents.send("ward-selection", id)
  );
}
