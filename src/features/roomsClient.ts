// src/features/roomsClient.ts
import { io, Socket } from "socket.io-client";
import type { Selection } from "./types";

/* --- TYPES AJOUTÉS POUR LA SYNERGIE --- */
export interface OwnedSkinShort {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
}

export interface SynergyCombination {
  description: string;
  selection: Record<string, { skinId: number; chromaId: number }>;
}

export interface SynergyTier {
  id: string;
  label: string;
  score: number;
  totalCombinations: number;
  combinations: SynergyCombination[];
}

export interface SynergyResult {
  tiers: SynergyTier[];
}

/* -------------------------------------- */

const ROOMS_SERVER_URL = import.meta.env.VITE_ROOMS_SERVER_URL;

if (!ROOMS_SERVER_URL) {
  console.warn(
    "[roomsClient] No ROOMS_SERVER_URL configured, requests will fail."
  );
}

export type RoomMember = {
  id: string;
  name: string;
  championId: number;
  championAlias: string;
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

  // Listener spécifique pour les résultats de synergie (reçu uniquement par l'owner)
  private synergyListeners = new Set<(result: SynergyResult) => void>();
  // Listener pour l'application forcée (reçu par tous)
  private forceApplyListeners = new Set<
    (skinId: number, chromaId: number) => void
  >();

  // ---- helpers de state global ----
  private emitRoom(room: RoomState | null) {
    this.room = room;
    for (const l of this.listeners) l(room);
  }

  subscribe(listener: (room: RoomState | null) => void): () => void {
    this.listeners.add(listener);
    // On envoie l’état actuel dès l’inscription
    listener(this.room);

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

    // -> on met à jour le cache interne + listeners
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

    // -> idem ici
    this.emitRoom(room);

    return { room };
  }

  // ---- Gestion des Listeners Spécifiques ----
  subscribeSynergy(listener: (res: SynergyResult) => void) {
    this.synergyListeners.add(listener);
    return () => {
      this.synergyListeners.delete(listener);
    };
  }

  subscribeForceApply(listener: (s: number, c: number) => void) {
    this.forceApplyListeners.add(listener);
    return () => {
      this.forceApplyListeners.delete(listener);
    };
  }

  // ---- WebSocket ----
  connect() {
    if (!this.roomId || !this.memberId) {
      throw new Error("No roomId/memberId set");
    }
    if (this.socket) {
      // déjà connecté
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

    // Réception des résultats de calcul
    this.socket.on("synergy-results", (result: SynergyResult) => {
      for (const l of this.synergyListeners) l(result);
    });

    // Ordre d'application
    this.socket.on(
      "force-skin-application",
      (selectionMap: Record<string, { skinId: number; chromaId: number }>) => {
        if (!this.memberId) return;
        const mySelection = selectionMap[this.memberId];
        if (mySelection && mySelection.skinId !== 0) {
          for (const l of this.forceApplyListeners) {
            l(mySelection.skinId, mySelection.chromaId);
          }
        }
      }
    );
  }

  sendInventory(skins: OwnedSkinShort[]) {
    if (!this.socket || !this.roomId || !this.memberId) return;
    this.socket.emit("update-inventory", {
      roomId: this.roomId,
      memberId: this.memberId,
      skins,
    });
  }

  // utilisé uniquement pour "quitter la room"
  leaveRoom() {
    if (this.socket && this.roomId && this.memberId) {
      // le serveur ne gère pas encore 'leave-room', mais ce n'est pas grave
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

  // Demander le calcul (Owner seulement)
  requestSynergy() {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("request-synergy", { roomId: this.roomId });
  }

  // Appliquer une synergie
  applySynergy(
    selection: Record<string, { skinId: number; chromaId: number }>
  ) {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("apply-synergy-selection", {
      roomId: this.roomId,
      selection,
    });
  }
}

export const roomsClient = new RoomsClient();
