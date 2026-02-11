/**
 * SkinLine Service - Fetches and caches skin line data from CDragon
 * Associates each skin with its thematic skin line for synergy matching
 */

import { app } from "electron";
import { join } from "node:path";
import { promises as fs } from "node:fs";
import fetch from "node-fetch";
import { logger } from "../logger";

// ===================== TYPES =====================

export interface SkinLineInfo {
  id: number;
  name: string;
}

interface SkinLineCache {
  skinLines: SkinLineInfo[];
  skinToLineMap: Record<number, SkinLineInfo>;
  timestamp: number;
}

interface CDragonSkinLine {
  id: number;
  name: string;
  description: string | null;
}

interface CDragonSkin {
  id: number;
  name: string;
  skinLines?: Array<{ id: number }>;
}

// ===================== CONSTANTS =====================

const SKINLINES_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skinlines.json";
const SKINS_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 30000; // 30 seconds

// ===================== SERVICE =====================

class SkinLineService {
  private cache: SkinLineCache | null = null;
  private cachePath: string = "";
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the service - loads from cache or fetches from CDragon
   * Called once at app startup
   */
  async initialize(): Promise<void> {
    // Prevent multiple concurrent initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    if (this.initialized) return;

    this.cachePath = join(app.getPath("userData"), "skinlines-cache.json");
    logger.info("[SkinLineService] Initializing...");

    // Try to load from cache first
    const cached = await this.loadCache();

    if (cached && this.isCacheValid(cached)) {
      logger.info("[SkinLineService] Cache hit - using cached data");
      this.cache = cached;
      this.initialized = true;
      return;
    }

    logger.info("[SkinLineService] Cache miss or expired - fetching from CDragon");

    // Try to fetch fresh data
    try {
      await this.fetchAndBuildCache();
      logger.info(
        `[SkinLineService] Fetch successful - ${this.cache?.skinLines.length ?? 0} skin lines, ${Object.keys(this.cache?.skinToLineMap ?? {}).length} skin mappings`
      );
    } catch (error) {
      // Fallback to stale cache if available
      if (cached) {
        logger.warn(
          "[SkinLineService] CDragon fetch failed, falling back to stale cache",
          error
        );
        this.cache = cached;
      } else {
        logger.error(
          "[SkinLineService] CDragon fetch failed and no cache available",
          error
        );
        // Initialize with empty data to prevent crashes
        this.cache = {
          skinLines: [],
          skinToLineMap: {},
          timestamp: 0,
        };
      }
    }

    this.initialized = true;
  }

  /**
   * Get skin line info for a specific skin ID
   * @returns SkinLineInfo or null if skin is base/unknown
   */
  getSkinLine(skinId: number): SkinLineInfo | null {
    if (!this.cache) {
      logger.warn("[SkinLineService] getSkinLine called before initialization");
      return null;
    }

    const info = this.cache.skinToLineMap[skinId];
    if (!info) {
      return null;
    }

    // Exclude "Base" skin line (id = 1) from synergies
    if (info.id === 1) {
      return null;
    }

    return info;
  }

  /**
   * Get all available skin lines
   */
  getSkinLines(): SkinLineInfo[] {
    if (!this.cache) {
      logger.warn("[SkinLineService] getSkinLines called before initialization");
      return [];
    }

    // Filter out "Base" skin line
    return this.cache.skinLines.filter((sl) => sl.id !== 1);
  }

  // ===================== PRIVATE METHODS =====================

  private isCacheValid(cache: SkinLineCache): boolean {
    const age = Date.now() - cache.timestamp;
    return age < CACHE_TTL_MS;
  }

  private async loadCache(): Promise<SkinLineCache | null> {
    try {
      const data = await fs.readFile(this.cachePath, "utf-8");
      return JSON.parse(data) as SkinLineCache;
    } catch {
      return null;
    }
  }

  private async saveCache(cache: SkinLineCache): Promise<void> {
    try {
      await fs.writeFile(this.cachePath, JSON.stringify(cache), "utf-8");
    } catch (error) {
      logger.error("[SkinLineService] Failed to save cache", error);
    }
  }

  private async fetchWithTimeout(
    url: string,
    timeoutMs: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal as AbortSignal,
      });
      return response as unknown as Response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async fetchSkinLines(): Promise<CDragonSkinLine[]> {
    logger.debug("[SkinLineService] Fetching skinlines.json...");
    const response = await this.fetchWithTimeout(SKINLINES_URL, FETCH_TIMEOUT_MS);

    if (!response.ok) {
      throw new Error(`Failed to fetch skinlines: ${response.status}`);
    }

    return (await response.json()) as CDragonSkinLine[];
  }

  private async fetchSkins(): Promise<Record<string, CDragonSkin>> {
    logger.debug("[SkinLineService] Fetching skins.json...");
    const response = await this.fetchWithTimeout(SKINS_URL, FETCH_TIMEOUT_MS);

    if (!response.ok) {
      throw new Error(`Failed to fetch skins: ${response.status}`);
    }

    return (await response.json()) as Record<string, CDragonSkin>;
  }

  private async fetchAndBuildCache(): Promise<void> {
    // Fetch both in parallel for speed
    const [skinLinesRaw, skinsRaw] = await Promise.all([
      this.fetchSkinLines(),
      this.fetchSkins(),
    ]);

    // Build skin line lookup map
    const skinLineMap = new Map<number, SkinLineInfo>();
    for (const sl of skinLinesRaw) {
      skinLineMap.set(sl.id, { id: sl.id, name: sl.name });
    }

    // Build skinId -> skinLine mapping
    const skinToLineMap: Record<number, SkinLineInfo> = {};

    for (const [skinIdStr, skin] of Object.entries(skinsRaw)) {
      const skinId = parseInt(skinIdStr, 10);
      if (isNaN(skinId)) continue;

      // Take the first skinLine if multiple exist
      const firstSkinLine = skin.skinLines?.[0];
      if (firstSkinLine) {
        const lineInfo = skinLineMap.get(firstSkinLine.id);
        if (lineInfo) {
          skinToLineMap[skinId] = lineInfo;
        }
      }
    }

    // Build final cache
    this.cache = {
      skinLines: Array.from(skinLineMap.values()),
      skinToLineMap,
      timestamp: Date.now(),
    };

    // Persist to disk
    await this.saveCache(this.cache);
  }
}

// Singleton export
export const skinLineService = new SkinLineService();
