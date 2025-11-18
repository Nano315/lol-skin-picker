// src/features/roomsClient.ts
import { io, Socket } from "socket.io-client";
import type { Selection } from "./types";

const ROOMS_SERVER_URL = "http://localhost:4000"; // à adapter en prod

export type RoomMember = {
  id: string;
  name: string;
  championId: number;
  skinId: number;
  chromaId: number;
};

export type RoomState = {
  id: string;
  code: string;
  ownerId: string;
  members: RoomMember[];
};

class RoomsClient {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private memberId: string | null = null;

  private room: RoomState | null = null;
  private listeners = new Set<(room: RoomState | null) => void>();

  // ---- helpers de state global ----
  private emitRoom(room: RoomState | null) {
    this.room = room;
    for (const l of this.listeners) l(room);
  }

  subscribe(listener: (room: RoomState | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.room);

    return () => {
      this.listeners.delete(listener); // on ignore le booléen
    };
  }

  getCurrentRoom() {
    return this.room;
  }

  isJoined() {
    return !!this.roomId && !!this.memberId;
  }

  // ---- REST : create / join ----
  async createRoom(name: string): Promise<{ room: RoomState }> {
    const res = await fetch(`${ROOMS_SERVER_URL}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create room");
    const data = await res.json();

    this.roomId = data.roomId;
    this.memberId = data.memberId;
    const room = data.room as RoomState;
    this.emitRoom(room);

    return { room };
  }

  async joinRoom(code: string, name: string): Promise<{ room: RoomState }> {
    const res = await fetch(`${ROOMS_SERVER_URL}/rooms/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name }),
    });
    if (!res.ok) throw new Error("Failed to join room");
    const data = await res.json();

    this.roomId = data.roomId;
    this.memberId = data.memberId;
    const room = data.room as RoomState;
    this.emitRoom(room);

    return { room };
  }

  // ---- WebSocket ----
  connect() {
    if (!this.roomId || !this.memberId) {
      throw new Error("No roomId/memberId set");
    }
    if (this.socket) {
      // déjà connecté : on laisse comme ça
      return;
    }

    this.socket = io(ROOMS_SERVER_URL, { autoConnect: true });

    this.socket.on("connect", () => {
      this.socket?.emit("join-room", {
        roomId: this.roomId,
        memberId: this.memberId,
      });
    });

    this.socket.on("room-state", (room: RoomState) => {
      this.emitRoom(room);
    });
  }

  // utilisé uniquement pour "quitter la room"
  leaveRoom() {
    if (this.socket && this.roomId && this.memberId) {
      this.socket.emit("leave-room", {
        roomId: this.roomId,
        memberId: this.memberId,
      });
      this.socket.disconnect();
    }
    this.socket = null;
    this.roomId = null;
    this.memberId = null;
    this.emitRoom(null);
  }

  sendSelection(selection: Selection) {
    if (!this.socket || !this.roomId || !this.memberId) return;
    this.socket.emit("update-selection", {
      roomId: this.roomId,
      memberId: this.memberId,
      championId: selection.championId,
      skinId: selection.skinId,
      chromaId: selection.chromaId,
    });
  }
}

export const roomsClient = new RoomsClient();
