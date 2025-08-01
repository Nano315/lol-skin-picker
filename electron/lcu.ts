import fs from 'node:fs';
import { EventEmitter } from 'node:events';

/** État LCU */
export type LcuStatus = 'connected' | 'disconnected';

/** Infos extraites du lockfile */
export interface LockCreds {
  port: string;
  password: string;
  protocol: string; // https
}

/** Surveille le lockfile et émet 'status' */
export class LcuWatcher extends EventEmitter {
  status: LcuStatus = 'disconnected';
  creds: LockCreds | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;

  /* chemins possibles du lockfile */
  private static readonly LOCKFILE_PATHS = [
    'C:\\Riot Games\\League of Legends\\lockfile',
    'C:\\Program Files\\Riot Games\\League of Legends\\lockfile'
  ];

  /* --------- API publique --------- */
  start(interval = 2000) {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), interval);
  }

  /* --------- Internes --------- */
  private tick() {
    const raw = this.readLockfile();
    if (!raw) { this.setDisconnected(); return; }

    if (this.status === 'disconnected') {
      const creds = this.parseLine(raw);
      if (!creds) return;
      this.status = 'connected';
      this.creds  = creds;
      this.emit('status', this.status, creds);
    }
  }

  private setDisconnected() {
    if (this.status !== 'disconnected') {
      this.status = 'disconnected';
      this.creds  = null;
      this.emit('status', this.status);
    }
  }

  private readLockfile(): string | null {
    for (const p of LcuWatcher.LOCKFILE_PATHS) {
      try { return fs.readFileSync(p, 'utf8'); } catch { /* empty */ }
    }
    return null;
  }

  private parseLine(line: string): LockCreds | null {
    const parts = line.trim().split(':');
    if (parts.length < 5) return null;
    return { port: parts[2], password: parts[3], protocol: parts[4] };
  }

  /* --------- Typage des événements --------- */
  override on(event: 'status', listener: (s: LcuStatus, c?: LockCreds) => void): this {
    return super.on(event, listener);
  }
  override emit(event: 'status', s: LcuStatus, c?: LockCreds): boolean {
    return super.emit(event, s, c);
  }
}
