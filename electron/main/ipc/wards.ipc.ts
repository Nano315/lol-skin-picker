import { ipcMain } from "electron";
import type { WardsService } from "../../services/wards.service";
import { track } from "../telemetry";

export function registerWardsIpc(svc: WardsService) {
  ipcMain.handle("get-ward-auto-roll", () => svc.getEnabled());

  ipcMain.handle("set-ward-auto-roll", async (_e, v: unknown) => {
    const next = !!v;
    await svc.setEnabled(next);
    track("setting_changed", { key: "ward_auto_roll", value: next });
  });
}
