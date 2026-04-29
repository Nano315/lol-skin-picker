/**
 * Skin/chroma exclusions persistence.
 *
 * Per-champion list of skin or chroma IDs that the user has explicitly
 * excluded from the random pool. Default = empty list = everything included.
 *
 * Replaces the legacy "priorities" 3-state model (favorite/deprioritized).
 * On first load we migrate any pre-existing skin-priorities.json file:
 * "deprioritized" entries become exclusions, "favorite" entries are dropped.
 */

import { app } from "electron";
import { join } from "node:path";
import { promises as fs } from "node:fs";
import { isPlainObject, safeParseObject } from "../utils/jsonGuards";
import { logger } from "../logger";

export interface ExclusionsData {
  exclusions: { [championId: number]: number[] };
  migrated?: boolean;
}

const exclusionsPath = join(app.getPath("userData"), "skin-exclusions.json");
const legacyPriorityPath = join(
  app.getPath("userData"),
  "skin-priorities.json"
);

let cache: ExclusionsData | null = null;

function coerceExclusions(raw: unknown): { [championId: number]: number[] } {
  if (!isPlainObject(raw)) return {};
  const out: { [championId: number]: number[] } = {};
  for (const [key, value] of Object.entries(raw)) {
    const championId = Number(key);
    if (!Number.isInteger(championId) || championId < 0) continue;
    if (!Array.isArray(value)) continue;
    const ids: number[] = [];
    for (const id of value) {
      if (typeof id === "number" && Number.isInteger(id) && id >= 0) {
        ids.push(id);
      }
    }
    out[championId] = Array.from(new Set(ids)).sort((a, b) => a - b);
  }
  return out;
}

async function persist(data: ExclusionsData): Promise<void> {
  cache = data;
  try {
    await fs.writeFile(exclusionsPath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* ignore write errors */
  }
}

async function migrateFromPriorities(target: ExclusionsData): Promise<void> {
  let raw: string;
  try {
    raw = await fs.readFile(legacyPriorityPath, "utf-8");
  } catch {
    target.migrated = true;
    await persist(target);
    return;
  }

  const parsed = safeParseObject(raw);
  const priorities =
    parsed && isPlainObject(parsed.priorities) ? parsed.priorities : null;

  if (priorities) {
    let migratedChampions = 0;
    let migratedSkins = 0;
    for (const [champKey, champVal] of Object.entries(priorities)) {
      const championId = Number(champKey);
      if (!Number.isInteger(championId) || championId < 0) continue;
      if (!isPlainObject(champVal)) continue;

      const excluded: number[] = [];
      for (const [skinKey, priority] of Object.entries(champVal)) {
        const skinId = Number(skinKey);
        if (!Number.isInteger(skinId) || skinId < 0) continue;
        if (priority === "deprioritized") {
          excluded.push(skinId);
          migratedSkins++;
        }
        // "favorite" intentionally dropped — every skin starts included.
      }
      if (excluded.length > 0) {
        target.exclusions[championId] = Array.from(new Set(excluded)).sort(
          (a, b) => a - b
        );
        migratedChampions++;
      }
    }

    logger.info("[Exclusions] Migrated legacy priorities", {
      champions: migratedChampions,
      skins: migratedSkins,
    });
  }

  target.migrated = true;
  await persist(target);

  try {
    await fs.rename(legacyPriorityPath, legacyPriorityPath + ".bak");
  } catch {
    /* old file already moved or deletion failed — non-fatal */
  }
}

export async function loadExclusions(): Promise<ExclusionsData> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(exclusionsPath, "utf-8");
    const parsed = safeParseObject(raw);
    cache = {
      exclusions: parsed ? coerceExclusions(parsed.exclusions) : {},
      migrated: parsed?.migrated === true,
    };
  } catch {
    cache = { exclusions: {}, migrated: false };
  }

  if (!cache.migrated) {
    await migrateFromPriorities(cache);
  }

  return cache;
}

export async function getExclusions(championId: number): Promise<number[]> {
  const data = await loadExclusions();
  return data.exclusions[championId] ?? [];
}

export async function getAllExclusions(): Promise<{
  [championId: number]: number[];
}> {
  const data = await loadExclusions();
  return data.exclusions;
}

export async function setExcluded(
  championId: number,
  id: number,
  excluded: boolean
): Promise<void> {
  const data = await loadExclusions();
  const current = new Set(data.exclusions[championId] ?? []);
  if (excluded) {
    current.add(id);
  } else {
    current.delete(id);
  }
  if (current.size === 0) {
    delete data.exclusions[championId];
  } else {
    data.exclusions[championId] = Array.from(current).sort((a, b) => a - b);
  }
  await persist(data);
}

export async function bulkSetExcluded(
  championId: number,
  ids: number[],
  excluded: boolean
): Promise<void> {
  if (!ids.length) return;
  const data = await loadExclusions();
  const current = new Set(data.exclusions[championId] ?? []);
  if (excluded) {
    for (const id of ids) current.add(id);
  } else {
    for (const id of ids) current.delete(id);
  }
  if (current.size === 0) {
    delete data.exclusions[championId];
  } else {
    data.exclusions[championId] = Array.from(current).sort((a, b) => a - b);
  }
  await persist(data);
}

export async function clearExclusions(championId?: number): Promise<void> {
  const data = await loadExclusions();
  if (championId !== undefined) {
    delete data.exclusions[championId];
  } else {
    data.exclusions = {};
  }
  await persist(data);
}

/**
 * Reset the in-memory cache. Used by tests; not exposed to the renderer.
 */
export function _resetCacheForTests(): void {
  cache = null;
}
