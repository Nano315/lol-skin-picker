import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcu.js";

/* ---------- types API ---------- */
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
  name?: string;
  id: number;
  ownership?: { owned: boolean };
  isOwned?: boolean;
  owned?: boolean;
}

/* ---------- type envoyé ---------- */
export interface OwnedSkin {
  id: number;
  name: string;
  chromas: string[];
}

/* ---------- watcher ---------- */
export class ChampionSkinWatcher extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private poller: ReturnType<typeof setInterval> | null = null;
  private currentChampion = 0;

  skins: OwnedSkin[] = [];

  setCreds(creds: LockCreds) {
    this.creds = creds;
    void this.obtainSummonerId();
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
    if (this.skins.length) {
      this.skins = [];
      this.emit("skins", []);
    }
  }

  /* ---------- internals ---------- */
  private async tick() {
    if (!this.creds) return;
    if (this.summonerId === null) await this.obtainSummonerId();
    const champId = await this.fetchCurrentChampion();

    if (champId && champId !== this.currentChampion) {
      this.currentChampion = champId;
      await this.updateSkins();
    }
  }

  private async obtainSummonerId() {
    if (!this.creds) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-summoner/v1/current-summoner`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      const data = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((r) => r.json())) as SummonerRes;
      this.summonerId = data.summonerId ?? data.accountId ?? data.id ?? null;
    } catch {
      /* ignore */
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

  private async updateSkins() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    const { protocol, port, password } = this.creds;
    const base = `${protocol}://127.0.0.1:${port}`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    const headers = { Authorization: `Basic ${auth}` };

    /* 1. liste brute des skins possédés */
    const skinsRes = (await fetch(
      `${base}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
      { headers }
    ).then((r) => r.json())) as SkinRes[];

    const ownedSkinsRes = skinsRes.filter(
      (s) => s.ownership?.owned || s.isOwned || s.owned
    );

    /* 2. pour chacun → fetch chromas possédés */
    const ownedSkins: OwnedSkin[] = [];
    for (const s of ownedSkinsRes) {
      let chromaNames: string[] = [];
      try {
        const chromas = (await fetch(
          `${base}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins/${s.id}/chromas`,
          { headers }
        ).then((r) => (r.status === 404 ? [] : r.json()))) as ChromaRes[];

        chromaNames = chromas
          .filter((c) => c.ownership?.owned || c.isOwned || c.owned)
          .map((c) => c.name || `Chroma ${c.id}`);
      } catch {
        /* ignore */
      }

      ownedSkins.push({ id: s.id, name: s.name, chromas: chromaNames });
    }

    this.skins = ownedSkins;
    this.emit("skins", ownedSkins);
  }

  /* typing events */
  override on(event: "skins", listener: (list: OwnedSkin[]) => void): this {
    return super.on(event, listener);
  }
  override emit(event: "skins", list: OwnedSkin[]): boolean {
    return super.emit(event, list);
  }
}
