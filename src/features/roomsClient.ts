// src/features/roomsClient.ts
import { io, Socket } from "socket.io-client";
import type { AppError, Selection, Toast } from "./types";
import { errorMessages } from "./utils/errorMessages";

const ROOMS_SERVER_URL = import.meta.env.VITE_ROOMS_SERVER_URL;
const log = window.log;

if (!ROOMS_SERVER_URL) {
  log.warn("[roomsClient] No ROOMS_SERVER_URL configured, requests will fail.");
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

/** Toutes les combinaisons skin/chroma possedees sur le champion lock. */
export type GroupSkinOption = {
  skinId: number;
  chromaId: number; // 0 = sans chroma
  auraColor: string | null; // EXACTEMENT la couleur utilisee pour l’aura côte front
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
  private isLeaving = false;

  private room: RoomState | null = null;
  private listeners = new Set<(room: RoomState | null) => void>();
  private errorListeners = new Set<(error: AppError) => void>();
  private toastCallback?: (toast: Toast) => void;

  private comboListeners = new Set<(payload: GroupComboPayload) => void>();
  private suggestionListeners = new Set<(payload: { memberId: string; senderName: string; skinId: number; chromaId: number }) => void>();

  // ---- helpers de state global ----
  private emitRoom(room: RoomState | null) {
    this.room = room;
    for (const l of this.listeners) l(room);
  }

  private emitError(error: AppError) {
    for (const l of this.errorListeners) l(error);
    if (this.toastCallback) {
      this.toastCallback({
        type: 'error',
        message: errorMessages[error.code] || error.message,
      });
    }
  }

  subscribe(listener: (room: RoomState | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.room); // etat actuel immediat
    return () => {
      this.listeners.delete(listener);
    };
  }

  onError(listener: (error: AppError) => void): () => void {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  setToastCallback(callback: (toast: Toast) => void) {
    this.toastCallback = callback;
  }

  getCurrentRoom() {
    return this.room;
  }

  getMemberId() {
    return this.memberId;
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

  onColorSuggestionReceived(listener: (payload: { memberId: string; senderName: string; skinId: number; chromaId: number }) => void): () => void {
    this.suggestionListeners.add(listener);
    return () => {
      this.suggestionListeners.delete(listener);
    };
  }

  // ---- REST : create / join ----
  async createRoom(name: string): Promise<{ room: RoomState }> {
    try {
      const res = await fetch(`${ROOMS_SERVER_URL}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const error: AppError = {
          code: data?.code || "INTERNAL_ERROR",
          message: data?.error || "Failed to create room",
        };
        log.error("[roomsClient] Failed to create room", { status: res.status, msg: error.message });
        throw error;
      }

      this.roomId = data.roomId;
      this.memberId = data.memberId;
      const room = data.room as RoomState;
      this.emitRoom(room);
      log.info("[roomsClient] Room created and joined", {
        roomId: this.roomId,
        memberId: this.memberId,
      });
      return { room };
    } catch (err: unknown) {
      const error: AppError = (err && typeof err === 'object' && 'code' in err) 
        ? err as AppError 
        : {
            code: "NETWORK_ERROR",
            message: "Network error while creating room",
          };
      this.emitError(error);
      throw error;
    }
  }

  async joinRoom(code: string, name: string): Promise<{ room: RoomState }> {
    try {
      const res = await fetch(`${ROOMS_SERVER_URL}/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name }),
      });

      const data = await res.json().catch(() => null);
       if (!res.ok) {
        const error: AppError = {
          code: data?.code || "INTERNAL_ERROR",
          message: data?.error || "Failed to join room",
        };
        log.error("[roomsClient] Failed to join room", { status: res.status, msg: error.message });
        throw error;
      }

      this.roomId = data.roomId;
      this.memberId = data.memberId;
      const room = data.room as RoomState;
      this.emitRoom(room);
      log.info("[roomsClient] Joined room", {
        roomId: this.roomId,
        memberId: this.memberId,
      });
      return { room };
    } catch (err: unknown) {
      const error: AppError = (err && typeof err === 'object' && 'code' in err) 
        ? err as AppError 
        : {
            code: "NETWORK_ERROR",
            message: "Network error while joining room",
          };
      this.emitError(error);
      throw error;
    }
  }

  // ---- WebSocket ----
  connect() {
    if (!this.roomId || !this.memberId) {
      throw new Error("No roomId/memberId set");
    }
    if (this.socket) return;

    this.isLeaving = false; // Reset flag on new connection
    this.socket = io(ROOMS_SERVER_URL, { autoConnect: true });

    this.socket.on("connect", () => {
      log.info("[roomsClient] Socket.io connected", {
        socketId: this.socket?.id,
        roomId: this.roomId,
      });
      this.socket?.emit("join-room", {
        roomId: this.roomId,
        memberId: this.memberId,
      });
    });

    this.socket.on("disconnect", (reason) => {
      log.warn("[roomsClient] Socket.io disconnected", { reason });
      if (!this.isLeaving) {
       this.emitError({ code: 'NETWORK_ERROR', message: 'Socket disconnected' });
      }
    });

    this.socket.on("connect_error", (error) => {
      log.error("[roomsClient] Socket.io connection error", error);
      this.emitError({ code: 'NETWORK_ERROR', message: 'Socket connection failed' });
    });

    this.socket.on("error", (error: { code: string; message: string }) => {
      log.error("[roomsClient] Received server error", error);
      const appError: AppError = {
        code: error.code || "INTERNAL_ERROR",
        message: error.message,
      };
      this.emitError(appError);
    });

    this.socket.on("room-state", (room: RoomState) => {
      this.emitRoom(room);
    });

    this.socket.on("group-apply-combo", (payload: GroupComboPayload) => {
      log.info("[roomsClient] Received group combo", payload);
      for (const l of this.comboListeners) l(payload);
    });

    this.socket.on("color-suggestion-received", (payload: { memberId: string; senderName: string; skinId: number; chromaId: number }) => {
      log.info("[roomsClient] Received color suggestion", payload);
      for (const l of this.suggestionListeners) l(payload);
    });

    this.socket.on("room-closed", (payload: { reason?: string }) => {
      log.warn("[roomsClient] room closed", payload);
      this.emitError({ code: 'ROOM_NOT_FOUND', message: 'The room was closed.' });
      this.roomId = null;
      this.memberId = null;
      this.emitRoom(null);
      this.socket?.disconnect();
      this.socket = null;
    });
  }

  leaveRoom() {
    try {
      if (this.socket && this.roomId && this.memberId) {
        this.isLeaving = true;
        this.socket.emit("leave-room", {
          roomId: this.roomId,
          memberId: this.memberId,
        });
        this.socket.disconnect();
      }
    } catch (err) {
      log.error('[roomsClient] Error leaving room', err);
    } finally {
      this.socket = null;
      this.roomId = null;
      this.memberId = null;
      this.emitRoom(null);
      log.info("[roomsClient] Left room", { reason: "manual" });
    }
  }

  sendSelection(selection: Selection) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("update-selection", {
        roomId: this.roomId,
        memberId: this.memberId,
        championId: selection.championId,
        championAlias: selection.championAlias,
        skinId: selection.skinId,
        chromaId: selection.chromaId,
      });
    } catch (err) {
      log.error('[roomsClient] Error sending selection', err);
    }
  }

  /** Envoi de TOUTES les options skin/chroma pour le champion lock. */
  sendOwnedOptions(payload: OwnedOptionsPayload) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("owned-options", {
        roomId: this.roomId,
        memberId: this.memberId,
        championId: payload.championId,
        championAlias: payload.championAlias,
        options: payload.options,
      });
    } catch (err) {
      log.error('[roomsClient] Error sending owned options', err);
    }
  }

  requestGroupReroll(payload: { type: "sameColor"; color: string }) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("request-group-reroll", {
        roomId: this.roomId,
        memberId: this.memberId,
        type: payload.type,
        color: payload.color,
      });
    } catch (err) {
      log.error('[roomsClient] Error requesting group reroll', err);
    }
  }

  suggestColor(skinId: number, chromaId: number) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("suggest-color", {
        roomId: this.roomId,
        memberId: this.memberId,
        skinId,
        chromaId,
      });
    } catch (err) {
      log.error('[roomsClient] Error suggesting color', err);
    }
  }
}

export const roomsClient = new RoomsClient();
