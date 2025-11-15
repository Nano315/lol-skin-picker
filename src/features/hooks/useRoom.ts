import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const ROOMS_URL = "http://localhost:4000";

/* ---------- Types ---------- */

type RoomPlayer = {
  socketId: string;
  name: string;
  championId: number | null;
  currentSelection: {
    skinId: number | null;
    chromaId: number | null;
  };
};

type RoomSummary = {
  id: string;
  ownerId: string;
  players: RoomPlayer[];
};

/* ---------- Socket singleton + cache global ---------- */

let socket: Socket | null = null;

// petit cache global pour garder l’état entre montages de la page
let cachedRoom: RoomSummary | null = null;
let cachedIsInRoom = false;
let cachedIsOwner = false;

function getSocket() {
  if (!socket) {
    socket = io(ROOMS_URL, {
      autoConnect: true,
    });
  }
  return socket;
}

/* ---------- Hook ---------- */

export function useRoom() {
  // on initialise le state React depuis le cache global
  const [room, setRoom] = useState<RoomSummary | null>(() => cachedRoom);
  const [isInRoom, setIsInRoom] = useState<boolean>(() => cachedIsInRoom);
  const [isOwner, setIsOwner] = useState<boolean>(() => cachedIsOwner);

  useEffect(() => {
    const s = getSocket();

    const handleRoomUpdated = (next: RoomSummary) => {
      // on met à jour le cache global
      cachedRoom = next;
      cachedIsInRoom = true;
      cachedIsOwner = next.ownerId === s.id;

      // et le state React
      setRoom(next);
      setIsInRoom(true);
      setIsOwner(next.ownerId === s.id);
    };

    s.on("room-updated", handleRoomUpdated);

    // au montage du hook : on demande au serveur si on est déjà dans une room
    s.emit(
      "get-current-room",
      (res: { ok: boolean; room: RoomSummary | null }) => {
        if (res.ok && res.room) {
          handleRoomUpdated(res.room);
        }
      }
    );

    return () => {
      // très important : on retire juste le listener
      s.off("room-updated", handleRoomUpdated);
      // on NE déconnecte PAS le socket ici
    };
  }, []);

  const createRoom = useCallback(() => {
    const s = getSocket();
    s.emit(
      "create-room",
      { name: "Player" },
      (res: { ok: boolean; room?: RoomSummary; error?: string }) => {
        if (!res.ok || !res.room) {
          console.error("create-room error", res.error);
          return;
        }

        cachedRoom = res.room;
        cachedIsInRoom = true;
        cachedIsOwner = true;

        setRoom(res.room);
        setIsInRoom(true);
        setIsOwner(true);
      }
    );
  }, []);

  const joinRoom = useCallback((code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 4) return;

    const s = getSocket();
    s.emit(
      "join-room",
      { code: trimmed, name: "Player" },
      (res: { ok: boolean; room?: RoomSummary; error?: string }) => {
        if (!res.ok || !res.room) {
          console.error("join-room error", res.error);
          return;
        }

        cachedRoom = res.room;
        cachedIsInRoom = true;
        cachedIsOwner = res.room.ownerId === s.id;

        setRoom(res.room);
        setIsInRoom(true);
        setIsOwner(res.room.ownerId === s.id);
      }
    );
  }, []);

  const leaveRoom = useCallback(() => {
    if (!room) return;
    const s = getSocket();

    s.emit("leave-room", { roomId: room.id });

    cachedRoom = null;
    cachedIsInRoom = false;
    cachedIsOwner = false;

    setRoom(null);
    setIsInRoom(false);
    setIsOwner(false);
  }, [room]);

  const ownerReroll = useCallback(() => {
    if (!room) return;
    const s = getSocket();
    s.emit("owner-reroll", { roomId: room.id });
  }, [room]);

  const seedRoomDev = useCallback(() => {
    if (!room) return;

    console.log("[front] seedRoomDev for room", room.id);
    const s = getSocket();
    s.emit("seed-room", { roomId: room.id });
  }, [room]);

  return {
    room,
    isInRoom,
    isOwner,
    createRoom,
    joinRoom,
    leaveRoom,
    ownerReroll,
    seedRoomDev,
  };
}
