import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcuWatcher";
import { logger } from "../logger";

export class GameflowService extends EventEmitter {
  private creds: LockCreds | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  phase = "Unknown";

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
        logger.info(`[Gameflow] Phase changed to: ${txt}`);
        this.emit("phase", txt);
      }
    } catch (error) {
      if (this.phase !== "Unknown") {
        this.phase = "Unknown";
        this.emit("phase", "Unknown");
      }
      logger.warn("[Gameflow] Erreur lors du polling de phase", error);
    }
  }

  private start(interval = 2000) {
    if (this.timer) return;
    void this.poll();
    this.timer = setInterval(() => this.poll(), interval);
  }

  override on(event: "phase", listener: (p: string) => void): this {
    return super.on(event, listener);
  }
  override emit(event: "phase", p: string): boolean {
    return super.emit(event, p);
  }
}
