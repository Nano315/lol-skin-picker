/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcuWatcher";
import { randomInt } from "node:crypto";

/** Réponses LCU */
type WardRes = {
  id: number;
  name?: string;
  ownership?: { owned: boolean };
  isOwned?: boolean;
  owned?: boolean;
};
type SelectionRes = { wardSkinId?: number };

const WARD_HISTORY = 2; // anti-boucle: éviter les N derniers wards

function pickIndex(max: number) {
  if (max <= 1) return 0;
  return randomInt(0, max);
}

export class WardService extends EventEmitter {
  private creds: LockCreds | null = null;
  private summonerId: number | null = null;

  private ownedWardIds: number[] = [];
  private recentWardIds: number[] = []; // mémoire glissante
  private selectedWardId = 0;

  private enabled = false; // option "auto ward on lock"

  setCreds(creds: LockCreds) {
    this.creds = creds;
    this.summonerId = null;
    this.ownedWardIds = [];
    this.selectedWardId = 0;
  }

  setEnabled(v: boolean) {
    this.enabled = v;
  }
  getEnabled() {
    return this.enabled;
  }

  /** à appeler quand on entre en Champ Select / ou après (re)connexion */
  async warmup() {
    if (!this.creds) return;
    if (this.summonerId === null) await this.fetchSummonerId();
    await this.fetchOwnedWards();
    await this.readCurrentWard();
  }

  /** Hook appelé par SkinsService quand le champion est “appliqué/lock” */
  async maybeAutoApplyOnChampionLocked() {
    if (!this.enabled) return;
    if (!this.creds || !this.ownedWardIds.length) return;
    // Choisit une ward ≠ précédente, en évitant la courte boucle
    const next = this.pickNextWard();
    if (!next) return;
    await this.applyWard(next);
    this.rememberWard(next);
    this.selectedWardId = next;
    this.emit("ward-selection", next);
  }

  getOwnedWards() {
    return this.ownedWardIds.slice();
  }
  getSelectedWard() {
    return this.selectedWardId;
  }

  /* -------------------- internes -------------------- */
  private async fetchSummonerId() {
    if (!this.creds) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-summoner/v1/current-summoner`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const r = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((x) => x.json())) as {
        summonerId?: number;
        id?: number;
        accountId?: number;
      };
      this.summonerId = r.summonerId ?? r.id ?? r.accountId ?? null;
    } catch {
      this.summonerId = null;
    }
  }

  private async fetchOwnedWards() {
    if (!this.creds || this.summonerId === null) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-collections/v1/inventories/${this.summonerId}/ward-skins`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const list = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((r) => r.json())) as WardRes[];
      this.ownedWardIds = list
        .filter((w) => w.ownership?.owned || w.isOwned || w.owned)
        .map((w) => w.id);
      this.emit("ward-list", this.ownedWardIds.slice());
    } catch {
      this.ownedWardIds = [];
    }
  }

  private async readCurrentWard() {
    if (!this.creds) return;
    const { protocol, port, password } = this.creds;
    const url = `${protocol}://127.0.0.1:${port}/lol-champ-select/v1/session/my-selection`;
    const auth = Buffer.from(`riot:${password}`).toString("base64");
    try {
      const data = (await fetch(url, {
        headers: { Authorization: `Basic ${auth}` },
      }).then((r) => r.json())) as SelectionRes;
      this.selectedWardId = data.wardSkinId ?? 0;
    } catch {
      /* ignore */
    }
  }

  private pickNextWard(): number | null {
    const pool = this.ownedWardIds.filter((id) => id !== this.selectedWardId);
    if (!pool.length) return null;

    // Anti-boucle courte
    const recentSet = new Set(this.recentWardIds.slice(-WARD_HISTORY));
    const candidates = pool.filter((id) => !recentSet.has(id));
    if (candidates.length) {
      return candidates[pickIndex(candidates.length)];
    }
    // fallback si quasi rien
    return pool[pickIndex(pool.length)];
  }

  private rememberWard(id: number) {
    this.recentWardIds.push(id);
    if (this.recentWardIds.length > WARD_HISTORY * 3)
      this.recentWardIds.shift();
  }

  private async applyWard(wardId: number) {
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
        body: JSON.stringify({ wardSkinId: wardId }),
      });
    } catch {
      /* ignore */
    }
  }

  // typings EventEmitter
  override on(event: "ward-list", fn: (ids: number[]) => void): this;
  override on(event: "ward-selection", fn: (id: number) => void): this;
  override on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}
