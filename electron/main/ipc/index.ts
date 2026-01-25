/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BrowserWindow } from "electron";
import type { LcuWatcher } from "../../services/lcuWatcher";
import type { GameflowService } from "../../services/gameflow.service";
import { registerLcuIpc } from "./lcu.ipc";
import { registerGameflowIpc } from "./gameflow.ipc";
import { registerSkinsIpc } from "./skins.ipc";
import { registerMiscIpc } from "./misc.ipc";
import { registerLogIpc } from "./log.ipc";
import { registerHistoryIpc } from "./history.ipc";

export function registerAllIpc(opts: {
  lcu: LcuWatcher;
  gameflow: GameflowService;
  skins: any; // SkinsService (avoid circular import in type-only)
  getWin: () => BrowserWindow | null;
}) {
  registerLcuIpc(opts.lcu);
  registerGameflowIpc(opts.gameflow, opts.getWin);
  registerSkinsIpc(opts.skins, opts.getWin);
  registerMiscIpc();
  registerLogIpc();
  registerHistoryIpc(opts.skins);
}
