import { useEffect, useRef } from "react";
import { companionApi } from "@/features/api";
import { roomsClient } from "@/features/roomsClient";
import { projectRoomForCompanion } from "@/features/companion/projectRoom";

/**
 * Pont premade entre la fenetre principale et le sidecar de draft.
 *
 * A monter UNIQUEMENT dans la fenetre principale : c'est elle qui detient les
 * sockets Socket.IO et le `memberToken`. Le sidecar ne parle jamais au serveur
 * de rooms — il lit l'etat publie ici et renvoie des intentions, que ce
 * connector traduit en appels `roomsClient`.
 *
 * Deux sens :
 *   room-state -> projection compacte -> IPC -> sidecar
 *   intention  <- IPC <- sidecar, resolue ici avec l'etat le plus frais
 */
export function CompanionBridgeConnector() {
  /**
   * Derniere charge utile publiee, serialisee. `roomsClient.subscribe` se
   * declenche a chaque push de room-state, y compris pour des changements que
   * le sidecar n'affiche pas (options d'un membre, coverage...) : sans cette
   * comparaison on enverrait un IPC par recalcul de synergie pour un rendu
   * strictement identique.
   */
  const lastPublishedRef = useRef<string | null>(null);

  useEffect(() => {
    const publish = () => {
      const payload = projectRoomForCompanion(
        roomsClient.getCurrentRoom(),
        roomsClient.getMemberId()
      );
      const serialized = JSON.stringify(payload);
      if (serialized === lastPublishedRef.current) return;
      lastPublishedRef.current = serialized;
      void companionApi.publishRoom(payload).catch(() => {});
    };

    // subscribe() rejoue immediatement l'etat courant : la premiere publication
    // part sans attendre un changement.
    const unsubRoom = roomsClient.subscribe(publish);

    const unsubAction = companionApi.onAction((action) => {
      if (action?.type !== "matchTeam") return;

      // La couleur est resolue ICI, avec la room courante — pas celle que le
      // sidecar avait sous les yeux au moment du clic.
      const room = roomsClient.getCurrentRoom();
      const top = room?.synergy?.colors?.[0];
      if (!top) return;

      roomsClient.requestGroupReroll({ type: "sameColor", color: top.color });
    });

    return () => {
      unsubRoom();
      unsubAction();
      // Le sidecar peut survivre au demontage (hot reload en dev, fermeture de
      // la fenetre principale) : on le remet a un etat neutre plutot que de le
      // laisser sur une room fantome.
      lastPublishedRef.current = null;
      void companionApi.publishRoom(null).catch(() => {});
    };
  }, []);

  return null;
}
