import fetch from "node-fetch";
import { isArray, isPlainObject } from "./jsonGuards";

const aliasMap = new Map<number, string>();

export async function ensureAliasMap() {
  if (aliasMap.size) return;
  const url =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";
  const payload = (await fetch(url).then((r) => r.json())) as unknown;
  if (!isArray(payload)) return;
  for (const entry of payload) {
    if (
      isPlainObject(entry) &&
      typeof entry.id === "number" &&
      typeof entry.alias === "string"
    ) {
      aliasMap.set(entry.id, entry.alias);
    }
  }
}

export function getChampionAlias(id: number) {
  return aliasMap.get(id) ?? "";
}
