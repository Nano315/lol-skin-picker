// src/features/hooks/useRooms.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { roomsClient, type RoomState } from "../roomsClient";
import type { Selection } from "../types";

export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(() =>
    roomsClient.getCurrentRoom()
  );
  const [joined, setJoined] = useState<boolean>(() => roomsClient.isJoined());
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

    return unsubscribe; // on se désabonne seulement de l’event, pas du socket
  }, []);

  async function create(name: string) {
    try {
      setError(null);
      await roomsClient.createRoom(name);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  async function join(code: string, name: string) {
    try {
      setError(null);
      await roomsClient.joinRoom(code, name);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  function leave() {
    roomsClient.leaveRoom();
    setJoined(false);
    setRoom(null);
  }

  // à chaque changement de sélection, on notifie la room
  useEffect(() => {
    if (roomsClient.isJoined()) {
      roomsClient.sendSelection(selection);
    }
  }, [selection.championId, selection.skinId, selection.chromaId, selection]);

  return { room, joined, error, create, join, leave };
}
