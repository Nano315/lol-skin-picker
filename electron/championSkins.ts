import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcu.js";

/* ---- réponses API ---- */
interface SummonerRes {
  summonerId?: number;
  accountId?: number;
  id?: number;
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

/* ---- type envoyé au renderer ---- */
export interface OwnedSkin {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
}

/* ---- watcher + auto-apply ---- */
export class ChampionSkinWatcher extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private poller: ReturnType<typeof setInterval> | null = null;
  private currentChampion = 0;
  private lastAppliedChampion = 0;

  private includeDefaultSkin = true;

  skins: OwnedSkin[] = [];

  /* ---------- gestion des creds ---------- */
  setCreds(creds: LockCreds) {
    this.stop();
    this.creds = creds;
    this.summonerId = null;
    this.lastAppliedChampion = 0;
  }
  start() {
    if (!this.creds || this.poller) return;
    void this.tick();
    this.poller = setInterval(() => this.tick(), 2000);
  }
  stop() {
    if (this.poller) clearInterval(this.poller);
    this.poller = null;
    this.currentChampion = 0;
    this.lastAppliedChampion = 0;
    if (this.skins.length) {
      this.skins = [];
      this.emit("skins", []);
    }
  }
  getIncludeDefault() {
    return this.includeDefaultSkin;
  }
  toggleIncludeDefault() {
    this.includeDefaultSkin = !this.includeDefaultSkin;
    if (this.currentChampion) this.refreshSkinsAndMaybeApply();
  }

  /* ---------- boucle principale ---------- */
  private async tick() {
    if (!this.creds) return;
    if (this.summonerId === null) await this.fetchSummonerId();
    const champ = await this.fetchCurrentChampion();
    if (champ && champ !== this.currentChampion) {
      this.currentChampion = champ;
      await this.refreshSkinsAndMaybeApply();
    }
  }

  /* ---------- helpers ---------- */
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

  private async refreshSkinsAndMaybeApply() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
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
    this.emit("skins", owned);

    /* -- tirage aléatoire + application -- */
    if (this.currentChampion !== this.lastAppliedChampion && owned.length) {
      const pool = this.includeDefaultSkin
        ? owned
        : owned.filter((s) => s.id % 1000 !== 0) || owned; // garde au moins 1
      const pickedSkin = pool[Math.floor(Math.random() * pool.length)];

      const finalSkinId = pickedSkin.chromas.length
        ? pickedSkin.chromas[
            Math.floor(Math.random() * pickedSkin.chromas.length)
          ].id
        : pickedSkin.id;

      await this.applySkin(finalSkinId);
      this.lastAppliedChampion = this.currentChampion;
    }
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
    } catch {
      /* ignore */
    }
  }

  /* ---- EventEmitter typings ---- */
  override on(event: "skins", fn: (l: OwnedSkin[]) => void): this {
    return super.on(event, fn);
  }
  override emit(event: "skins", l: OwnedSkin[]): boolean {
    return super.emit(event, l);
  }
}
