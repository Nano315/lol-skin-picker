import { EventEmitter } from "node:events";
import type { LockCreds } from "./lcuWatcher";
import { lcuFetch } from "../utils/lcuFetch";
import { logger } from "../logger";
import { RandomSelector } from "../utils/RandomSelector";
import { isArray, isPlainObject } from "../utils/jsonGuards";
import { loadSettings, saveSettings } from "../main/settings";

/**
 * Roll automatique du skin de ward au lock du champion.
 *
 * Endpoints LCU utilises (decouverts via scripts/probe-wards.mjs +
 * scripts/probe-wards-write.mjs) :
 *   - GET  /lol-inventory/v2/inventory/WARD_SKIN          → wards possedes
 *   - GET  /lol-loadouts/v4/loadouts/scope/account        → ward courant
 *   - PATCH /lol-loadouts/v4/loadouts/{loadoutId}         → application
 *
 * Le service est passif : il n'a aucun timer ni socket. Le declenchement vient
 * de `app.ts` qui ecoute l'event `champion-locked` du SkinsService et appelle
 * `rollAndApply()`. Le check du `matchLock` global est lui aussi externalise
 * dans `app.ts` (pour eviter le couplage WardsService → SkinsService).
 */
export class WardsService extends EventEmitter {
  private creds: LockCreds | null = null;
  private enabled = false;
  // Garde de re-entrance : on ne veut pas que deux rolls parallels se
  // marchent dessus si l'event `champion-locked` fire deux fois rapidement
  // (transitions WebSocket vs fallback polling).
  private rolling = false;

  setCreds(creds: LockCreds | null) {
    this.creds = creds;
  }

  getEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Met a jour le toggle et persiste dans settings.json. Idempotent : un
   * appel avec la meme valeur ne re-ecrit pas le fichier.
   */
  async setEnabled(v: boolean): Promise<void> {
    const next = !!v;
    if (next === this.enabled) return;
    this.enabled = next;
    try {
      await saveSettings({ wardAutoRollEnabled: next });
    } catch (err) {
      logger.warn("[Wards] Echec persistance wardAutoRollEnabled", err);
    }
  }

  /** Charge la preference depuis settings.json. A appeler au demarrage. */
  async initFromSettings(): Promise<boolean> {
    try {
      const settings = await loadSettings();
      this.enabled = settings.wardAutoRollEnabled ?? false;
    } catch (err) {
      logger.warn("[Wards] Echec lecture settings, defaut=desactive", err);
      this.enabled = false;
    }
    return this.enabled;
  }

  /**
   * Pick un ward owned au hasard (different de celui actuellement equipe) et
   * l'applique via PATCH sur le loadout LCU. No-op silencieux si :
   *   - le toggle est off,
   *   - les creds LCU manquent,
   *   - l'utilisateur ne possede aucun ward (ou un seul == le current),
   *   - le LCU renvoie une erreur (logged, pas remonte au caller).
   *
   * Safe vis-a-vis des appels concurrents : la garde `this.rolling` skip
   * tout appel chevauchant.
   */
  async rollAndApply(): Promise<boolean> {
    if (!this.enabled) return false;
    if (!this.creds) return false;
    if (this.rolling) {
      logger.debug("[Wards] Roll deja en cours, skip");
      return false;
    }
    this.rolling = true;
    try {
      const ownedIds = await this.fetchOwnedWardIds();
      if (!ownedIds.length) {
        logger.info("[Wards] Aucun ward owned, skip");
        return false;
      }
      const current = await this.fetchCurrentWardSlot();
      if (!current) {
        logger.warn("[Wards] WARD_SKIN_SLOT introuvable dans le loadout, skip");
        return false;
      }
      const pool = ownedIds.filter((id) => id !== current.itemId);
      if (!pool.length) {
        logger.info(
          `[Wards] Un seul ward owned (itemId=${current.itemId}), rien a roll`
        );
        return false;
      }
      const picked = pool[RandomSelector.randomInt(pool.length)];
      const ok = await this.applyWardSkin(current.loadoutId, picked);
      if (ok) {
        logger.info(
          `[Wards] Ward roll OK: ${current.itemId} -> ${picked} (loadoutId=${current.loadoutId})`
        );
      }
      return ok;
    } catch (err) {
      logger.error("[Wards] Erreur pendant rollAndApply", err);
      return false;
    } finally {
      this.rolling = false;
    }
  }

  /* ----------------------- LCU helpers ----------------------- */

  private authHeader(): string {
    if (!this.creds) return "";
    return `Basic ${Buffer.from(`riot:${this.creds.password}`).toString("base64")}`;
  }

  private lcuBase(): string | null {
    if (!this.creds) return null;
    const { protocol, port } = this.creds;
    return `${protocol}://127.0.0.1:${port}`;
  }

  /** GET inventaire, filtre sur `owned === true`. Renvoie les itemIds. */
  private async fetchOwnedWardIds(): Promise<number[]> {
    const base = this.lcuBase();
    if (!base) return [];
    const url = `${base}/lol-inventory/v2/inventory/WARD_SKIN`;
    try {
      const res = await lcuFetch(url, {
        headers: { Authorization: this.authHeader() },
      });
      if (!res.ok) {
        logger.warn(`[Wards] Inventaire LCU status=${res.status}`);
        return [];
      }
      const data = (await res.json()) as unknown;
      if (!isArray(data)) return [];
      const out: number[] = [];
      for (const entry of data) {
        if (!isPlainObject(entry)) continue;
        if (entry.owned !== true) continue;
        const itemId = entry.itemId;
        if (typeof itemId !== "number") continue;
        if (!Number.isInteger(itemId) || itemId < 0) continue;
        out.push(itemId);
      }
      return out;
    } catch (err) {
      logger.warn("[Wards] Erreur fetch inventaire", err);
      return [];
    }
  }

  /**
   * GET les loadouts, retourne le premier qui expose un WARD_SKIN_SLOT
   * (`{ loadoutId, itemId }`). Renvoie null sinon.
   */
  private async fetchCurrentWardSlot(): Promise<{
    loadoutId: string;
    itemId: number;
  } | null> {
    const base = this.lcuBase();
    if (!base) return null;
    const url = `${base}/lol-loadouts/v4/loadouts/scope/account`;
    try {
      const res = await lcuFetch(url, {
        headers: { Authorization: this.authHeader() },
      });
      if (!res.ok) {
        logger.warn(`[Wards] Loadouts LCU status=${res.status}`);
        return null;
      }
      const data = (await res.json()) as unknown;
      if (!isArray(data)) return null;
      for (const loadout of data) {
        if (!isPlainObject(loadout)) continue;
        if (typeof loadout.id !== "string") continue;
        const slotsRaw = loadout.loadout;
        if (!isPlainObject(slotsRaw)) continue;
        const slot = slotsRaw.WARD_SKIN_SLOT;
        if (!isPlainObject(slot)) continue;
        const itemId = slot.itemId;
        if (typeof itemId !== "number") continue;
        return { loadoutId: loadout.id, itemId };
      }
      return null;
    } catch (err) {
      logger.warn("[Wards] Erreur fetch loadout", err);
      return null;
    }
  }

  /**
   * PATCH `/lol-loadouts/v4/loadouts/{loadoutId}` avec un body partial qui
   * ne touche QUE le slot WARD_SKIN_SLOT. Le LCU merge avec le reste du
   * loadout — emote, banner, companion etc. restent intacts.
   */
  private async applyWardSkin(
    loadoutId: string,
    itemId: number
  ): Promise<boolean> {
    const base = this.lcuBase();
    if (!base) return false;
    if (!Number.isInteger(itemId) || itemId < 0 || itemId > 1_000_000_000) {
      logger.warn(`[Wards] applyWardSkin refused: invalid itemId ${itemId}`);
      return false;
    }
    const url = `${base}/lol-loadouts/v4/loadouts/${encodeURIComponent(loadoutId)}`;
    const body = {
      loadout: {
        WARD_SKIN_SLOT: {
          contentId: "",
          data: {},
          inventoryType: "WARD_SKIN",
          itemId,
        },
      },
    };
    try {
      const res = await lcuFetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authHeader(),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        logger.warn(
          `[Wards] Apply LCU status=${res.status} (loadoutId=${loadoutId}, itemId=${itemId})`
        );
        return false;
      }
      return true;
    } catch (err) {
      logger.error("[Wards] Erreur apply", err);
      return false;
    }
  }
}
