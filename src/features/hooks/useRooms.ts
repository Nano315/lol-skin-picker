/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/hooks/useRooms.ts
import { useEffect, useState } from "react";
import { roomsClient, type RoomState } from "../roomsClient";
import type { Selection } from "../types";

export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(name: string) {
    try {
      const { room } = await roomsClient.createRoom(name);
      setRoom(room);
      setJoined(true);
      roomsClient.connect(setRoom);
      // on envoie tout de suite la sélection courante si dispo
      roomsClient.sendSelection(selection);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function join(code: string, name: string) {
    try {
      const { room } = await roomsClient.joinRoom(code, name);
      setRoom(room);
      setJoined(true);
      roomsClient.connect(setRoom);
      roomsClient.sendSelection(selection);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  // à chaque changement de sélection, on notifie la room
  useEffect(() => {
    if (joined) {
      roomsClient.sendSelection(selection);
    }
  }, [joined, selection.championId, selection.skinId, selection.chromaId, selection]);

  useEffect(
    () => () => {
      roomsClient.disconnect();
    },
    []
  );

  return { room, joined, error, create, join };
}
