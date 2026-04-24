/**
 * Priority persistence - Stores skin priorities to disk
 */

import { app } from "electron";
import { join } from "node:path";
import { promises as fs } from "node:fs";
import { isPlainObject, safeParseObject } from "../utils/jsonGuards";

export type Priority = "favorite" | "deprioritized" | null;

function coercePriorityMap(raw: unknown): PriorityMap {
  if (!isPlainObject(raw)) return {};
  const out: PriorityMap = {};
  for (const [key, value] of Object.entries(raw)) {
    const skinId = Number(key);
    if (!Number.isInteger(skinId) || skinId < 0) continue;
    if (value === "favorite" || value === "deprioritized") {
      out[skinId] = value;
    }
  }
  return out;
}

function coercePriorities(
  raw: unknown
): { [championId: number]: PriorityMap } {
  if (!isPlainObject(raw)) return {};
  const out: { [championId: number]: PriorityMap } = {};
  for (const [key, value] of Object.entries(raw)) {
    const championId = Number(key);
    if (!Number.isInteger(championId) || championId < 0) continue;
    out[championId] = coercePriorityMap(value);
  }
  return out;
}

export interface PriorityMap {
  [skinId: number]: Priority;
}

export interface PriorityData {
  // championId -> skinId -> priority
  priorities: { [championId: number]: PriorityMap };
}

const DEFAULTS: PriorityData = {
  priorities: {},
};

const priorityPath = join(app.getPath("userData"), "skin-priorities.json");

let cache: PriorityData | null = null;

export async function loadPriorities(): Promise<PriorityData> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(priorityPath, "utf-8");
    const parsed = safeParseObject(raw);
    cache = {
      priorities: parsed ? coercePriorities(parsed.priorities) : {},
    };
    return cache;
  } catch {
    cache = { ...DEFAULTS };
    return cache;
  }
}

export async function savePriorities(data: PriorityData): Promise<void> {
  cache = data;
  try {
    await fs.writeFile(priorityPath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* ignore write errors */
  }
}

export async function setPriority(
  championId: number,
  skinId: number,
  priority: Priority
): Promise<void> {
  const data = await loadPriorities();

  if (!data.priorities[championId]) {
    data.priorities[championId] = {};
  }

  if (priority === null) {
    delete data.priorities[championId][skinId];
  } else {
    data.priorities[championId][skinId] = priority;
  }

  await savePriorities(data);
}

export async function getPriority(
  championId: number,
  skinId: number
): Promise<Priority> {
  const data = await loadPriorities();
  return data.priorities[championId]?.[skinId] ?? null;
}

export async function getAllPriorities(
  championId: number
): Promise<PriorityMap> {
  const data = await loadPriorities();
  return data.priorities[championId] ?? {};
}

export async function clearPriorities(championId?: number): Promise<void> {
  const data = await loadPriorities();

  if (championId !== undefined) {
    delete data.priorities[championId];
  } else {
    data.priorities = {};
  }

  await savePriorities(data);
}

export async function bulkSetPriority(
  championId: number,
  skinIds: number[],
  priority: Priority
): Promise<void> {
  const data = await loadPriorities();

  if (!data.priorities[championId]) {
    data.priorities[championId] = {};
  }

  for (const skinId of skinIds) {
    if (priority === null) {
      delete data.priorities[championId][skinId];
    } else {
      data.priorities[championId][skinId] = priority;
    }
  }

  await savePriorities(data);
}

/**
 * Get weight for a skin based on priority
 */
export function getWeight(priority: Priority): number {
  if (priority === "favorite") return 3;
  if (priority === "deprioritized") return 0.3;
  return 1;
}
