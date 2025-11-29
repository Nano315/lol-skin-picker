import fs from "node:fs";
import { EventEmitter } from "node:events";
import { logger } from "../logger";

/* -------- types -------- */
export type LcuStatus = "connected" | "disconnected";
export interface LockCreds {
  port: string;
  password: string;
  protocol: string;
}

/* -------- implementation -------- */
export class LcuWatcher extends EventEmitter {
  status: LcuStatus = "disconnected";
  creds: LockCreds | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;
  private rawCache = "";
  private lockfilePath: string | null = null;

  /** chemins possibles du lockfile */
  private static readonly FILES = [
    "C:\\Riot Games\\League of Legends\\lockfile",
    "C:\\Program Files\\Riot Games\\League of Legends\\lockfile",
  ];

  public isConnected(): boolean {
    return this.creds !== null;
  }

  start(interval = 2000) {
    if (this.timer) return;
    this.tick();
    this.timer = setInterval(() => this.tick(), interval);
  }

  private tick() {
    const result = this.readLockfile();

    if (!result) {
      this.toDisconnected();
      return;
    }

    const { raw, path } = result;

    if (path !== this.lockfilePath) {
      this.lockfilePath = path;
      logger.info("[LCU] Lockfile detecte", path);
    }

    if (raw !== this.rawCache) {
      this.rawCache = raw;
      const parsed = this.parse(raw);
      if (!parsed) {
        logger.warn("[LCU] Impossible de parser les credentials du lockfile");
        this.toDisconnected();
        return;
      }
      this.toConnected(parsed);
    }
  }

  private toConnected(c: LockCreds) {
    this.status = "connected";
    this.creds = c;
    logger.info("[LCU] Connecte au client", {
      port: c.port,
      protocol: c.protocol,
      lockfilePath: this.lockfilePath,
    });
    this.emit("status", "connected", c);
  }

  private toDisconnected() {
    if (this.status !== "disconnected") {
      this.status = "disconnected";
      this.creds = null;
      this.rawCache = "";
      if (this.lockfilePath) {
        logger.info("[LCU] Client deconnecte", this.lockfilePath);
      }
      this.lockfilePath = null;
      this.emit("status", "disconnected");
    }
  }

  private readLockfile(): { raw: string; path: string } | null {
    for (const p of LcuWatcher.FILES) {
      try {
        const raw = fs.readFileSync(p, "utf8");
        return { raw, path: p };
      } catch {
        /* empty */
      }
    }
    return null;
  }

  /** ProcessName:PID:Port:Password:Protocol(:Address) */
  private parse(line: string): LockCreds | null {
    const parts = line.trim().split(":");
    if (parts.length < 5) return null;
    return {
      port: parts[2].trim(),
      password: parts[3].trim(),
      protocol: parts[4].trim(),
    };
  }

  override on(
    event: "status",
    fn: (s: LcuStatus, c?: LockCreds) => void
  ): this {
    return super.on(event, fn);
  }
  override emit(event: "status", s: LcuStatus, c?: LockCreds): boolean {
    return super.emit(event, s, c);
  }
}
