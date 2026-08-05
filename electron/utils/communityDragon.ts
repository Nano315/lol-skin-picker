import { isArray, isPlainObject } from "./jsonGuards";
import { fetchWithTimeout } from "./fetchWithTimeout";

const aliasMap = new Map<number, string>();

export async function ensureAliasMap() {
  if (aliasMap.size) return;
  const url =
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";

  // Cette fonction est appelee depuis la boucle de poll des champion selects :
  // un appel qui pend fige la boucle entiere. D'ou le plafond de temps.
  const res = await fetchWithTimeout(url);
  // Sans ce controle, une page d'erreur HTML du CDN partait dans `.json()`,
  // qui rejette avec un message de parsing sans rapport avec la cause reelle.
  if (!res.ok) {
    throw new Error(`CommunityDragon a repondu ${res.status}`);
  }
  const payload = (await res.json()) as unknown;

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
