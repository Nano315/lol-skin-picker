/**
 * Priority Store - Frontend interface for skin priority management
 * Uses IPC to communicate with electron main process for persistence
 */

export type Priority = "favorite" | "deprioritized" | null;

export interface PriorityMap {
  [skinId: number]: Priority;
}

export interface ChampionPriorities {
  [championId: number]: PriorityMap;
}

const lcu = window.lcu;

/**
 * Set priority for a skin
 */
export function setPriority(
  championId: number,
  skinId: number,
  priority: Priority
): Promise<void> {
  return lcu.setPriority(championId, skinId, priority);
}

/**
 * Get priority for a skin
 */
export function getPriority(
  championId: number,
  skinId: number
): Promise<Priority> {
  return lcu.getPriority(championId, skinId);
}

/**
 * Get all priorities for a champion
 */
export function getAllPriorities(championId: number): Promise<PriorityMap> {
  return lcu.getAllPriorities(championId);
}

/**
 * Clear all priorities for a champion (or all)
 */
export function clearPriorities(championId?: number): Promise<void> {
  return lcu.clearPriorities(championId);
}

/**
 * Set all skins to favorite for a champion
 */
export function favoriteAll(
  championId: number,
  skinIds: number[]
): Promise<void> {
  return lcu.bulkSetPriority(championId, skinIds, "favorite");
}

/**
 * Reset all priorities for a champion
 */
export function resetAllPriorities(championId: number): Promise<void> {
  return lcu.clearPriorities(championId);
}
