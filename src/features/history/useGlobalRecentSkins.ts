/**
 * useGlobalRecentSkins — feeds the Solo standby carousel.
 *
 * Returns the user's last `limit` skin picks across every champion (most
 * recent first), enriched with the champion alias so consumers can build
 * splash URLs without another lookup. Falls back to a randomized sample
 * of owned champions (base skin) when the user has no recorded history
 * yet — that keeps the carousel visually full for fresh installs instead
 * of leaving the standby state empty.
 *
 * Refreshed once on mount and on window focus, since history changes
 * happen at the end of a game (when the window may be hidden) and we
 * want the carousel to be up-to-date when the user comes back.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/features/api";
import { useOwnedChampions } from "@/features/championLibrary/useChampionLibrary";

/**
 * Module-level cache of the last "good" enriched result. Survives the
 * Solo page being unmounted (e.g. user clicks Premade then back to Solo)
 * so the carousel doesn't have to re-fetch + re-render from empty on
 * every remount. The hook still kicks off a background refresh on focus
 * so the cache stays fresh across actual game completions.
 */
let lastGoodResult: RecentSkinsResult | null = null;
/**
 * Same idea for the raw history — we seed the renderer state from the
 * last fetch so remounted hooks have data immediately, even before the
 * background refresh resolves.
 */
let cachedRawHistory: Array<{
  championId: number;
  skinId: number;
  chromaId: number;
  timestamp: number;
}> | null = null;

export interface RecentSkinEntry {
  championId: number;
  championAlias: string;
  championName: string;
  skinId: number;
  chromaId: number;
  /** Epoch ms; absent for fallback entries (synthetic placeholders). */
  timestamp: number | null;
}

export interface RecentSkinsResult {
  skins: RecentSkinEntry[];
  loading: boolean;
  /** True when no real history exists and we're showing fallback samples. */
  isFallback: boolean;
}

const DEFAULT_LIMIT = 10;

/**
 * Stable seed-based shuffle so the fallback carousel doesn't reshuffle
 * itself on every render. Uses the champion count as the seed (so it
 * stays stable across renders for the same library).
 */
function pickFallback(
  champions: ReturnType<typeof useOwnedChampions>["champions"],
  limit: number
): RecentSkinEntry[] {
  if (champions.length === 0) return [];
  // Deterministic-ish: take a stride that covers the library so the user
  // sees variety even with a smallish owned pool. Skin id = championId*1000
  // (the base skin is always the champion's "0th" skin = championId*1000).
  const stride = Math.max(1, Math.floor(champions.length / limit));
  const out: RecentSkinEntry[] = [];
  for (let i = 0; i < champions.length && out.length < limit; i += stride) {
    const champ = champions[i];
    out.push({
      championId: champ.id,
      championAlias: champ.alias,
      championName: champ.name,
      skinId: champ.id * 1000,
      chromaId: 0,
      timestamp: null,
    });
  }
  return out;
}

export function useGlobalRecentSkins(
  limit: number = DEFAULT_LIMIT
): RecentSkinsResult {
  // Seed from the module-level cache when available so a Solo remount
  // (after a quick navigation away) gets a populated list immediately,
  // not on the next IPC roundtrip.
  const [rawHistory, setRawHistory] = useState<
    Array<{
      championId: number;
      skinId: number;
      chromaId: number;
      timestamp: number;
    }>
  >(() => cachedRawHistory ?? []);
  const [historyLoading, setHistoryLoading] = useState(
    cachedRawHistory === null
  );
  const { champions, loading: championsLoading } = useOwnedChampions();
  const inflightRef = useRef(false);

  const refresh = useCallback(async () => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    try {
      const result = await api.getGlobalRecentHistory(limit);
      cachedRawHistory = result;
      setRawHistory(result);
    } catch (err) {
      console.warn("[recent-skins] Failed to fetch global history", err);
      // Don't clear the cache on transient failure — stale data beats
      // an empty carousel.
      if (cachedRawHistory === null) setRawHistory([]);
    } finally {
      inflightRef.current = false;
      setHistoryLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Refresh on focus: history changes between games (when the window is
  // hidden during InProgress), so on return we want fresh data.
  useEffect(() => {
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const fresh = useMemo<RecentSkinsResult>(() => {
    const championById = new Map(champions.map((c) => [c.id, c] as const));

    const enriched: RecentSkinEntry[] = [];
    for (const entry of rawHistory) {
      const champ = championById.get(entry.championId);
      if (!champ) continue; // orphan champion (unowned, sold, etc.) — drop it
      enriched.push({
        championId: entry.championId,
        championAlias: champ.alias,
        championName: champ.name,
        skinId: entry.skinId,
        chromaId: entry.chromaId,
        timestamp: entry.timestamp,
      });
    }

    if (enriched.length > 0) {
      return {
        skins: enriched,
        loading: historyLoading || championsLoading,
        isFallback: false,
      };
    }

    // Fresh install or no usable history — fall back to a sample of the
    // user's owned champions so the carousel never looks broken.
    return {
      skins: pickFallback(champions, limit),
      loading: historyLoading || championsLoading,
      isFallback: true,
    };
  }, [rawHistory, champions, historyLoading, championsLoading, limit]);

  // Cache "good" results so the next remount can reuse them. We
  // deliberately don't cache the empty/loading state — that would mask
  // a real "history just got cleared" event.
  useEffect(() => {
    if (fresh.skins.length > 0) {
      lastGoodResult = fresh;
    }
  }, [fresh]);

  // While the merge produces an empty list (champions IPC still in flight,
  // history not yet enriched, …) but we have a known-good cached result,
  // surface that instead of an empty carousel. The fresh value takes over
  // automatically on the next render once it's populated.
  if (fresh.skins.length === 0 && lastGoodResult) {
    return lastGoodResult;
  }
  return fresh;
}
