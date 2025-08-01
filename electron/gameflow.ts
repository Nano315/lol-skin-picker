import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcu.js";

/** Émet : 'phase' (string) – None, Lobby, ChampSelect, InProgress, … */
export class GameflowWatcher extends EventEmitter {
  private creds: LockCreds | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  phase = "Unknown";

  /* -------- API publique -------- */
  setCreds(creds: LockCreds) {
    this.creds = creds;
    if (!this.timer) this.start();
  }
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.phase = "Unknown";
    this.emit("phase", this.phase);
  }

  /* -------- internes -------- */
  private async poll() {
    if (!this.creds) return;

    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-gameflow/v1/gameflow-phase`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const txt = (
        await fetch(url, { headers: { Authorization: `Basic ${auth}` } }).then(
          (r) => r.text()
        )
      ).replace(/"/g, "");
      if (txt !== this.phase) {
        this.phase = txt;
        this.emit("phase", txt);
      }
    } catch {
      /* On garde le timer en vie – on réessaiera au tick suivant */
      if (this.phase !== "Unknown") {
        this.phase = "Unknown";
        this.emit("phase", "Unknown");
      }
    }
  }

  private start(interval = 2000) {
    if (this.timer) return;
    void this.poll(); // premier appel immédiat
    this.timer = setInterval(() => this.poll(), interval);
  }

  /* typing helpers */
  override on(event: "phase", listener: (p: string) => void): this {
    return super.on(event, listener);
  }
  override emit(event: "phase", p: string): boolean {
    return super.emit(event, p);
  }
}
