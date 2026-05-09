import type { LockCreds } from "./lcuWatcher";
import { lcuFetch } from "../utils/lcuFetch";
import { logger } from "../logger";

/**
 * Réponse de l'endpoint /lol-matchmaking/v1/ready-check.
 * - state: "Invalid" (pas de ready-check actif), "InProgress", "PartyAccepted",
 *   "Accepted", "Declined" (selon les variantes LCU).
 * - playerResponse: "None" tant que le joueur local n'a pas répondu.
 */
interface ReadyCheckState {
  state?: string;
  playerResponse?: string;
}

const POLL_INTERVAL_MS = 1500;

/**
 * Auto-accepte le ready-check de matchmaking quand l'option est activée.
 *
 * Stratégie : on poll directement l'API ready-check du LCU (pas la phase
 * gameflow), parce que la phase est pollée toutes les 2s côté gameflow, ce
 * qui peut rater une oscillation Matchmaking → ReadyCheck → Matchmaking →
 * ReadyCheck (cas où un joueur du lobby refuse, retour en queue, nouveau
 * match trouvé). En tapant l'API ready-check, on a toujours le state
 * authoritative et on accepte la 2e (et Nième) session sans souci.
 *
 * Le latch `acceptedThisSession` empêche de spammer accept() pendant la même
 * session ; il se reset naturellement dès que l'API renvoie state="Invalid"
 * (= plus de ready-check actif), ce qui garantit qu'une session suivante
 * sera bien acceptée.
 */
export class ReadyCheckService {
  private creds: LockCreds | null = null;
  private autoAcceptEnabled = false;
  private poller: ReturnType<typeof setInterval> | null = null;
  private acceptedThisSession = false;
  private inFlight = false;

  setCreds(creds: LockCreds | null) {
    this.creds = creds;
    if (!creds) {
      this.acceptedThisSession = false;
    }
    this.refreshPollerState();
  }

  getAutoAccept() {
    return this.autoAcceptEnabled;
  }

  setAutoAccept(v: boolean) {
    this.autoAcceptEnabled = !!v;
    if (!this.autoAcceptEnabled) {
      this.acceptedThisSession = false;
    }
    this.refreshPollerState();
  }

  /** Cleanup pour les tests / reset complet. */
  stop() {
    if (this.poller) clearInterval(this.poller);
    this.poller = null;
    this.acceptedThisSession = false;
    this.inFlight = false;
  }

  private refreshPollerState() {
    const shouldPoll = this.autoAcceptEnabled && !!this.creds;
    if (shouldPoll && !this.poller) {
      void this.tick(); // tentative immédiate
      this.poller = setInterval(() => void this.tick(), POLL_INTERVAL_MS);
    } else if (!shouldPoll && this.poller) {
      clearInterval(this.poller);
      this.poller = null;
    }
  }

  private async tick() {
    if (!this.creds || !this.autoAcceptEnabled || this.inFlight) return;
    this.inFlight = true;
    try {
      const state = await this.fetchState();

      // Pas de ready-check actif (404 ou state "Invalid") → on libère le latch
      // pour que la prochaine session soit bien détectée et acceptée.
      if (!state || !state.state || state.state === "Invalid") {
        this.acceptedThisSession = false;
        return;
      }

      // Session active, joueur n'a pas encore répondu → on accepte.
      if (
        state.state === "InProgress" &&
        state.playerResponse === "None" &&
        !this.acceptedThisSession
      ) {
        this.acceptedThisSession = true;
        await this.accept();
      }
      // Sinon : session active mais déjà répondu (par nous ou par autre canal)
      // → on garde le latch jusqu'à ce que state revienne "Invalid".
    } finally {
      this.inFlight = false;
    }
  }

  private async fetchState(): Promise<ReadyCheckState | null> {
    if (!this.creds) return null;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-matchmaking/v1/ready-check`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const res = await lcuFetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (res.status === 404) return null; // pas de ready-check actif
      if (!res.ok) return null;
      return (await res.json()) as ReadyCheckState;
    } catch {
      return null;
    }
  }

  private async accept() {
    if (!this.creds) return;
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
        this.acceptedThisSession = false; // on retentera au prochain tick
        return;
      }
      logger.info("[ReadyCheck] Match accepte automatiquement");
    } catch (err) {
      logger.warn("[ReadyCheck] Erreur lors de l'auto-accept", err);
      this.acceptedThisSession = false;
    }
  }
}
