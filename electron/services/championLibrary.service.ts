/**
 * Champion library service — backs the new Library page.
 *
 * Two on-demand fetches against the LCU:
 *  - the full list of owned champions enriched with mastery points
 *  - the owned skins (and their owned chromas) for any single champion
 *
 * Both responses are cached in memory for `CACHE_TTL_MS`. The renderer can
 * trigger a manual refresh by calling `invalidateCache()` over IPC.
 *
 * This service is intentionally separate from `SkinsService`: that one is
 * tightly coupled to the live champ-select state (events, history, auto-apply),
 * whereas this one is pull-only and works for any owned champion regardless
 * of what the user is doing in the client.
 */

import { lcuFetch } from "../utils/lcuFetch";
import { logger } from "../logger";
import type { LcuWatcher, LockCreds } from "./lcuWatcher";
import { ensureAliasMap, getChampionAlias } from "../utils/communityDragon";
import type { OwnedSkin } from "./skins.service";

export interface OwnedChampion {
  id: number;
  alias: string;
  name: string;
  mastery: number;
  skinCount: number;
}

interface SummonerRes {
  summonerId?: number;
  accountId?: number;
  id?: number;
}

interface ChampionRes {
  id?: number;
  alias?: string;
  name?: string;
  ownership?: { owned?: boolean };
  isOwned?: boolean;
  owned?: boolean;
}

interface MasteryRes {
  championId?: number;
  championPoints?: number;
}

interface SkinRes {
  id: number;
  name: string;
  ownership?: { owned?: boolean };
  isOwned?: boolean;
  owned?: boolean;
}

interface ChromaRes {
  id: number;
  name?: string;
  ownership?: { owned?: boolean };
  isOwned?: boolean;
  owned?: boolean;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ChampionLibraryService {
  private summonerId: number | null = null;
  private championsCache: CacheEntry<OwnedChampion[]> | null = null;
  private readonly skinsCache = new Map<number, CacheEntry<OwnedSkin[]>>();

  constructor(private readonly lcu: LcuWatcher) {}

  invalidateCache(): void {
    this.championsCache = null;
    this.skinsCache.clear();
    this.summonerId = null;
  }

  private buildAuth(creds: LockCreds): string {
    return Buffer.from(`riot:${creds.password}`).toString("base64");
  }

  /**
   * Fill `skinCount` on each entry by querying the per-champion skins endpoint
   * in parallel batches. The main `lol-champions/v1/inventories/.../champions`
   * endpoint doesn't reliably include owned-skin info across LoL client
   * versions, so this is the cheapest reliable path.
   */
  private async fillSkinCounts(
    champions: OwnedChampion[],
    base: string,
    summonerId: number,
    headers: { Authorization: string }
  ): Promise<void> {
    const BATCH_SIZE = 8;
    for (let i = 0; i < champions.length; i += BATCH_SIZE) {
      const batch = champions.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (champion) => {
          try {
            const r = await lcuFetch(
              `${base}/lol-champions/v1/inventories/${summonerId}/champions/${champion.id}/skins`,
              { headers }
            );
            if (!r.ok) return;
            const skins = (await r.json()) as SkinRes[];
            champion.skinCount = skins.filter(
              (s) => s.ownership?.owned || s.isOwned || s.owned
            ).length;
          } catch {
            // leave as 0; the row still renders, sort just deprioritizes it
          }
        })
      );
    }
  }

  /**
   * Fetch champion mastery, trying the modern local-player endpoint first
   * (works post-PUUID migration without needing any ID) and falling back to
   * the legacy summonerId-based endpoint for older clients.
   */
  private async fetchMasteries(
    base: string,
    summonerId: number,
    headers: { Authorization: string }
  ): Promise<MasteryRes[]> {
    try {
      const r = await lcuFetch(
        `${base}/lol-champion-mastery/v1/local-player/champion-mastery`,
        { headers }
      );
      if (r.ok) {
        const data = (await r.json()) as MasteryRes[];
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      logger.debug(
        "[ChampionLibrary] local-player mastery endpoint failed",
        err
      );
    }

    try {
      const r = await lcuFetch(
        `${base}/lol-collections/v1/inventories/${summonerId}/champion-mastery`,
        { headers }
      );
      if (r.ok) {
        const data = (await r.json()) as MasteryRes[];
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      logger.debug(
        "[ChampionLibrary] legacy mastery endpoint failed",
        err
      );
    }

    logger.warn(
      "[ChampionLibrary] No mastery data — both endpoints returned empty/error"
    );
    return [];
  }

  private async resolveSummonerId(creds: LockCreds): Promise<number | null> {
    if (this.summonerId !== null) return this.summonerId;
    const url = `${creds.protocol}://127.0.0.1:${creds.port}/lol-summoner/v1/current-summoner`;
    try {
      const r = (await lcuFetch(url, {
        headers: { Authorization: `Basic ${this.buildAuth(creds)}` },
      }).then((res) => res.json())) as SummonerRes;
      this.summonerId = r.summonerId ?? r.accountId ?? r.id ?? null;
      return this.summonerId;
    } catch (err) {
      logger.debug("[ChampionLibrary] resolveSummonerId failed", err);
      return null;
    }
  }

  async getOwnedChampions(): Promise<OwnedChampion[]> {
    const creds = this.lcu.creds;
    if (!creds) return [];

    if (
      this.championsCache &&
      Date.now() - this.championsCache.timestamp < CACHE_TTL_MS
    ) {
      return this.championsCache.data;
    }

    const summonerId = await this.resolveSummonerId(creds);
    if (!summonerId) return [];

    const headers = { Authorization: `Basic ${this.buildAuth(creds)}` };
    const base = `${creds.protocol}://127.0.0.1:${creds.port}`;

    try {
      const [championsRaw, masteriesRaw] = await Promise.all([
        lcuFetch(
          `${base}/lol-champions/v1/inventories/${summonerId}/champions`,
          { headers }
        ).then((r) => (r.ok ? (r.json() as Promise<ChampionRes[]>) : [])),
        this.fetchMasteries(base, summonerId, headers),
      ]);

      logger.info("[ChampionLibrary] Loaded", {
        champions: championsRaw.length,
        masteryEntries: masteriesRaw.length,
      });

      const masteryMap = new Map<number, number>();
      for (const m of masteriesRaw) {
        if (
          typeof m.championId === "number" &&
          typeof m.championPoints === "number"
        ) {
          masteryMap.set(m.championId, m.championPoints);
        }
      }

      await ensureAliasMap();

      const owned: OwnedChampion[] = [];
      for (const c of championsRaw) {
        if (typeof c.id !== "number" || c.id <= 0) continue; // 0/-1 = "no champion" placeholders
        const isOwned = c.ownership?.owned || c.isOwned || c.owned;
        if (!isOwned) continue;
        const alias = c.alias || getChampionAlias(c.id);
        if (!alias) continue;
        owned.push({
          id: c.id,
          alias,
          name: c.name || alias,
          mastery: masteryMap.get(c.id) ?? 0,
          skinCount: 0,
        });
      }

      await this.fillSkinCounts(owned, base, summonerId, headers);

      this.championsCache = { data: owned, timestamp: Date.now() };
      return owned;
    } catch (err) {
      logger.error("[ChampionLibrary] getOwnedChampions failed", err);
      return [];
    }
  }

  async getSkinsForChampion(championId: number): Promise<OwnedSkin[]> {
    const creds = this.lcu.creds;
    if (!creds || !championId || championId <= 0) return [];

    const cached = this.skinsCache.get(championId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    const summonerId = await this.resolveSummonerId(creds);
    if (!summonerId) return [];

    const headers = { Authorization: `Basic ${this.buildAuth(creds)}` };
    const base = `${creds.protocol}://127.0.0.1:${creds.port}`;

    try {
      const allSkins = (await lcuFetch(
        `${base}/lol-champions/v1/inventories/${summonerId}/champions/${championId}/skins`,
        { headers }
      ).then((r) => (r.ok ? r.json() : []))) as SkinRes[];

      const owned: OwnedSkin[] = [];
      for (const s of allSkins.filter(
        (skin) => skin.ownership?.owned || skin.isOwned || skin.owned
      )) {
        let chromaList: { id: number; name: string }[] = [];
        try {
          const chromas = (await lcuFetch(
            `${base}/lol-champions/v1/inventories/${summonerId}/champions/${championId}/skins/${s.id}/chromas`,
            { headers }
          ).then((r) => (r.status === 404 ? [] : r.json()))) as ChromaRes[];

          chromaList = chromas
            .filter((c) => c.ownership?.owned || c.isOwned || c.owned)
            .map((c) => ({ id: c.id, name: c.name || `Chroma ${c.id}` }));
        } catch (err) {
          logger.warn(
            `[ChampionLibrary] chromas fetch failed for skin ${s.id}`,
            err
          );
        }

        owned.push({
          id: s.id,
          name: s.name,
          chromas: chromaList,
          championId,
        });
      }

      this.skinsCache.set(championId, { data: owned, timestamp: Date.now() });
      return owned;
    } catch (err) {
      logger.error(
        `[ChampionLibrary] getSkinsForChampion(${championId}) failed`,
        err
      );
      return [];
    }
  }
}
