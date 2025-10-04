/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcuWatcher";
import { ensureAliasMap, getChampionAlias } from "../utils/communityDragon";
import { randomInt } from "node:crypto";

/* ---- réponses API ---- */
interface SummonerRes {
  summonerId?: number;
  accountId?: number;
  id?: number;
  profileIconId?: number;
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

/* ---- type envoyé au renderer ---- */
export interface OwnedSkin {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
}

// paramètres "mémoire"
const SKIN_HISTORY = 3; // N derniers skins à éviter (par champion)
const CHROMA_HISTORY = 2; // N derniers chromas à éviter (par champion+skin)

// helpers RNG
function pickIndex(max: number) {
  return randomInt(0, max); // 0..max-1
}
function weightedPick<T>(items: T[], weightFn: (x: T) => number): T {
  const weights = items.map(weightFn);
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) {
    // fallback uniform
    return items[pickIndex(items.length)];
  }
  const r = randomInt(1_000_000) / 1_000_000;
  let acc = 0;
  for (let i = 0; i < items.length; i++) {
    acc += weights[i] / sum;
    if (r <= acc) return items[i];
  }
  return items[items.length - 1];
}

// clés helpers
function chromaKey(championId: number, skinId: number) {
  return `${championId}:${skinId}`;
}

export class SkinsService extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private poller: ReturnType<typeof setInterval> | null = null;
  private manualPoller: ReturnType<typeof setInterval> | null = null;

  private currentChampion = 0;
  private lastAppliedChampion = 0;

  private includeDefaultSkin = true;

  private selectedSkinId = 0;
  private selectedChromaId = 0;

  private profileIconId = 0;
  private autoRollEnabled = true;

  skins: OwnedSkin[] = [];

  // historiques récents
  private skinHistory = new Map<number, number[]>(); // championId -> [skinId,...]
  private chromaHistory = new Map<string, number[]>(); // "champ:skin" -> [chromaId,...]

  // compteurs "vus" (exploration équitable)
  private skinSeenCounts = new Map<number, Map<number, number>>(); // championId -> Map(skinId, count)
  private chromaSeenCounts = new Map<string, Map<number, number>>(); // "champ:skin" -> Map(chromaId, count)

  setCreds(creds: LockCreds) {
    this.stop();
    this.creds = creds;
    this.summonerId = null;
    this.lastAppliedChampion = 0;
  }

  start() {
    if (!this.creds || this.poller) return;
    void this.tick();
    this.poller = setInterval(() => this.tick(), 1500);
  }

  stop() {
    if (this.poller) clearInterval(this.poller);
    if (this.manualPoller) clearInterval(this.manualPoller);
    this.poller = null;
    this.manualPoller = null;
    this.currentChampion = 0;
    this.lastAppliedChampion = 0;
    if (this.skins.length) {
      this.skins = [];
      this.emit("skins", []);
    }
  }

  // Quand on entre en ChampSelect, active un poll rapide sur la sélection
  private enableManualFastPoll() {
    if (this.manualPoller) return;
    this.manualPoller = setInterval(() => this.updateManualSelection(), 500);
  }
  private disableManualFastPoll() {
    if (this.manualPoller) clearInterval(this.manualPoller);
    this.manualPoller = null;
  }

  getIncludeDefault() {
    return this.includeDefaultSkin;
  }
  toggleIncludeDefault() {
    this.includeDefaultSkin = !this.includeDefaultSkin;
    if (this.autoRollEnabled && this.currentChampion) void this.rerollSkin();
  }

  getSelection() {
    return {
      championId: this.currentChampion,
      championAlias: getChampionAlias(this.currentChampion),
      skinId: this.selectedSkinId,
      chromaId: this.selectedChromaId,
    };
  }

  getAutoRoll() {
    return this.autoRollEnabled;
  }
  toggleAutoRoll() {
    this.autoRollEnabled = !this.autoRollEnabled;
    if (this.autoRollEnabled && this.currentChampion) void this.rerollSkin();
  }

  getProfileIcon() {
    return this.profileIconId;
  }

  // rerollSkin avec anti-repeat + mémoire + poids
  async rerollSkin() {
    if (!this.skins.length) return;

    const pool = this.includeDefaultSkin
      ? this.skins
      : this.skins.filter((s) => s.id % 1000 !== 0) || this.skins;

    const picked = this.pickNextSkin(
      this.currentChampion,
      pool,
      this.selectedSkinId
    );

    // Si impossible (edge) => fallback 100% libre
    const finalSkinId = picked?.id ?? pool[pickIndex(pool.length)].id;

    // Choix chroma au passage (si dispo), en respectant les règles
    let finalId = finalSkinId;
    const skin = this.skins.find((s) => s.id === finalSkinId);
    if (skin && skin.chromas.length) {
      const chroma = this.pickNextChroma(
        this.currentChampion,
        skin,
        this.selectedChromaId
      );
      if (chroma) finalId = chroma.id;
    }

    await this.applySkin(finalId);

    // update sélection
    this.selectedSkinId = finalSkinId;
    this.selectedChromaId = finalId !== finalSkinId ? finalId : 0;
    this.emit("selection", this.getSelection());

    // mémorisation / compteurs
    this.rememberSkin(this.currentChampion, finalSkinId);
    if (this.selectedChromaId)
      this.rememberChroma(
        this.currentChampion,
        finalSkinId,
        this.selectedChromaId
      );

    this.lastAppliedChampion = this.currentChampion;
  }

  // rerollChroma avec anti-repeat + mémoire + poids
  async rerollChroma() {
    const skin = this.skins.find((s) => s.id === this.selectedSkinId);
    if (!skin || skin.chromas.length === 0) return;

    const chroma = this.pickNextChroma(
      this.currentChampion,
      skin,
      this.selectedChromaId
    );
    const finalChromaId =
      chroma?.id ?? skin.chromas[pickIndex(skin.chromas.length)].id;

    await this.applySkin(finalChromaId);
    this.selectedChromaId = finalChromaId;
    this.emit("selection", this.getSelection());

    // mémorisation
    this.rememberChroma(this.currentChampion, skin.id, finalChromaId);
  }

  /* ---------- boucle principale ---------- */
  private async tick() {
    if (!this.creds) return;
    if (this.summonerId === null) await this.fetchSummonerId();

    const champ = await this.fetchCurrentChampion();

    // witch fast-poll selon champ présent (Champ Select) ou non
    if (champ) this.enableManualFastPoll();
    else this.disableManualFastPoll();

    if (champ && champ !== this.currentChampion) {
      this.currentChampion = champ;
      await this.refreshSkinsAndMaybeApply();
    }

    await this.updateManualSelection();
  }

  private async fetchSummonerId() {
    if (!this.creds) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-summoner/v1/current-summoner`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const r = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((r) => r.json())) as SummonerRes;
      this.summonerId = r.summonerId ?? r.accountId ?? r.id ?? null;
      this.profileIconId = r.profileIconId ?? 0;
      this.emit("icon", this.profileIconId);
    } catch {
      this.summonerId = null;
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

  // refreshSkinsAndMaybeApply utilise la même stratégie “intelligente”
  private async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
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
      } catch {
        /* ignore */
      }

      owned.push({ id: s.id, name: s.name, chromas: chromaList });
    }

    this.skins = owned;
    this.emitSkinsIfChanged(owned);

    if (
      this.autoRollEnabled &&
      this.currentChampion !== this.lastAppliedChampion &&
      owned.length
    ) {
      const pool = this.includeDefaultSkin
        ? owned
        : owned.filter((s) => s.id % 1000 !== 0) || owned;

      const pickedSkin =
        this.pickNextSkin(this.currentChampion, pool, this.selectedSkinId) ??
        pool[pickIndex(pool.length)];
      let finalId = pickedSkin.id;

      if (pickedSkin.chromas.length) {
        const c = this.pickNextChroma(
          this.currentChampion,
          pickedSkin,
          this.selectedChromaId
        );
        if (c) finalId = c.id;
      }

      await this.applySkin(finalId);

      this.selectedSkinId = pickedSkin.id;
      this.selectedChromaId = finalId !== pickedSkin.id ? finalId : 0;
      this.emit("selection", this.getSelection());

      // mémorisation
      this.rememberSkin(this.currentChampion, pickedSkin.id);
      if (this.selectedChromaId)
        this.rememberChroma(
          this.currentChampion,
          pickedSkin.id,
          this.selectedChromaId
        );

      this.lastAppliedChampion = this.currentChampion;
    }
  }

  // pick “intelligent” pour le SKIN
  private pickNextSkin(
    championId: number,
    pool: OwnedSkin[],
    prevSkinId: number
  ): OwnedSkin | null {
    if (!pool.length) return null;

    const hist = this.skinHistory.get(championId) ?? [];
    const recentSet = new Set(hist.slice(-SKIN_HISTORY));
    const seenCounts =
      this.skinSeenCounts.get(championId) ?? new Map<number, number>();

    // 1) exclure le skin précédent (jamais le même d’affilée)
    let candidates = pool.filter((s) => s.id !== prevSkinId);

    // 2) anti-boucle courte : exclure les N derniers si possible
    const filtered = candidates.filter((s) => !recentSet.has(s.id));
    if (filtered.length) candidates = filtered; // sinon on garde la liste précédente

    if (!candidates.length) {
      // Si vraiment rien (ex: 1 seul skin dispo), on retombe proprement
      candidates =
        pool.length > 1 ? pool.filter((s) => s.id !== prevSkinId) : pool;
    }

    // 3) priorité “non-vus”
    const unseen = candidates.filter((s) => !seenCounts.has(s.id));
    if (unseen.length) {
      return unseen[pickIndex(unseen.length)];
    }

    // 4) pondération LRU: poids = 1 / (1 + seenCount)
    return weightedPick(
      candidates,
      (s) => 1 / (1 + (seenCounts.get(s.id) ?? 0))
    );
  }

  // pick “intelligent” pour le CHROMA
  private pickNextChroma(
    championId: number,
    skin: OwnedSkin,
    prevChromaId: number
  ) {
    const key = chromaKey(championId, skin.id);
    const hist = this.chromaHistory.get(key) ?? [];
    const recentSet = new Set(hist.slice(-CHROMA_HISTORY));
    const seenCounts =
      this.chromaSeenCounts.get(key) ?? new Map<number, number>();

    // toutes les chromas
    const chromas = skin.chromas;
    if (!chromas.length) return null;

    // 1) exclure chroma précédente
    let candidates = chromas.filter((c) => c.id !== prevChromaId);

    // 2) anti-boucle courte
    const filtered = candidates.filter((c) => !recentSet.has(c.id));
    if (filtered.length) candidates = filtered;

    if (!candidates.length) {
      candidates =
        chromas.length > 1
          ? chromas.filter((c) => c.id !== prevChromaId)
          : chromas;
    }

    // 3) priorité “non-vus”
    const unseen = candidates.filter((c) => !seenCounts.has(c.id));
    if (unseen.length) {
      return unseen[pickIndex(unseen.length)];
    }

    // 4) pondération LRU
    return weightedPick(
      candidates,
      (c) => 1 / (1 + (seenCounts.get(c.id) ?? 0))
    );
  }

  // mémorisation / compteurs
  private rememberSkin(championId: number, skinId: number) {
    const h = this.skinHistory.get(championId) ?? [];
    h.push(skinId);
    if (h.length > SKIN_HISTORY * 3) h.shift(); // garde une taille raisonnable
    this.skinHistory.set(championId, h);

    const counts =
      this.skinSeenCounts.get(championId) ?? new Map<number, number>();
    counts.set(skinId, (counts.get(skinId) ?? 0) + 1);
    this.skinSeenCounts.set(championId, counts);
  }

  private rememberChroma(championId: number, skinId: number, chromaId: number) {
    const key = chromaKey(championId, skinId);

    const h = this.chromaHistory.get(key) ?? [];
    h.push(chromaId);
    if (h.length > CHROMA_HISTORY * 3) h.shift();
    this.chromaHistory.set(key, h);

    const counts = this.chromaSeenCounts.get(key) ?? new Map<number, number>();
    counts.set(chromaId, (counts.get(chromaId) ?? 0) + 1);
    this.chromaSeenCounts.set(key, counts);
  }

  private async applySkin(skinId: number) {
    if (!this.creds) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-champ-select/v1/session/my-selection`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ selectedSkinId: skinId }),
      });
      void this.updateManualSelection();
    } catch {
      /* ignore */
    }
  }

  private async updateManualSelection() {
    if (!this.creds || !this.currentChampion) return;

    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-champ-select/v1/session/my-selection`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const data = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((r) => r.json())) as SelectionRes;
      const selId = data.selectedSkinId ?? 0;
      if (
        !selId ||
        selId === this.selectedChromaId ||
        selId === this.selectedSkinId
      )
        return;

      let skinId = selId;
      let chromaId = 0;

      const directSkin = this.skins.find((s) => s.id === selId);
      if (directSkin) {
        skinId = directSkin.id;
      } else {
        for (const s of this.skins) {
          const c = s.chromas.find((ch) => ch.id === selId);
          if (c) {
            skinId = s.id;
            chromaId = c.id;
            break;
          }
        }
      }

      this.selectedSkinId = skinId;
      this.selectedChromaId = chromaId;
      this.emit("selection", this.getSelection());
    } catch {
      /* ignore */
    }
  }

  // typings EventEmitter
  on(event: "skins", fn: (l: OwnedSkin[]) => void): this;
  on(
    event: "selection",
    fn: (s: { skinId: number; chromaId: number }) => void
  ): this;
  on(event: "icon", fn: (id: number) => void): this;
  override on(event: string, listener: (...args: any[]) => void): this {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return super.on(event, listener);
  }

  emit(event: "skins", l: OwnedSkin[]): boolean;
  emit(event: "selection", s: { skinId: number; chromaId: number }): boolean;
  emit(event: "icon", id: number): boolean;
  override emit(event: string, ...args: any[]): boolean {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return super.emit(event, ...args);
  }
}
