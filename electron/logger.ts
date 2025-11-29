import log from "electron-log";
import path from "node:path";

log.transports.file.level = "info";
log.transports.file.maxSize = 1024 * 1024 * 5; // 5MB
log.transports.file.fileName = "main.log";
log.transports.file.resolvePathFn = (variables) =>
  path.join(variables.userData, "logs", variables.fileName ?? "main.log");

log.errorHandler.startCatching({
  showDialog: false,
  onError: ({ error, processType }) => {
    log.error("Unhandled error captured", processType ?? "unknown", error);
  },
});

process.on("unhandledRejection", (reason) => {
  log.error("Unhandled promise rejection", reason);
});

process.on("uncaughtException", (error) => {
  log.error("Uncaught exception", error);
});

export const logger = log;
export type Logger = typeof log;
