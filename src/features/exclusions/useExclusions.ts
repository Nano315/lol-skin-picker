import { useCallback, useEffect, useState } from "react";
import { api } from "@/features/api";

/**
 * Per-champion exclusion management. The exclusions Set holds skin or chroma
 * IDs the user has marked as excluded from the random pool. Default = empty
 * Set = everything is eligible.
 *
 * Optimistic updates: the UI reflects toggles instantly; on persistence error
 * we resync from disk via `refresh()`.
 */
export function useChampionExclusions(championId: number) {
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!championId) {
      setExcluded(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const ids = await api.getExclusions(championId);
      setExcluded(new Set(ids));
    } finally {
      setLoading(false);
    }
  }, [championId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (id: number) => {
      if (!championId) return;
      const willExclude = !excluded.has(id);
      const next = new Set(excluded);
      if (willExclude) next.add(id);
      else next.delete(id);
      setExcluded(next);
      try {
        await api.setExcluded(championId, id, willExclude);
      } catch {
        void refresh();
      }
    },
    [championId, excluded, refresh]
  );

  const setMany = useCallback(
    async (ids: number[], shouldExclude: boolean) => {
      if (!championId || !ids.length) return;
      const next = new Set(excluded);
      if (shouldExclude) {
        for (const id of ids) next.add(id);
      } else {
        for (const id of ids) next.delete(id);
      }
      setExcluded(next);
      try {
        await api.bulkSetExcluded(championId, ids, shouldExclude);
      } catch {
        void refresh();
      }
    },
    [championId, excluded, refresh]
  );

  const reset = useCallback(async () => {
    if (!championId) return;
    setExcluded(new Set());
    try {
      await api.clearExclusions(championId);
    } catch {
      void refresh();
    }
  }, [championId, refresh]);

  const isExcluded = useCallback((id: number) => excluded.has(id), [excluded]);

  return {
    excluded,
    isExcluded,
    toggle,
    setMany,
    reset,
    refresh,
    loading,
  };
}

/**
 * Snapshot of every champion's exclusions. Useful for the Library champion
 * list to render per-row status pills ("All" / "12/15" / "Locked: X").
 */
export function useAllExclusions() {
  const [all, setAll] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAllExclusions();
      setAll(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { all, loading, refresh };
}
