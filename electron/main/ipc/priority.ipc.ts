import { ipcMain } from "electron";
import {
  setPriority,
  getPriority,
  getAllPriorities,
  clearPriorities,
  bulkSetPriority,
  type Priority,
} from "../priority";
import { track } from "../telemetry";

// Normalise Priority | null en une chaine safe pour les analytics (jamais
// d'ID de skin/champion : on veut seulement connaitre la distribution des
// actions, pas qui a favorite quoi).
function priorityLabel(p: Priority): "favorite" | "deprioritized" | "cleared" {
  if (p === "favorite") return "favorite";
  if (p === "deprioritized") return "deprioritized";
  return "cleared";
}

export function registerPriorityIpc() {
  ipcMain.handle(
    "set-priority",
    (_e, championId: number, skinId: number, priority: Priority) => {
      track("priority_changed", { action: priorityLabel(priority), bulk: false, count: 1 });
      return setPriority(championId, skinId, priority);
    }
  );

  ipcMain.handle(
    "get-priority",
    (_e, championId: number, skinId: number) =>
      getPriority(championId, skinId)
  );

  ipcMain.handle("get-all-priorities", (_e, championId: number) =>
    getAllPriorities(championId)
  );

  ipcMain.handle("clear-priorities", (_e, championId?: number) => {
    track("priorities_cleared", { scope: championId !== undefined ? "champion" : "all" });
    return clearPriorities(championId);
  });

  ipcMain.handle(
    "bulk-set-priority",
    (_e, championId: number, skinIds: number[], priority: Priority) => {
      track("priority_changed", {
        action: priorityLabel(priority),
        bulk: true,
        count: skinIds.length,
      });
      return bulkSetPriority(championId, skinIds, priority);
    }
  );
}
