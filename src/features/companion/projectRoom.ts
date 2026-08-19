import type { RoomState } from "@/features/roomsClient";
import { displayName } from "@/features/utils/displayText";

/**
 * Projette la room complete vers la vue reduite consommee par le sidecar.
 *
 * Isole du connector (et de React) pour rester testable : c'est ici que se
 * decident "qui est owner", "qui participe a la synergie" et le denominateur
 * du badge — trois choses qu'on ne veut pas verifier a la main dans une draft.
 *
 * On ne relaie ni `options[]` ni les synergies secondaires : le sidecar
 * n'affiche que l'equipe et la couleur dominante, et `options[]` represente
 * l'essentiel du poids d'un room-state.
 */
export function projectRoomForCompanion(
  room: RoomState | null | undefined,
  selfId: string | null
): CompanionRoomState | null {
  if (!room) return null;

  // Le serveur trie `colors` par nombre de membres decroissant : la premiere
  // entree est la synergie dominante.
  const top = room.synergy?.colors?.[0] ?? null;
  const inSynergy = new Set(top?.members ?? []);

  return {
    inRoom: true,
    isOwner: !!selfId && room.ownerId === selfId,
    members: (room.members ?? []).map((m) => ({
      id: m.id,
      // Borne ici, une fois, plutot qu'a l'affichage : c'est la valeur bornee
      // qui traverse le relais IPC. `truncate` en CSS ne protege pas d'un
      // pseudo demesure envoye par un pair.
      name: displayName(m.name),
      isSelf: m.id === selfId,
      isOwner: m.id === room.ownerId,
      ready: m.isReady === true,
      lockedSkin: m.lockedSkin === true,
      inSynergy: inSynergy.has(m.id),
    })),
    synergyColor: top?.color ?? null,
    synergyCount: top?.members.length ?? 0,
    readyCount: (room.members ?? []).filter((m) => m.isReady).length,
  };
}
