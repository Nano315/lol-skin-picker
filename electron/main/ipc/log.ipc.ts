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

const MAX_ARG_LENGTH = 2000;
const MAX_ARGS = 10;

// Remove CR/LF/other control chars that could be used to forge log lines.
function sanitizeArg(arg: unknown): unknown {
  if (typeof arg !== "string") return arg;
  const truncated =
    arg.length > MAX_ARG_LENGTH
      ? arg.slice(0, MAX_ARG_LENGTH) + "...[truncated]"
      : arg;
  // Replace ASCII control chars (0x00-0x1F except tab) with spaces so a renderer
  // cannot inject fake log lines via embedded "\n".
  return truncated.replace(/[\x00-\x08\x0A-\x1F]/g, " ");
}

export function registerLogIpc() {
  ipcMain.handle(
    "log-message",
    (_event, level: LogLevel, ...args: unknown[]) => {
      if (!VALID_LEVELS.has(level)) {
        logger.warn("Renderer attempted to log with invalid level", level);
        return;
      }

      const fn = logger[level];
      if (typeof fn !== "function") return;

      const safeArgs = args.slice(0, MAX_ARGS).map(sanitizeArg);
      fn("[renderer]", ...safeArgs);
    }
  );
}
