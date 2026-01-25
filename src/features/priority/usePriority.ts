/**
 * usePriority - React hook for skin priority management
 */

import { useState, useEffect, useCallback } from "react";
import {
  getPriority,
  setPriority,
  getAllPriorities,
  clearPriorities,
  type Priority,
  type PriorityMap,
} from "./priorityStore";
import { api } from "../api";

/**
 * Hook for managing a single skin's priority
 */
export function useSkinPriority(championId: number, skinId: number) {
  const [priority, setPriorityState] = useState<Priority>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!championId || !skinId) {
      setPriorityState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getPriority(championId, skinId)
      .then(setPriorityState)
      .finally(() => setLoading(false));
  }, [championId, skinId]);

  const toggleFavorite = useCallback(async () => {
    const newPriority: Priority = priority === "favorite" ? null : "favorite";
    setPriorityState(newPriority);
    await setPriority(championId, skinId, newPriority);
  }, [championId, skinId, priority]);

  const toggleDeprioritized = useCallback(async () => {
    const newPriority: Priority =
      priority === "deprioritized" ? null : "deprioritized";
    setPriorityState(newPriority);
    await setPriority(championId, skinId, newPriority);
  }, [championId, skinId, priority]);

  const resetPriority = useCallback(async () => {
    setPriorityState(null);
    await setPriority(championId, skinId, null);
  }, [championId, skinId]);

  return {
    priority,
    loading,
    isFavorite: priority === "favorite",
    isDeprioritized: priority === "deprioritized",
    toggleFavorite,
    toggleDeprioritized,
    resetPriority,
  };
}

/**
 * Hook for managing all priorities for a champion
 */
export function useChampionPriorities(championId: number) {
  const [priorities, setPrioritiesState] = useState<PriorityMap>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!championId) {
      setPrioritiesState({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await getAllPriorities(championId);
    setPrioritiesState(data);
    setLoading(false);
  }, [championId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setSkinPriority = useCallback(
    async (skinId: number, priority: Priority) => {
      setPrioritiesState((prev) => ({ ...prev, [skinId]: priority }));
      await setPriority(championId, skinId, priority);
    },
    [championId]
  );

  const favoriteAll = useCallback(
    async (skinIds: number[]) => {
      const newPriorities: PriorityMap = {};
      skinIds.forEach((id) => {
        newPriorities[id] = "favorite";
      });
      setPrioritiesState((prev) => ({ ...prev, ...newPriorities }));
      await api.bulkSetPriority(championId, skinIds, "favorite");
    },
    [championId]
  );

  const resetAll = useCallback(async () => {
    setPrioritiesState({});
    await clearPriorities(championId);
  }, [championId]);

  return {
    priorities,
    loading,
    refresh,
    setSkinPriority,
    favoriteAll,
    resetAll,
    getPriority: (skinId: number) => priorities[skinId] ?? null,
  };
}
