/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { OwnedSkin, Selection } from "../types";

type RoomPlayer = {
  socketId: string;
  name: string;
  championId: number | null;
  currentSelection: {
    skinId: number | null;
    chromaId: number | null;
  };
};

type RoomState = {
  id: string;
  ownerId: string;
  players: RoomPlayer[];
};

let socket: Socket | null = null;

export function useRoom() {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [connected, setConnected] = useState(false);

  // à adapter : pseudo de l’utilisateur (pour le MVP on peut hardcode/chopper depuis un input)
  const playerName = "Player";

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:4000");
    }

    const s = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => {
      setConnected(false);
      setRoom(null);
    };

    const onRoomUpdated = (data: RoomState) => {
      setRoom(data);
    };

    const onApplyAssignment = async (payload: {
      roomId: string;
      selectedSkinId: number | null;
      selectedChromaId: number | null;
    }) => {
      if (!payload.selectedSkinId) return;

      // 👉 ici, il faut exposer depuis l'API une méthode
      // pour appliquer un skin/chroma précis côté Electron.
      // Pour l’instant on pourra juste LOGER,
      // puis on branchera sur un IPC "apply-external-skin".
      console.log("[ROOM] apply assignment", payload);

      // TODO : appeler une méthode exposée via window.lcu / IPC
      // ex: api.applyExternalSkin(payload.selectedChromaId ?? payload.selectedSkinId);
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("room-updated", onRoomUpdated);
    s.on("apply-assignment", onApplyAssignment);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("room-updated", onRoomUpdated);
      s.off("apply-assignment", onApplyAssignment);
    };
  }, []);

  const isInRoom = !!room;
  const isOwner = !!room && socket && room.ownerId === socket.id;

  const createRoom = useCallback(
    () =>
      new Promise<RoomState | null>((resolve) => {
        if (!socket) return resolve(null);
        socket.emit("create-room", { name: playerName }, (res: any) => {
          if (res?.ok) {
            setRoom(res.room);
            resolve(res.room);
          } else {
            resolve(null);
          }
        });
      }),
    [playerName]
  );

  const joinRoom = useCallback(
    (code: string) =>
      new Promise<RoomState | null>((resolve) => {
        if (!socket) return resolve(null);
        socket.emit("join-room", { code, name: playerName }, (res: any) => {
          if (res?.ok) {
            setRoom(res.room);
            resolve(res.room);
          } else {
            resolve(null);
          }
        });
      }),
    [playerName]
  );

  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;
    socket.emit("leave-room", { roomId: room.id });
    setRoom(null);
  }, [room]);

  const ownerReroll = useCallback(() => {
    if (!socket || !room || !isOwner) return;
    socket.emit("owner-reroll", { roomId: room.id });
  }, [room, isOwner]);

  // TODO : fonction pour envoyer l'état local au serveur
  const sendState = useCallback(
    async (championId: number, skins: OwnedSkin[], selection: Selection) => {
      if (!socket || !room) return;
      socket.emit("update-state", {
        roomId: room.id,
        championId,
        ownedSkins: skins.map((s) => ({
          skinId: s.id,
          chromaIds: s.chromas.map((c) => c.id),
        })),
        currentSelection: {
          skinId: selection.skinId || null,
          chromaId: selection.chromaId || null,
        },
      });
    },
    [room]
  );

  return {
    connected,
    room,
    isInRoom,
    isOwner,
    createRoom,
    joinRoom,
    leaveRoom,
    ownerReroll,
    sendState,
  };
}
