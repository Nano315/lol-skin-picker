// src/features/hooks/useRooms.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { roomsClient, type RoomState } from "../roomsClient";
import { api } from "../api"; // <-- On importe l'api correctement
import type { Selection } from "../types";

export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // s’abonner aux updates globales du client
  useEffect(() => {
    const unsubscribe = roomsClient.subscribe((nextRoom) => {
      setRoom(nextRoom);
      setJoined(roomsClient.isJoined());
    });

    if (roomsClient.isJoined()) {
      roomsClient.connect();
    }

    return unsubscribe;
  }, []);

  // Gestion des combos (Sync Chroma)
  useEffect(() => {
    const unsubCombo = roomsClient.onGroupCombo(async (payload) => {
      if (payload.type === "sameColor") {
        // 1. On utilise la nouvelle méthode getMemberId()
        const myPick = payload.picks.find(
          (p) => p.memberId === roomsClient.getMemberId()
        );

        if (myPick) {
          // 2. Logique importante : Si un chroma est défini (> 0), c'est lui qu'on applique.
          // Sinon, on applique le skin de base.
          // Dans le LCU, sélectionner un chroma revient à "applySkinId(chromaId)".
          const idToApply =
            myPick.chromaId && myPick.chromaId > 0
              ? myPick.chromaId
              : myPick.skinId;

          // On utilise la méthode correcte définie dans api.ts
          try {
            await api.applySkinId(idToApply);
            console.log(`[Sync] Applied skin/chroma ID: ${idToApply}`);
          } catch (err) {
            console.error("[Sync] Failed to apply skin", err);
          }
        }
      }
    });

    return () => {
      unsubCombo();
    };
  }, []);

  async function create(name: string) {
    try {
      const { room } = await roomsClient.createRoom(name);
      setRoom(room);
      setJoined(true);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function join(code: string, name: string) {
    try {
      const { room } = await roomsClient.joinRoom(code, name);
      setRoom(room);
      setJoined(true);
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

  // Notifier la room des changements locaux
  useEffect(() => {
    if (joined) {
      roomsClient.sendSelection(selection);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    joined,
    selection.championId,
    selection.skinId,
    selection.chromaId,
    selection.championAlias,
  ]);

  return { room, joined, error, create, join, leave };
}
