/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcuWatcher";
import { ensureAliasMap, getChampionAlias } from "../utils/communityDragon";

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

  async rerollSkin() {
    if (!this.skins.length) return;
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
    this.lastAppliedChampion = this.currentChampion;
  }

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
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const finalId = picked.chromas.length
        ? picked.chromas[Math.floor(Math.random() * picked.chromas.length)].id
        : picked.id;

      await this.applySkin(finalId);
      this.selectedSkinId = picked.id;
      this.selectedChromaId = finalId !== picked.id ? finalId : 0;
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
