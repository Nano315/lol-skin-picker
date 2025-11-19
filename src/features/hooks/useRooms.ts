// src/features/hooks/useRooms.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { roomsClient, type RoomState } from "../roomsClient";
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

    // si on était déjà dans une room (reload / retour sur la page)
    if (roomsClient.isJoined()) {
      roomsClient.connect();
    }

    return unsubscribe; // on se désabonne seulement de l’event
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

  // à chaque changement de sélection OU changement de joined,
  // on notifie la room si on est dedans
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
    selection,
  ]);

  return { room, joined, error, create, join, leave };
}
