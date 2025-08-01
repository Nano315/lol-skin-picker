import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from './lcu.js';

/** Émet : 'phase' (phase: string) */
export class GameflowWatcher extends EventEmitter {
  private creds: LockCreds | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  phase = "Unknown";

  setCreds(creds: LockCreds) {
    this.creds = creds;
    this.start();
  }
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.phase = "Unknown";
    this.emit("phase", this.phase);
  }

  private async poll() {
    if (!this.creds) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      });
      const txt = (await res.text()).replace(/"/g, "");
      if (txt !== this.phase) {
        this.phase = txt;
        this.emit("phase", this.phase);
      }
    } catch {
      this.stop(); // probable déco
    }
  }

  private start(interval = 2000) {
    if (this.timer) return;
    this.poll(); // premier appel immédiat
    this.timer = setInterval(() => this.poll(), interval);
  }
}
