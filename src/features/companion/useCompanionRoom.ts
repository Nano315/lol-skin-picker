import { companionApi } from "@/features/api";
import { useIpcSnapshot } from "./useIpcSnapshot";

/**
 * Etat de room vu depuis le sidecar.
 *
 * Lecture seule : la source est `CompanionBridgeConnector`, monte dans la
 * fenetre principale. On s'hydrate d'abord sur l'etat cache par le main — le
 * sidecar s'ouvre en cours de draft, souvent bien apres le dernier push de
 * room-state, et attendre le suivant afficherait une equipe vide sans raison.
 */
export function useCompanionRoom(): CompanionRoomState | null {
  return useIpcSnapshot(companionApi.getRoom, companionApi.onRoom, null);
}
