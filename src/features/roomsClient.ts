// src/features/roomsClient.ts
import { io, Socket } from "socket.io-client";
import type { Selection } from "./types";

const ROOMS_SERVER_URL = import.meta.env.VITE_ROOMS_SERVER_URL;

if (!ROOMS_SERVER_URL) {
  console.warn(
    "[roomsClient] No ROOMS_SERVER_URL configured, requests will fail."
  );
}

export type ColorSynergy = {
  type: "sameColor";
  color: string;
  members: string[];
  coverage: number;
  combinationCount: number;
};

export type GroupComboPick = {
  memberId: string;
  skinId: number;
  chromaId: number;
};

export type GroupComboPayload = {
  type: "sameColor";
  color: string;
  picks: GroupComboPick[];
};

export type RoomMember = {
  id: string;
  name: string;
  championId: number;
  championAlias: string;
  skinId: number;
  chromaId: number;
  ready?: boolean;
};

export type RoomState = {
  id: string;
  code: string;
  ownerId: string;
  members: RoomMember[];
  synergy?: {
    colors: ColorSynergy[];
  };
};

/** Toutes les combinaisons skin/chroma possédées sur le champion lock. */
export type GroupSkinOption = {
  skinId: number;
  chromaId: number; // 0 = sans chroma
  auraColor: string | null; // EXACTEMENT la couleur utilisée pour l’aura côté front
};

export type OwnedOptionsPayload = {
  championId: number;
  championAlias: string;
  options: GroupSkinOption[];
};

class RoomsClient {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private memberId: string | null = null;

  private room: RoomState | null = null;
  private listeners = new Set<(room: RoomState | null) => void>();

  private comboListeners = new Set<(payload: GroupComboPayload) => void>();

  // ---- helpers de state global ----
  private emitRoom(room: RoomState | null) {
    this.room = room;
    for (const l of this.listeners) l(room);
  }

  subscribe(listener: (room: RoomState | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.room); // état actuel immédiat
    return () => {
      this.listeners.delete(listener);
    };
  }

  getCurrentRoom() {
    return this.room;
  }

  isJoined() {
    return !!this.roomId && !!this.memberId;
  }

  onGroupCombo(listener: (payload: GroupComboPayload) => void): () => void {
    this.comboListeners.add(listener);
    return () => {
      this.comboListeners.delete(listener);
    };
  }

  // ---- REST : create / join ----
  async createRoom(name: string): Promise<{ room: RoomState }> {
    const res = await fetch(`${ROOMS_SERVER_URL}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.error ?? "Failed to create room";
      throw new Error(msg);
    }

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

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.error ?? "Failed to join room";
      throw new Error(msg);
    }

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
    if (this.socket) return;

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

    this.socket.on("group-apply-combo", (payload: GroupComboPayload) => {
      for (const l of this.comboListeners) l(payload);
    });

    this.socket.on("room-closed", (payload: { reason?: string }) => {
      console.log("[roomsClient] room closed", payload);
      this.roomId = null;
      this.memberId = null;
      this.emitRoom(null);
      // On coupe le socket pour éviter les reconnections inutiles
      this.socket?.disconnect();
      this.socket = null;
    });
  }

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
      championAlias: selection.championAlias,
      skinId: selection.skinId,
      chromaId: selection.chromaId,
    });
  }

  /** Envoi de TOUTES les options skin/chroma pour le champion lock. */
  sendOwnedOptions(payload: OwnedOptionsPayload) {
    if (!this.socket || !this.roomId || !this.memberId) return;
    this.socket.emit("owned-options", {
      roomId: this.roomId,
      memberId: this.memberId,
      championId: payload.championId,
      championAlias: payload.championAlias,
      options: payload.options,
    });
  }

  requestGroupReroll(payload: { type: "sameColor"; color: string }) {
    if (!this.socket || !this.roomId || !this.memberId) return;
    this.socket.emit("request-group-reroll", {
      roomId: this.roomId,
      memberId: this.memberId,
      type: payload.type,
      color: payload.color,
    });
  }
}

export const roomsClient = new RoomsClient();
