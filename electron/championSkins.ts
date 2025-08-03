import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcu.js";

/* --- alias mapping CommunityDragon (id ⇒ alias) --- */
const aliasMap = new Map<number, string>();
async function ensureAliasMap() {
  if (aliasMap.size) return;
  const url =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";
  const data = (await fetch(url).then((r) => r.json())) as {
    id: number;
    alias: string;
  }[];
  data.forEach((ch) => aliasMap.set(ch.id, ch.alias));
}

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

/* ---- type envoyé au renderer ---- */
export interface OwnedSkin {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
}

interface SelectionRes {
  selectedSkinId?: number;
}

/* ---- watcher + auto-apply ---- */
export class ChampionSkinWatcher extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private poller: ReturnType<typeof setInterval> | null = null;
  private currentChampion = 0;
  private lastAppliedChampion = 0;

  private includeDefaultSkin = true;

  private selectedSkinId = 0;
  private selectedChromaId = 0;

  private profileIconId = 0;

  private autoRollEnabled = true;

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
    if (this.autoRollEnabled && this.currentChampion) this.rerollSkin();
  }

  getSelection() {
    return {
      championId: this.currentChampion,
      championAlias: aliasMap.get(this.currentChampion) ?? "",
      skinId: this.selectedSkinId,
      chromaId: this.selectedChromaId,
    };
  }

  getAutoRoll() {
    return this.autoRollEnabled;
  }

  toggleAutoRoll() {
    this.autoRollEnabled = !this.autoRollEnabled;
    if (this.autoRollEnabled && this.currentChampion) this.rerollSkin(); // relance seulement si on vient d’activer
  }

  getProfileIcon() {
    return this.profileIconId;
  }

  /** Reroll manuel (skin + chroma éventuelle) */
  async rerollSkin() {
    if (!this.skins.length) return;

    /* pool respectant le toggle */
    const pool = this.includeDefaultSkin
      ? this.skins
      : this.skins.filter((s) => s.id % 1000 !== 0) || this.skins;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const finalId = pick.chromas.length
      ? pick.chromas[Math.floor(Math.random() * pick.chromas.length)].id
      : pick.id;

    await this.applySkin(finalId);

    this.selectedSkinId = pick.id;
    this.selectedChromaId = finalId !== pick.id ? finalId : 0;
    this.emit("selection", this.getSelection());

    /* on “fige” le champion courant pour éviter auto-reroll immédiat */
    this.lastAppliedChampion = this.currentChampion;
  }

  /** Reroll uniquement le chroma pour le skin courant */
  async rerollChroma() {
    const skin = this.skins.find((s) => s.id === this.selectedSkinId);
    if (!skin || skin.chromas.length === 0) return;

    let chroma = skin.chromas[Math.floor(Math.random() * skin.chromas.length)];
    if (skin.chromas.length > 1) {
      while (chroma.id === this.selectedChromaId) {
        chroma = skin.chromas[Math.floor(Math.random() * skin.chromas.length)];
      }
    }

    await this.applySkin(chroma.id);
    this.selectedChromaId = chroma.id;
    this.emit("selection", this.getSelection());
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
    await this.updateManualSelection();
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
    this.emit("skins", owned);

    /* -- tirage aléatoire + application -- */
    if (
      this.autoRollEnabled &&
      this.currentChampion !== this.lastAppliedChampion &&
      owned.length
    ) {
      const pool = this.includeDefaultSkin
        ? owned
        : owned.filter((s) => s.id % 1000 !== 0) || owned;

      const pickedSkin = pool[Math.floor(Math.random() * pool.length)];
      const finalId = pickedSkin.chromas.length
        ? pickedSkin.chromas[
            Math.floor(Math.random() * pickedSkin.chromas.length)
          ].id
        : pickedSkin.id;

      await this.applySkin(finalId);

      this.selectedSkinId = pickedSkin.id;
      this.selectedChromaId = finalId !== pickedSkin.id ? finalId : 0;
      this.emit("selection", this.getSelection());

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

  /** détecte la sélection faite directement dans le client */
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

      /* retrouve le skin / chroma correspondant dans la liste courante */
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
      /* ignore erreurs réseau */
    }
  }

  /* ---- EventEmitter typings ---- */
  /* surcharges (aucun corps) */
  on(event: "skins", fn: (l: OwnedSkin[]) => void): this;
  on(
    event: "selection",
    fn: (s: { skinId: number; chromaId: number }) => void
  ): this;
  on(event: "icon", fn: (id: number) => void): this;

  /* implémentation générique — doit accepter TOUS les cas */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  override on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  /* surcharges emit */
  emit(event: "skins", l: OwnedSkin[]): boolean;
  emit(event: "selection", s: { skinId: number; chromaId: number }): boolean;
  emit(event: "icon", id: number): boolean;

  /* implémentation générique */
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  override emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }
}
