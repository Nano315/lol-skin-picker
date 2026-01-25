/**
 * History Store - Frontend interface for skin history management
 * Uses IPC to communicate with electron main process for persistence
 */

export interface HistoryEntry {
  skinId: number;
  chromaId: number;
  timestamp: number;
}

export interface HistoryStore {
  [championId: number]: HistoryEntry[];
}

export interface HistorySettings {
  historySize: number;
  historyEnabled: boolean;
}

const lcu = window.lcu;

/**
 * Add a skin/chroma to the history for a champion
 */
export function addToHistory(
  championId: number,
  skinId: number,
  chromaId: number
): Promise<void> {
  return lcu.addToHistory(championId, skinId, chromaId);
}

/**
 * Get recent history entries for a champion
 */
export function getRecentHistory(championId: number): Promise<HistoryEntry[]> {
  return lcu.getRecentHistory(championId);
}

/**
 * Clear all history (or for a specific champion)
 */
export function clearHistory(championId?: number): Promise<void> {
  return lcu.clearHistory(championId);
}

/**
 * Get current history settings
 */
export function getHistorySettings(): Promise<HistorySettings> {
  return lcu.getHistorySettings();
}

/**
 * Update history settings
 */
export function setHistorySettings(settings: Partial<HistorySettings>): Promise<void> {
  return lcu.setHistorySettings(settings);
}
