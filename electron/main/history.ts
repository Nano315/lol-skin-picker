/**
 * History persistence - Stores skin history to disk
 * Uses JSON file similar to settings.ts for simplicity
 */

import { app } from "electron";
import { join } from "node:path";
import { promises as fs } from "node:fs";

export interface HistoryEntry {
  skinId: number;
  chromaId: number;
  timestamp: number;
}

export interface HistoryData {
  settings: {
    historySize: number;
    historyEnabled: boolean;
  };
  skinHistory: { [championId: number]: HistoryEntry[] };
  chromaHistory: { [skinId: number]: number[] };
}

const DEFAULTS: HistoryData = {
  settings: {
    historySize: 5,
    historyEnabled: true,
  },
  skinHistory: {},
  chromaHistory: {},
};

const historyPath = join(app.getPath("userData"), "skin-history.json");

let cache: HistoryData | null = null;

export async function loadHistory(): Promise<HistoryData> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(historyPath, "utf-8");
    const data = JSON.parse(raw) as Partial<HistoryData>;
    cache = {
      settings: { ...DEFAULTS.settings, ...data.settings },
      skinHistory: data.skinHistory ?? {},
      chromaHistory: data.chromaHistory ?? {},
    };
    return cache;
  } catch {
    cache = { ...DEFAULTS };
    return cache;
  }
}

export async function saveHistory(data: HistoryData): Promise<void> {
  cache = data;
  try {
    await fs.writeFile(historyPath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* ignore write errors */
  }
}

export async function getHistorySettings() {
  const data = await loadHistory();
  return data.settings;
}

export async function setHistorySettings(
  settings: Partial<HistoryData["settings"]>
) {
  const data = await loadHistory();
  data.settings = { ...data.settings, ...settings };
  await saveHistory(data);
}

export async function addSkinToHistory(
  championId: number,
  entry: HistoryEntry,
  maxSize: number
) {
  const data = await loadHistory();
  if (!data.skinHistory[championId]) {
    data.skinHistory[championId] = [];
  }

  data.skinHistory[championId].push(entry);

  // Keep a reasonable buffer (4x maxSize for LRU weighting)
  const hardLimit = maxSize * 4;
  if (data.skinHistory[championId].length > hardLimit) {
    data.skinHistory[championId] = data.skinHistory[championId].slice(
      -hardLimit
    );
  }

  await saveHistory(data);
}

export async function addChromaToHistory(
  skinId: number,
  chromaId: number,
  maxSize: number
) {
  const data = await loadHistory();
  if (!data.chromaHistory[skinId]) {
    data.chromaHistory[skinId] = [];
  }

  data.chromaHistory[skinId].push(chromaId);

  const hardLimit = maxSize * 4;
  if (data.chromaHistory[skinId].length > hardLimit) {
    data.chromaHistory[skinId] = data.chromaHistory[skinId].slice(-hardLimit);
  }

  await saveHistory(data);
}

export async function getSkinHistory(championId: number): Promise<number[]> {
  const data = await loadHistory();
  return (data.skinHistory[championId] ?? []).map((e) => e.skinId);
}

export async function getChromaHistory(skinId: number): Promise<number[]> {
  const data = await loadHistory();
  return data.chromaHistory[skinId] ?? [];
}

export async function getRecentHistory(
  championId: number
): Promise<HistoryEntry[]> {
  const data = await loadHistory();
  return data.skinHistory[championId] ?? [];
}

export async function clearHistory(championId?: number): Promise<void> {
  const data = await loadHistory();
  if (championId !== undefined) {
    delete data.skinHistory[championId];
  } else {
    data.skinHistory = {};
    data.chromaHistory = {};
  }
  await saveHistory(data);
}
