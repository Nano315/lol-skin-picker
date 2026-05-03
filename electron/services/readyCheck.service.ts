import type { LockCreds } from "./lcuWatcher";
import { lcuFetch } from "../utils/lcuFetch";
import { logger } from "../logger";

/**
 * Auto-accepte le ready-check de matchmaking quand l'option est activee.
 * Stratégie : on déclenche un POST unique par session de ReadyCheck (latch
 * reset à la sortie de la phase) pour éviter de spammer le LCU si le poll
 * Gameflow re-émet la même phase.
 */
export class ReadyCheckService {
  private creds: LockCreds | null = null;
  private autoAcceptEnabled = false;
  private currentPhase = "Unknown";
  private acceptedThisCheck = false;

  setCreds(creds: LockCreds | null) {
    this.creds = creds;
  }

  getAutoAccept() {
    return this.autoAcceptEnabled;
  }

  setAutoAccept(v: boolean) {
    this.autoAcceptEnabled = !!v;
    // Si l'utilisateur active la pref pendant un ReadyCheck déjà en cours,
    // on accepte immédiatement.
    if (
      this.autoAcceptEnabled &&
      this.currentPhase === "ReadyCheck" &&
      !this.acceptedThisCheck
    ) {
      void this.accept();
    }
  }

  onPhase(phase: string) {
    const prev = this.currentPhase;
    this.currentPhase = phase;

    if (phase !== "ReadyCheck" && prev === "ReadyCheck") {
      this.acceptedThisCheck = false;
    }

    if (
      phase === "ReadyCheck" &&
      this.autoAcceptEnabled &&
      !this.acceptedThisCheck
    ) {
      void this.accept();
    }
  }

  private async accept() {
    if (!this.creds) return;
    this.acceptedThisCheck = true;

    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-matchmaking/v1/ready-check/accept`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const res = await lcuFetch(url, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!res.ok) {
        logger.warn(
          `[ReadyCheck] Auto-accept refuse par le LCU (status ${res.status})`
        );
        this.acceptedThisCheck = false;
        return;
      }
      logger.info("[ReadyCheck] Match accepte automatiquement");
    } catch (err) {
      logger.warn("[ReadyCheck] Erreur lors de l'auto-accept", err);
      this.acceptedThisCheck = false;
    }
  }
}
