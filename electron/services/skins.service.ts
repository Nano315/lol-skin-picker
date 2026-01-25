/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcuWatcher";
import { ensureAliasMap, getChampionAlias } from "../utils/communityDragon";
import { logger } from "../logger";
import { RandomSelector, type PriorityMap } from "../utils/RandomSelector";
import WebSocket from "ws";
import {
  loadHistory,
  getHistorySettings,
  addSkinToHistory,
  addChromaToHistory,
  type HistoryEntry,
} from "../main/history";
import { getAllPriorities } from "../main/priority";

/* ---- reponses API ---- */
interface SummonerRes {
  summonerId?: number;
  accountId?: number;
  id?: number;
  profileIconId?: number;
  gameName?: string;
}
interface SkinRes {
  id: number;
  name: string;
  ownership?: { owned: boolean };
  isOwned?: boolean;
  owned?: boolean;
}
interface ChromaRes {
  id: number;
  name?: string;
  ownership?: { owned: boolean };
  isOwned?: boolean;
  owned?: boolean;
}
interface SelectionRes {
  selectedSkinId?: number;
}

interface ChampSelectAction {
  actorCellId?: number;
  championId?: number;
  completed?: boolean;
  type?: string;
}

interface ChampSelectSession {
  actions?: ChampSelectAction[][];
  localPlayerCellId?: number;
}

/* ---- type envoye au renderer ---- */
export interface OwnedSkin {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
  championId: number;
}

export class SkinsService extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private poller: ReturnType<typeof setInterval> | null = null; // Main tick loop (slow)
  private fallbackPoller: ReturnType<typeof setInterval> | null = null; // Backup polling
  private ws: WebSocket | null = null;

  private currentChampion = 0;
  private lastAppliedChampion = 0;

  private includeDefaultSkin = true;

  private selectedSkinId = 0;
  private selectedChromaId = 0;

  private profileIconId = 0;
  private autoRollEnabled = true;
  private performanceMode = false;

  private summonerName = "";

  skins: OwnedSkin[] = [];

  private championLocked = false;

  // History settings (loaded from persistence)
  private historySize = 5; // Default, will be loaded from persistence
  private historyEnabled = true; // Default, will be loaded from persistence
  private readonly CHROMA_HISTORY_WINDOW = 2; // Chromas use smaller window

  // In-memory cache (synced with persistence)
  private skinHistoryByChampion = new Map<number, number[]>();
  private chromaHistoryBySkin = new Map<number, number[]>();

  setCreds(creds: LockCreds) {
    this.stop();
    this.creds = creds;
    this.summonerId = null;
    this.lastAppliedChampion = 0;
  }

  /**
   * Initialize history from persistence
   */
  async initHistory() {
    try {
      const settings = await getHistorySettings();
      this.historySize = settings.historySize;
      this.historyEnabled = settings.historyEnabled;

      // Load persisted history into memory cache
      const data = await loadHistory();
      this.skinHistoryByChampion.clear();
      this.chromaHistoryBySkin.clear();

      for (const [champId, entries] of Object.entries(data.skinHistory)) {
        const skinIds = (entries as HistoryEntry[]).map((e) => e.skinId);
        this.skinHistoryByChampion.set(Number(champId), skinIds);
      }

      for (const [skinId, chromaIds] of Object.entries(data.chromaHistory)) {
        this.chromaHistoryBySkin.set(Number(skinId), chromaIds as number[]);
      }

      logger.info("[Skins] History loaded", {
        historySize: this.historySize,
        historyEnabled: this.historyEnabled,
        champions: this.skinHistoryByChampion.size,
      });
    } catch (err) {
      logger.warn("[Skins] Failed to load history, using defaults", err);
    }
  }

  getHistorySize() {
    return this.historySize;
  }

  setHistorySize(size: number) {
    this.historySize = Math.max(1, Math.min(10, size));
  }

  getHistoryEnabled() {
    return this.historyEnabled;
  }

  setHistoryEnabled(enabled: boolean) {
    this.historyEnabled = enabled;
  }

  // 1. Remplacer setInterval par une boucle recursive pour eviter les chevauchements
  async start() {
    if (!this.creds || this.poller) return;
    await this.initHistory();
    this.loopTick();
  }

  private async loopTick() {
    if (!this.creds) return; // Condition d'arret
    await this.tick();
    // On attend la fin de tick() avant de programmer le suivant
    // Polling general un peu plus lent car on a le WebSocket pour le reactif
    this.poller = setTimeout(() => this.loopTick(), 2500);
  }

  stop() {
    if (this.poller) clearInterval(this.poller);
    this.stopFallbackPolling();
    this.disconnectWebSocket();

    this.poller = null;
    this.currentChampion = 0;
    this.lastAppliedChampion = 0;
    this.championLocked = false;
    this.selectedSkinId = 0;
    this.selectedChromaId = 0;
    if (this.skins.length) {
      this.skins = [];
      this.emit("skins", []);
    }
  }

  /* ---------- WebSocket LCU ---------- */
  private connectWebSocket() {
    if (this.ws || !this.creds) return;

    const { port, password } = this.creds;
    // LCU WebSocket URL: wss://127.0.0.1:PORT
    const wsUrl = `wss://127.0.0.1:${port}`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      this.ws = new WebSocket(wsUrl, {
        headers: { Authorization: `Basic ${auth}` },
        rejectUnauthorized: false,
      });

      this.ws.on("open", () => {
        logger.info("[Skins] WebSocket LCU connecte.");
        // Subscribe to Champ Select Session events
        // API LCU WAMP-like: [5, "OnJsonApiEvent_lol-champ-select_v1_session"]
        this.ws?.send(JSON.stringify([5, "OnJsonApiEvent_lol-champ-select_v1_session"]));
      });

      this.ws.on("message", (data: any) => {
        const raw = data.toString().trim();
        if (!raw) return; // Keep-alive or empty message
        try {
          const msg = JSON.parse(raw);
          // [2, "OnJsonApiEvent_lol-champ-select_v1_session", { eventType: "Update", uri: "...", data: {...} }]
          if (Array.isArray(msg) && msg[1] === "OnJsonApiEvent_lol-champ-select_v1_session") {
            const eventData = msg[2];
            if (eventData && eventData.data) {
              // Trigger update on change
              void this.handleChampSelectUpdate(eventData.data);
            }
          }
        } catch (err: any) {
          logger.debug("[Skins] Message WebSocket ignore (parse error)", { raw, err });
        }
      });

      this.ws.on("error", (err: any) => {
        logger.warn("[Skins] Erreur WebSocket LCU", err);
        this.disconnectWebSocket();
        this.enableFallbackPolling(); // Switch to fallback
      });

      this.ws.on("close", () => {
        logger.info("[Skins] WebSocket LCU ferme.");
        this.ws = null;
        this.enableFallbackPolling();
      });

    } catch (err: any) {
      logger.error("[Skins] Impossible de connecter le WebSocket", err);
      this.enableFallbackPolling();
    }
  }

  private disconnectWebSocket() {
    if (this.ws) {
      this.ws.terminate(); // Force close
      this.ws = null;
    }
  }

  /* ---------- Fallback Polling ---------- */
  private enableFallbackPolling() {
    if (this.fallbackPoller) return;
    logger.info("[Skins] Activation du polling de secours (Fallback).");
    const interval = this.performanceMode ? 5000 : 2000; // Plus lent que l'ancien 500ms
    this.fallbackPoller = setInterval(() => this.updateManualSelection(), interval);
  }

  private stopFallbackPolling() {
    if (this.fallbackPoller) clearInterval(this.fallbackPoller);
    this.fallbackPoller = null;
  }

  /* -------------------------------------- */

  /** Check if we should be in fast mode (WS or Poll) */
  private setupRealtimeUpdates() {
    // If we have a WebSocket, ensure it's connected
    if (!this.ws) {
      this.connectWebSocket();
    }
    // If WebSocket failed previously, fallbackPoller handles it.
  }

  private teardownRealtimeUpdates() {
    this.disconnectWebSocket();
    this.stopFallbackPolling();
  }

  getIncludeDefault() {
    return this.includeDefaultSkin;
  }
  setIncludeDefault(v: boolean) {
    this.includeDefaultSkin = !!v;
  }
  toggleIncludeDefault() {
    this.setIncludeDefault(!this.includeDefaultSkin);
  }

  getAutoRoll() {
    return this.autoRollEnabled;
  }
  setAutoRoll(v: boolean) {
    this.autoRollEnabled = !!v;
  }
  toggleAutoRoll() {
    this.setAutoRoll(!this.autoRollEnabled);
  }

  getPerformanceMode() {
    return this.performanceMode;
  }
  setPerformanceMode(v: boolean) {
    this.performanceMode = !!v;
    // Restart fallback poller if active
    if (this.fallbackPoller) {
      this.stopFallbackPolling();
      this.enableFallbackPolling();
    }
  }
  togglePerformanceMode() {
    this.setPerformanceMode(!this.performanceMode);
  }

  getSelection() {
    return {
      championId: this.currentChampion,
      championAlias: getChampionAlias(this.currentChampion),
      skinId: this.selectedSkinId,
      chromaId: this.selectedChromaId,
      locked: this.championLocked,
    };
  }

  getProfileIcon() {
    return this.profileIconId;
  }

  getSummonerName() {
    return this.summonerName;
  }

  /** Ajoute une valeur dans l'historique (cle = champion ou skin) avec une taille max raisonnable */
  private pushHistory(
    map: Map<number, number[]>,
    key: number,
    value: number,
    maxWindow: number
  ) {
    if (!key || !value) return;
    let arr = map.get(key);
    if (!arr) {
      arr = [];
      map.set(key, arr);
    }
    arr.push(value);
    // on garde un historique raisonnable pour ponderer (4x la fenetre glissante)
    const HARD_LIMIT = maxWindow * 4;
    if (arr.length > HARD_LIMIT) {
      arr.splice(0, arr.length - HARD_LIMIT);
    }
  }

  /** Push skin to history and persist to disk */
  private async pushSkinHistory(championId: number, skinId: number) {
    this.pushHistory(
      this.skinHistoryByChampion,
      championId,
      skinId,
      this.historySize
    );
    // Persist to disk
    const entry: HistoryEntry = {
      skinId,
      chromaId: 0,
      timestamp: Date.now(),
    };
    await addSkinToHistory(championId, entry, this.historySize);
  }

  /** Push chroma to history and persist to disk */
  private async pushChromaHistory(skinId: number, chromaId: number) {
    this.pushHistory(
      this.chromaHistoryBySkin,
      skinId,
      chromaId,
      this.CHROMA_HISTORY_WINDOW
    );
    // Persist to disk
    await addChromaToHistory(skinId, chromaId, this.CHROMA_HISTORY_WINDOW);
  }

  async rerollSkin() {
    if (!this.skins.length) return;

    const pool = this.includeDefaultSkin
      ? this.skins
      : this.skins.filter((s) => s.id % 1000 !== 0) || this.skins;

    const skinIds = pool.map((s) => s.id);
    const history = this.historyEnabled
      ? (this.skinHistoryByChampion.get(this.currentChampion) ?? [])
      : [];

    // Load priorities for this champion
    const priorities: PriorityMap = await getAllPriorities(this.currentChampion);

    const pickedSkinId = RandomSelector.pickWithPriorityAndHistory(
      skinIds,
      priorities,
      history,
      this.historyEnabled ? this.historySize : 0,
      this.selectedSkinId || null
    );
    if (!pickedSkinId) return;

    const pick = pool.find((s) => s.id === pickedSkinId);
    if (!pick) return;

    // Variantes possibles : base ou chromas
    const variantChoices = pick.chromas.length
      ? [pick.id, ...pick.chromas.map((c) => c.id)]
      : [pick.id];

    const variantId =
      variantChoices.length === 1
        ? variantChoices[0]
        : variantChoices[RandomSelector.randomInt(variantChoices.length)];

    const applied = await this.applySkin(variantId);
    if (!applied) return;

    this.selectedSkinId = pick.id;
    this.selectedChromaId = variantId !== pick.id ? variantId : 0;

    // Historique skin + chroma (only if history enabled)
    if (this.historyEnabled) {
      await this.pushSkinHistory(this.currentChampion, pick.id);
      await this.pushChromaHistory(pick.id, variantId);
    }

    this.emit("selection", this.getSelection());
    this.lastAppliedChampion = this.currentChampion;
  }

  async rerollChroma() {
    const skin = this.skins.find((s) => s.id === this.selectedSkinId);
    if (!skin || skin.chromas.length === 0) return;

    // Toutes les variantes possibles : base + chromas
    const allChoices: number[] = [skin.id, ...skin.chromas.map((c) => c.id)];

    // ID actuellement actif (base ou chroma)
    const currentId = this.selectedChromaId || skin.id;

    const history = this.historyEnabled
      ? (this.chromaHistoryBySkin.get(skin.id) ?? [])
      : [];

    const pickedId = RandomSelector.pickWithHistory(
      allChoices,
      history,
      this.CHROMA_HISTORY_WINDOW,
      currentId
    );
    if (!pickedId) return;

    const applied = await this.applySkin(pickedId);
    if (!applied) return;

    this.selectedChromaId = pickedId === skin.id ? 0 : pickedId;

    if (this.historyEnabled) {
      await this.pushChromaHistory(skin.id, pickedId);
    }

    this.emit("selection", this.getSelection());
  }

  /* ---------- boucle principale ---------- */
  private async tick() {
    if (!this.creds) return;
    if (this.summonerId === null) await this.fetchSummonerId();

    const champ = await this.fetchCurrentChampion();

    // switch Realtime selon champ present (Champ Select) ou non
    if (champ) {
        this.setupRealtimeUpdates();
    } else {
        this.teardownRealtimeUpdates();
    }

    if (champ && champ !== this.currentChampion) {
      this.currentChampion = champ;

      await ensureAliasMap();
      const alias = getChampionAlias(champ);
      logger.info(`[Skins] Champion detecte: ${alias} (${champ})`);

      // nouvelle game / nouveau champion => on repart a zero côte selection
      this.championLocked = false;
      this.selectedSkinId = 0;
      this.selectedChromaId = 0;
      this.emit("selection", this.getSelection());

      await this.refreshSkinsAndMaybeApply();
    }

    // On fait quand même un check manuel de temps en temps via loopTick (2.5s)
    // Mais le gros du travail est fait par le WebSocket ou le fallback
    if (this.fallbackPoller) {
        // Si on est en fallback, on laisse le fallback tourner
    } else {
        // Si on est en WebSocket, on verifie juste la coherence de temps en temps
        await this.updateManualSelection();
    }
  }

  private async fetchSummonerId() {
    if (!this.creds) return;
    const previousSummonerId = this.summonerId;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-summoner/v1/current-summoner`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const r = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((r) => r.json())) as SummonerRes;

      this.summonerId = r.summonerId ?? r.accountId ?? r.id ?? null;
      this.profileIconId = r.profileIconId ?? 0;

      this.summonerName = (r.gameName ?? "").trim();

      this.emit("icon", this.profileIconId);
      this.emit("summoner-name", this.summonerName);
      if (this.summonerId && this.summonerId !== previousSummonerId) {
        logger.info("[Skins] Invocateur identifie", {
          summonerId: this.summonerId,
          summonerName: this.summonerName,
        });
      }
    } catch (error: any) {
      if (error.code === "ECONNREFUSED") {
        logger.debug("[Skins] API Summoner non prete (ECONNREFUSED)");
        return;
      }
      logger.error("[Skins] Erreur lors de la recuperation du summoner", error);
      this.summonerId = null;
      this.summonerName = "";
      this.emit("summoner-name", "");
    }
  }

  private async fetchCurrentChampion(): Promise<number> {
    if (!this.creds) return 0;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-champ-select/v1/current-champion`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      return (
        Number(
          await fetch(url, {
            headers: { Authorization: `Basic ${auth}` },
          }).then((r) => r.text())
        ) || 0
      );
    } catch {
      return 0;
    }
  }

  private emitSkinsIfChanged(next: OwnedSkin[]) {
    if (
      next.length === this.skins.length &&
      next.every(
        (s, i) =>
          s.id === this.skins[i]?.id &&
          s.chromas.length === this.skins[i]?.chromas.length
      )
    ) {
      return;
    }
    this.skins = next;
    this.emit("skins", next);
  }

  private async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    try {
      await ensureAliasMap();

      const { protocol, port, password } = this.creds;
      const base = `${protocol}://127.0.0.1:${port}`;
      const headers = {
        Authorization: `Basic ${Buffer.from(`riot:${password}`).toString(
          "base64"
        )}`,
      };

      const allSkins = (await fetch(
        `${base}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
        { headers }
      ).then((r) => r.json())) as SkinRes[];

      const owned: OwnedSkin[] = [];
      for (const s of allSkins.filter(
        (s) => s.ownership?.owned || s.isOwned || s.owned
      )) {
        let chromaList: { id: number; name: string }[] = [];
        try {
          const chromas = (await fetch(
            `${base}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins/${s.id}/chromas`,
            { headers }
          ).then((r) => (r.status === 404 ? [] : r.json()))) as ChromaRes[];

          chromaList = chromas
            .filter((c) => c.ownership?.owned || c.isOwned || c.owned)
            .map((c) => ({ id: c.id, name: c.name || `Chroma ${c.id}` }));
        } catch (error) {
          logger.warn(
            `[Skins] Impossible de recuperer les chromas pour le skin ${s.id}`,
            error
          );
        }

        owned.push({
          id: s.id,
          name: s.name,
          chromas: chromaList,
          championId: this.currentChampion,
        });
      }

      this.emitSkinsIfChanged(owned);

      if (
        this.autoRollEnabled &&
        this.currentChampion !== this.lastAppliedChampion &&
        owned.length
      ) {
        const pool = this.includeDefaultSkin
          ? owned
          : owned.filter((s) => s.id % 1000 !== 0) || owned;

        const skinIds = pool.map((s) => s.id);
        const history = this.historyEnabled
          ? (this.skinHistoryByChampion.get(this.currentChampion) ?? [])
          : [];

        // Load priorities for this champion
        const priorities: PriorityMap = await getAllPriorities(this.currentChampion);

        const pickedSkinId = RandomSelector.pickWithPriorityAndHistory(
          skinIds,
          priorities,
          history,
          this.historyEnabled ? this.historySize : 0,
          this.selectedSkinId || null
        );
        if (!pickedSkinId) return;

        const picked = pool.find((s) => s.id === pickedSkinId);
        if (!picked) return;

        const variantChoices = picked.chromas.length
          ? [picked.id, ...picked.chromas.map((c) => c.id)]
          : [picked.id];

        const finalId =
          variantChoices.length === 1
            ? variantChoices[0]
            : variantChoices[RandomSelector.randomInt(variantChoices.length)];

        const applied = await this.applySkin(finalId);
        if (!applied) return;

        this.selectedSkinId = picked.id;
        this.selectedChromaId = finalId !== picked.id ? finalId : 0;

        if (this.historyEnabled) {
          await this.pushSkinHistory(this.currentChampion, picked.id);
          await this.pushChromaHistory(picked.id, finalId);
        }

        this.emit("selection", this.getSelection());
        this.lastAppliedChampion = this.currentChampion;
      }
    } catch (error: any) {
      if (error.code === "ECONNREFUSED") {
        return;
      }
      logger.error(
        "[Skins] Erreur critique lors de la recuperation des skins",
        error
      );
    }
  }

  async applySkin(skinId: number): Promise<boolean> {
    if (!this.creds) return false;
    logger.info(`[Skins] Tentative d'application du skin ${skinId}`);
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-champ-select/v1/session/my-selection`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    // OPTIMISTIC UPDATE
    this.selectedSkinId = skinId;
    this.emit("selection", this.getSelection());
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ selectedSkinId: skinId }),
      });
      if (!res.ok) {
        logger.error(
          `[Skins] echec application du skin ${skinId} (status ${res.status})`
        );
        return false;
      }
      logger.info(`[Skins] Skin applique avec succes: ${skinId}`);
      void this.updateManualSelection();
      return true;
    } catch (error) {
      logger.error("[Skins] Erreur lors de l'application du skin", error);
      return false;
    }
  }

  // Called via WebSocket event or Polling
  private async handleChampSelectUpdate(sessionData: ChampSelectSession) {
      // 1. Check Locked state
      await this.processSessionData(sessionData);
      
      // 2. Fetch my-selection for Skin info (not always present in main session event)
      await this.updateManualSelection(); 
  }

  private processSessionData(sessionData: ChampSelectSession | null) {
      if (!sessionData || !Array.isArray(sessionData.actions)) return;

      const cellId = sessionData.localPlayerCellId;
      let locked = false;

      if (typeof cellId === "number") {
        for (const group of sessionData.actions) {
          for (const action of group) {
            if (
              action.type === "pick" &&
              action.actorCellId === cellId &&
              typeof action.completed === "boolean"
            ) {
              locked = action.completed;
              break;
            }
          }
          if (locked) break;
        }
      }

      if (locked !== this.championLocked) {
        this.championLocked = locked;
        this.emit("selection", this.getSelection());
      }
  }

  private async updateManualSelection() {
    if (!this.creds || !this.currentChampion) return;

    const { protocol, port, password } = this.creds;
    const base = `${protocol}://127.0.0.1:${port}`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const [selectionData, sessionData] = await Promise.all([
        fetch(`${base}/lol-champ-select/v1/session/my-selection`, {
          headers: { Authorization: `Basic ${auth}` },
        }).then((r) => r.json() as Promise<SelectionRes>),
        fetch(`${base}/lol-champ-select/v1/session`, {
          headers: { Authorization: `Basic ${auth}` },
        }).then((r) =>
          r.ok
            ? (r.json() as Promise<ChampSelectSession>)
            : Promise.resolve(null)
        ),
      ]);

      // --- 1) Lock state (Backup check) ---
      this.processSessionData(sessionData);

      // --- 2) Recalcul complet skin/chroma a partir de selectedSkinId ---
      const selId = selectionData.selectedSkinId ?? 0;

      let newSkinId = 0;
      let newChromaId = 0;

      if (selId) {
        let skinId = selId;
        let chromaId = 0;

        const directSkin = this.skins.find((s) => s.id === selId);
        if (directSkin) {
          // selId = ID d'un skin → pas de chroma
          skinId = directSkin.id;
        } else {
          // sinon on cherche dans les chromas
          for (const s of this.skins) {
            const c = s.chromas.find((ch) => ch.id === selId);
            if (c) {
              skinId = s.id;
              chromaId = c.id;
              break;
            }
          }
        }

        newSkinId = skinId;
        newChromaId = chromaId;
      }

      // eslint-disable-next-line prefer-const
      let selectionChanged =
        newSkinId !== this.selectedSkinId ||
        newChromaId !== this.selectedChromaId;

      if (selectionChanged) {
        this.selectedSkinId = newSkinId;
        this.selectedChromaId = newChromaId;
        this.emit("selection", this.getSelection());
      }
    } catch {
      /* ignore */
    }
  }

  // typings EventEmitter
  on(event: "skins", fn: (l: OwnedSkin[]) => void): this;
  on(
    event: "selection",
    fn: (s: {
      championId: number;
      championAlias: string;
      skinId: number;
      chromaId: number;
      locked: boolean;
    }) => void
  ): this;
  on(event: "icon", fn: (id: number) => void): this;
  on(event: "summoner-name", fn: (name: string) => void): this;
  override on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  emit(event: "skins", l: OwnedSkin[]): boolean;
  emit(
    event: "selection",
    s: {
      championId: number;
      championAlias: string;
      skinId: number;
      chromaId: number;
      locked: boolean;
    }
  ): boolean;
  emit(event: "icon", id: number): boolean;
  emit(event: "summoner-name", name: string): boolean;
  override emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }
}
