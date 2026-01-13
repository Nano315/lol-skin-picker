import type { RoomMember } from "../roomsClient";

/**
 * Normalizes a summoner name for comparison (lowercase, trimmed).
 * Returns null if input is null/undefined/empty.
 */
export function normalizeSummonerName(name: string | null | undefined): string | null {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();
  return normalized.length > 0 ? normalized : null;
}

/**
 * Finds a member in a list by summoner name (case-insensitive, trimmed).
 */
export function findMemberBySummonerName(
  members: RoomMember[],
  summonerName: string | null | undefined
): RoomMember | undefined {
  const normalized = normalizeSummonerName(summonerName);
  if (!normalized) return undefined;
  return members.find((m) => normalizeSummonerName(m.name) === normalized);
}
