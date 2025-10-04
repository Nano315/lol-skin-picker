/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BrowserWindow } from "electron";
import type { LcuWatcher } from "../../services/lcuWatcher";
import type { GameflowService } from "../../services/gameflow.service";
import type { SkinsService } from "../../services/skins.service";
import type { WardService } from "../../services/wards.service";
import { registerLcuIpc } from "./lcu.ipc";
import { registerGameflowIpc } from "./gameflow.ipc";
import { registerSkinsIpc } from "./skins.ipc";
import { registerMiscIpc } from "./misc.ipc";
import { registerWardsIpc } from "./wards.ipc";

export function registerAllIpc(opts: {
  lcu: LcuWatcher;
  gameflow: GameflowService;
  skins: SkinsService;
  wards: WardService;
  getWin: () => BrowserWindow | null;
}) {
  registerLcuIpc(opts.lcu);
  registerGameflowIpc(opts.gameflow, opts.getWin);
  registerSkinsIpc(opts.skins, opts.getWin);
  registerWardsIpc(opts.wards, opts.getWin);
  registerMiscIpc();
}
