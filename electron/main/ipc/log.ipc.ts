import { ipcMain } from "electron";
import { logger } from "../../logger";

type LogLevel = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

const VALID_LEVELS: Set<LogLevel> = new Set([
  "error",
  "warn",
  "info",
  "verbose",
  "debug",
  "silly",
]);

export function registerLogIpc() {
  ipcMain.handle(
    "log-message",
    (_event, level: LogLevel, ...args: unknown[]) => {
      if (!VALID_LEVELS.has(level)) {
        logger.warn("Renderer attempted to log with invalid level", level);
        return;
      }

      const fn = logger[level];
      if (typeof fn === "function") {
        fn(...args);
      }
    }
  );
}
