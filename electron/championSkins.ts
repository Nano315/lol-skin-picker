import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcu.js";

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

export interface OwnedSkin {
  id: number;
  name: string;
  chromas: string[];
}

export class ChampionSkinWatcher extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private poller: ReturnType<typeof setInterval> | null = null;
  private currentChampion = 0;

  skins: OwnedSkin[] = [];

  /* — public — */
  setCreds(creds: LockCreds) {
    /* redémarre proprement à chaque nouvelle cred */
    this.stop();
    this.creds = creds;
    this.summonerId = null; // forcera un refetch
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

  /* — internals — */
  private async tick() {
    if (!this.creds) return;
    if (this.summonerId === null) await this.fetchSummonerId();
    const champ = await this.fetchCurrentChampion();
    if (champ && champ !== this.currentChampion) {
      this.currentChampion = champ;
      await this.refreshSkins();
    }
  }

  private async fetchSummonerId() {
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

  private async refreshSkins() {
    if (!this.creds || this.summonerId === null || !this.currentChampion)
      return;
    const { protocol, port, password } = this.creds;
    const base = `${protocol}://127.0.0.1:${port}`;
    const headers = {
      Authorization: `Basic ${Buffer.from(`riot:${password}`).toString(
        "base64"
      )}`,
    };

    /* skins possédés */
    const skinsRes = (await fetch(
      `${base}/lol-champions/v1/inventories/${this.summonerId}/champions/${this.currentChampion}/skins`,
      { headers }
    ).then((r) => r.json())) as SkinRes[];

    const owned: OwnedSkin[] = [];
    for (const s of skinsRes.filter(
      (s) => s.ownership?.owned || s.isOwned || s.owned
    )) {
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

      owned.push({ id: s.id, name: s.name, chromas: chromaNames });
    }

    this.skins = owned;
    this.emit("skins", owned);
  }

  /* typing event helpers */
  override on(event: "skins", fn: (l: OwnedSkin[]) => void): this {
    return super.on(event, fn);
  }
  override emit(event: "skins", l: OwnedSkin[]): boolean {
    return super.emit(event, l);
  }
}
