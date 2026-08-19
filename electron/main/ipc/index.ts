/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BrowserWindow } from "electron";
import type { LcuWatcher } from "../../services/lcuWatcher";
import type { GameflowService } from "../../services/gameflow.service";
import type { ChampionLibraryService } from "../../services/championLibrary.service";
import type { ReadyCheckService } from "../../services/readyCheck.service";
import type { WardsService } from "../../services/wards.service";
import { registerLcuIpc } from "./lcu.ipc";
import { registerGameflowIpc } from "./gameflow.ipc";
import { registerSkinsIpc } from "./skins.ipc";
import { registerMiscIpc } from "./misc.ipc";
import { registerLogIpc } from "./log.ipc";
import { registerHistoryIpc } from "./history.ipc";
import { registerExclusionsIpc } from "./exclusions.ipc";
import { registerChampionLibraryIpc } from "./championLibrary.ipc";
import { registerTelemetryIpc } from "./telemetry.ipc";
import { registerOnboardingIpc } from "./onboarding.ipc";
import { registerWindowIpc } from "./window.ipc";
import { registerUpdatesIpc } from "./updates.ipc";
import { registerWardsIpc } from "./wards.ipc";
import { registerCompanionIpc } from "./companion.ipc";

export function registerAllIpc(opts: {
  lcu: LcuWatcher;
  gameflow: GameflowService;
  skins: any; // SkinsService (avoid circular import in type-only)
  championLibrary: ChampionLibraryService;
  readyCheck: ReadyCheckService;
  wards: WardsService;
  getWin: () => BrowserWindow | null;
  /** Rappele quand la preference du sidecar change, pour l'appliquer aussitot. */
}) {
  registerLcuIpc(opts.lcu);
  // gameflow et skins diffusent a toutes les fenetres (cf. windows/broadcast) :
  // seul registerWindowIpc a encore besoin de cibler la fenetre principale.
  registerGameflowIpc(opts.gameflow);
  registerSkinsIpc(opts.skins);
  registerMiscIpc(opts.readyCheck);
  registerLogIpc();
  registerHistoryIpc(opts.skins);
  registerExclusionsIpc();
  registerChampionLibraryIpc(opts.championLibrary);
  registerTelemetryIpc();
  registerOnboardingIpc();
  registerWindowIpc(opts.getWin);
  registerUpdatesIpc();
  registerWardsIpc(opts.wards);
  registerCompanionIpc();
}
