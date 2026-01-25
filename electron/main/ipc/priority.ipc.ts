import { ipcMain } from "electron";
import {
  setPriority,
  getPriority,
  getAllPriorities,
  clearPriorities,
  bulkSetPriority,
  type Priority,
} from "../priority";

export function registerPriorityIpc() {
  ipcMain.handle(
    "set-priority",
    (_e, championId: number, skinId: number, priority: Priority) =>
      setPriority(championId, skinId, priority)
  );

  ipcMain.handle(
    "get-priority",
    (_e, championId: number, skinId: number) =>
      getPriority(championId, skinId)
  );

  ipcMain.handle("get-all-priorities", (_e, championId: number) =>
    getAllPriorities(championId)
  );

  ipcMain.handle("clear-priorities", (_e, championId?: number) =>
    clearPriorities(championId)
  );

  ipcMain.handle(
    "bulk-set-priority",
    (_e, championId: number, skinIds: number[], priority: Priority) =>
      bulkSetPriority(championId, skinIds, priority)
  );
}
