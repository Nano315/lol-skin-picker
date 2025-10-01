import fetch from "node-fetch";

const aliasMap = new Map<number, string>();

export async function ensureAliasMap() {
  if (aliasMap.size) return;
  const url =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";
  const data = (await fetch(url).then((r) => r.json())) as {
    id: number;
    alias: string;
  }[];
  data.forEach((ch) => aliasMap.set(ch.id, ch.alias));
}

export function getChampionAlias(id: number) {
  return aliasMap.get(id) ?? "";
}
