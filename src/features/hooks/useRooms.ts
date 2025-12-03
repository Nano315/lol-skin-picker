import { useEffect, useState } from "react";
import { roomsClient, type RoomState } from "../roomsClient";
import { api } from "../api";
import type { Selection } from "../types";

// On retire ownedSkins des arguments pour casser la boucle
export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abonnement aux mises à jour de la room
  useEffect(() => {
    // Fonction de callback pour mettre à jour l'état local
    const onRoomUpdate = (nextRoom: RoomState | null) => {
      setRoom(nextRoom);
      setJoined(roomsClient.isJoined());
    };

    // On s'abonne
    const unsubscribe = roomsClient.subscribe(onRoomUpdate);

    // Si le client est déjà connecté (cas du Hot Reload ou navigation), on reconnecte le socket
    if (roomsClient.isJoined()) {
      roomsClient.connect();
    }

    return unsubscribe;
  }, []);

  // Gestion des Combos (Réception de l'ordre du serveur)
  useEffect(() => {
    const unsubCombo = roomsClient.onGroupCombo(async (payload) => {
      if (payload.type === "sameColor") {
        const myPick = payload.picks.find(
          (p) => p.memberId === roomsClient.getMemberId()
        );

        if (myPick) {
          // Si un chroma est défini, on le prend, sinon le skin de base
          const idToApply =
            myPick.chromaId && myPick.chromaId > 0
              ? myPick.chromaId
              : myPick.skinId;

          try {
            await api.applySkinId(idToApply);
            console.log(`[Sync] Applied skin/chroma ID: ${idToApply}`);
          } catch (err) {
            console.error("[Sync] Failed to apply skin", err);
          }
        }
      }
    });

    return () => unsubCombo();
  }, []);

  // Actions
  async function create(name: string) {
    try {
      await roomsClient.createRoom(name);

      // L'état sera mis à jour via le subscribe ci-dessus
      roomsClient.connect();
      roomsClient.sendSelection(selection);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function join(code: string, name: string) {
    try {
      await roomsClient.joinRoom(code, name);

      roomsClient.connect();
      roomsClient.sendSelection(selection);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  function leave() {
    roomsClient.leaveRoom();
    setJoined(false);
    setRoom(null);
  }

  // Synchronisation de la sélection (Champion/Skin actuel)
  useEffect(() => {
    if (joined) {
      roomsClient.sendSelection(selection);
    }
  }, [
    joined,
    selection.championId,
    selection.skinId,
    selection.chromaId,
    selection.championAlias,
  ]);

  return { room, joined, error, create, join, leave };
}