import { useCallback, useEffect, useState } from "react";

const lcu = window.lcu;

export interface OwnedChampion {
  id: number;
  alias: string;
  name: string;
  mastery: number;
  skinCount: number;
}

export interface OwnedSkin {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
  championId: number;
}

/**
 * Owned champions list with mastery points. Backed by a server-side cache
 * (5 min TTL); call `refresh()` to bypass and force a fresh LCU fetch.
 */
export function useOwnedChampions() {
  const [champions, setChampions] = useState<OwnedChampion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChampions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await lcu.getOwnedChampions();
      setChampions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await lcu.invalidateChampionLibrary();
    await fetchChampions();
  }, [fetchChampions]);

  useEffect(() => {
    void fetchChampions();
  }, [fetchChampions]);

  return { champions, loading, refresh };
}

/**
 * Owned skins (with their owned chromas) for a given champion. Lazy fetch:
 * pass `null` to skip. Backed by the same TTL cache as `useOwnedChampions`.
 */
export function useChampionSkins(championId: number | null) {
  const [skins, setSkins] = useState<OwnedSkin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!championId) {
      setSkins([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    lcu
      .getChampionSkins(championId)
      .then((data) => {
        if (!cancelled) setSkins(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [championId]);

  return { skins, loading };
}
