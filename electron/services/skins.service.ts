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

  private championLocked = false;

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
    this.championLocked = false;
    this.selectedSkinId = 0;
    this.selectedChromaId = 0;
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

  async rerollSkin() {
    if (!this.skins.length) return;
    const pool = this.includeDefaultSkin
      ? this.skins
      : this.skins.filter((s) => s.id % 1000 !== 0) || this.skins;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const finalId = pick.chromas.length
      ? pick.chromas[Math.floor(Math.random() * pick.chromas.length)].id
      : pick.id;

    const applied = await this.applySkin(finalId);
    if (!applied) return; // Only update selection when the server accepts the change.
    this.selectedSkinId = pick.id;
    this.selectedChromaId = finalId !== pick.id ? finalId : 0;
    this.emit("selection", this.getSelection());
    this.lastAppliedChampion = this.currentChampion;
  }

  async rerollChroma() {
    const skin = this.skins.find((s) => s.id === this.selectedSkinId);
    if (!skin || skin.chromas.length === 0) return;

    // 1) Construire toutes les options possibles :
    //    - l'ID du skin de base (pas de chroma)
    //    - tous les chromas possédés
    const allChoices: number[] = [
      skin.id, // base (sans chroma)
      ...skin.chromas.map((c) => c.id), // chromas
    ];

    // 2) ID actuellement actif côté LCU :
    //    - si selectedChromaId != 0 -> chroma actif
    //    - sinon -> variante de base
    const currentId = this.selectedChromaId || skin.id;

    // 3) On exclut l'option actuellement active
    const pool = allChoices.filter((id) => id !== currentId);
    if (pool.length === 0) return; // devrait être impossible, mais par sécurité

    // 4) On pioche un nouvel ID
    const pickedId = pool[Math.floor(Math.random() * pool.length)];

    // 5) On applique le skin/chroma
    const applied = await this.applySkin(pickedId);
    if (!applied) return; // ne pas mentir à l'UI si le LCU refuse

    // 6) Mise à jour de l'état :
    //    - si on est revenu au skin de base -> chromaId = 0
    //    - sinon -> chromaId = ID du chroma
    this.selectedChromaId = pickedId === skin.id ? 0 : pickedId;

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

      // nouvelle game / nouveau champion => on repart à zéro côté sélection
      this.championLocked = false;
      this.selectedSkinId = 0;
      this.selectedChromaId = 0;
      this.emit("selection", this.getSelection());

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

    // Emit using the previous cache so the change detector can compare arrays.
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

      const applied = await this.applySkin(finalId);
      if (!applied) return; // Skip optimistic updates when the LCU rejects the skin.
      this.selectedSkinId = picked.id;
      this.selectedChromaId = finalId !== picked.id ? finalId : 0;
      this.emit("selection", this.getSelection());
      this.lastAppliedChampion = this.currentChampion;
    }
  }

  private async applySkin(skinId: number): Promise<boolean> {
    if (!this.creds) return false;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-champ-select/v1/session/my-selection`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({ selectedSkinId: skinId }),
      });
      if (!res.ok) return false; // Bubble failure so callers avoid desynchronizing UI state.
      void this.updateManualSelection();
      return true;
    } catch {
      return false; // Propagate network errors to callers.
    }
    return false; // Default to failure if we somehow drop through the try/catch.
  }

  private async updateManualSelection() {
    if (!this.creds || !this.currentChampion) return;

    const { protocol, port, password } = this.creds;
    const base = `${protocol}://127.0.0.1:${port}`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");

    try {
      // On récupère à la fois la sélection et la session champ select
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

      // --- 1) Calcul du flag "locked" ---
      let lockedChanged = false;

      if (sessionData && Array.isArray(sessionData.actions)) {
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
          lockedChanged = true;
        }
      }

      // --- 2) Recalcul complet skin/chroma à partir de selectedSkinId ---
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
      }

      // --- 3) On notifie le renderer si quelque chose a changé ---
      if (selectionChanged || lockedChanged) {
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
  override on(event: string, listener: (...args: any[]) => void): this {
    // eslint-disable-line @typescript-eslint/no-explicit-any
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
  override emit(event: string, ...args: any[]): boolean {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return super.emit(event, ...args);
  }
}
