import fs from "node:fs";
import { EventEmitter } from "node:events";

/* -------- types -------- */
export type LcuStatus = "connected" | "disconnected";
export interface LockCreds {
  port: string;
  password: string;
  protocol: string;
}

/* -------- implémentation -------- */
export class LcuWatcher extends EventEmitter {
  status: LcuStatus = "disconnected";
  creds: LockCreds | null = null;

  private timer: ReturnType<typeof setInterval> | null = null;
  private rawCache = ""; // garde le contenu brut pour détecter tout changement

  /** chemins possibles du lockfile */
  private static readonly FILES = [
    "C:\\Riot Games\\League of Legends\\lockfile",
    "C:\\Program Files\\Riot Games\\League of Legends\\lockfile",
  ];

  /* ---------- API publique ---------- */
  start(interval = 2000) {
    if (this.timer) return;
    this.tick(); // appel immédiat
    this.timer = setInterval(() => this.tick(), interval);
  }

  /* ---------- cœur du watcher ---------- */
  private tick() {
    const raw = this.readLockfile();

    /* lockfile absent ➜ déconnecté */
    if (!raw) {
      this.toDisconnected();
      return;
    }

    /* le contenu a changé ? (port, mdp, etc.) */
    if (raw !== this.rawCache) {
      this.rawCache = raw;
      const parsed = this.parse(raw);
      if (!parsed) {
        this.toDisconnected();
        return;
      }
      this.toConnected(parsed); // ré-émet même si on était déjà connecté
    }
  }

  private toConnected(c: LockCreds) {
    this.status = "connected";
    this.creds = c;
    this.emit("status", "connected", c);
  }

  private toDisconnected() {
    if (this.status !== "disconnected") {
      this.status = "disconnected";
      this.creds = null;
      this.rawCache = "";
      this.emit("status", "disconnected");
    }
  }

  /* ---------- utilitaires ---------- */
  private readLockfile(): string | null {
    for (const p of LcuWatcher.FILES) {
      try {
        return fs.readFileSync(p, "utf8");
      } catch { /* empty */ }
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
      protocol: parts[4].trim(), // « https »
    };
  }

  /* -------- typings EventEmitter -------- */
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
