/**
 * History persistence - Stores skin history to disk
 * Uses JSON file similar to settings.ts for simplicity
 */

import { app } from "electron";
import { join } from "node:path";
import { promises as fs } from "node:fs";
import { isPlainObject, isArray, safeParseObject } from "../utils/jsonGuards";

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

function coerceHistorySettings(raw: unknown): HistoryData["settings"] {
  const out = { ...DEFAULTS.settings };
  if (!isPlainObject(raw)) return out;
  if (
    typeof raw.historySize === "number" &&
    Number.isInteger(raw.historySize) &&
    raw.historySize >= 0 &&
    raw.historySize <= 10000
  ) {
    out.historySize = raw.historySize;
  }
  if (typeof raw.historyEnabled === "boolean") {
    out.historyEnabled = raw.historyEnabled;
  }
  return out;
}

function coerceSkinHistory(
  raw: unknown
): { [championId: number]: HistoryEntry[] } {
  if (!isPlainObject(raw)) return {};
  const out: { [championId: number]: HistoryEntry[] } = {};
  for (const [key, value] of Object.entries(raw)) {
    const championId = Number(key);
    if (!Number.isInteger(championId) || championId < 0) continue;
    if (!isArray(value)) continue;
    const entries: HistoryEntry[] = [];
    for (const entry of value) {
      if (
        isPlainObject(entry) &&
        typeof entry.skinId === "number" &&
        Number.isInteger(entry.skinId) &&
        typeof entry.chromaId === "number" &&
        Number.isInteger(entry.chromaId) &&
        typeof entry.timestamp === "number" &&
        Number.isFinite(entry.timestamp)
      ) {
        entries.push({
          skinId: entry.skinId,
          chromaId: entry.chromaId,
          timestamp: entry.timestamp,
        });
      }
    }
    out[championId] = entries;
  }
  return out;
}

function coerceChromaHistory(raw: unknown): { [skinId: number]: number[] } {
  if (!isPlainObject(raw)) return {};
  const out: { [skinId: number]: number[] } = {};
  for (const [key, value] of Object.entries(raw)) {
    const skinId = Number(key);
    if (!Number.isInteger(skinId) || skinId < 0) continue;
    if (!isArray(value)) continue;
    out[skinId] = value.filter(
      (v): v is number => typeof v === "number" && Number.isInteger(v)
    );
  }
  return out;
}

export async function loadHistory(): Promise<HistoryData> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(historyPath, "utf-8");
    const parsed = safeParseObject(raw);
    if (!parsed) {
      cache = { ...DEFAULTS };
      return cache;
    }
    cache = {
      settings: coerceHistorySettings(parsed.settings),
      skinHistory: coerceSkinHistory(parsed.skinHistory),
      chromaHistory: coerceChromaHistory(parsed.chromaHistory),
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
