// src/features/roomsClient.ts
import { io, Socket } from "socket.io-client";
import type {
  AppError,
  Selection,
  Toast,
  IdentityConfirmedPayload,
  FriendOnlinePayload,
  FriendOfflinePayload,
  RoomInviteReceivedPayload,
  InviteSentPayload,
  InviteFailedPayload,
  InviteFailureReason,
} from "./types";
import { errorMessages } from "./utils/errorMessages";
import { trackRoomCreate, trackRoomJoin, trackGroupReroll } from "./analytics/tracker";
import { presenceStore } from "./presence/presenceStore";

const ROOMS_SERVER_URL = import.meta.env.VITE_ROOMS_SERVER_URL;
const log = window.log;

// Socket.io Event Versioning
const CLIENT_VERSION = 2;

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

// Story 6.2: Skin line synergy type
export type SkinLineSynergy = {
  type: "skinLine";
  skinLineId: number;
  skinLineName: string;
  members: string[];
  coverage: number;
  combinationCount: number;
};

// Story 6.2: Sync mode
export type SyncMode = "chromas" | "skins" | "both";

export type GroupComboPick = {
  memberId: string;
  skinId: number;
  chromaId: number;
};

export type GroupComboPayload = {
  version?: number; // v2+ includes version
  type: "sameColor" | "skinLine";
  color?: string;
  skinLineId?: number;
  skinLineName?: string;
  picks: GroupComboPick[];
  sourceMemberId?: string;
};

export type RoomMember = {
  id: string;
  name: string;
  championId: number;
  championAlias: string;
  skinId: number;
  chromaId: number;
  isReady?: boolean;
};

export type RoomState = {
  version?: number; // v2+ includes version
  id: string;
  code: string;
  ownerId: string;
  members: RoomMember[];
  synergy?: {
    colors: ColorSynergy[];
    skinLines: SkinLineSynergy[]; // Story 6.2
  };
  syncMode?: SyncMode; // Story 6.2: defaults to "both"
};

/** Toutes les combinaisons skin/chroma possedees sur le champion lock. */
export type GroupSkinOption = {
  skinId: number;
  chromaId: number; // 0 = sans chroma
  auraColor: string | null; // EXACTEMENT la couleur utilisee pour l'aura côte front
  skinLineId?: number; // Story 6.1: skin line ID for synergy matching
  skinLineName?: string; // Story 6.1: skin line name for display
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
  // Normalized suggestion payload (handles both v1 senderName and v2 memberName)
  private suggestionListeners = new Set<(payload: { memberId: string; senderName: string; skinId: number; chromaId: number }) => void>();

  // --- Identity/Presence System (Story 4.3, 4.8) ---
  private identitySocket: Socket | null = null;
  private identifiedPuuid: string | null = null;
  // Stored LCU identity for re-identification on reconnect (Story 4.8)
  private storedIdentity: {
    puuid: string;
    summonerName: string;
    friends: string[];
  } | null = null;
  private identityCallbacks: {
    onIdentityConfirmed?: (onlineFriends: string[]) => void;
    onFriendOnline?: (puuid: string, summonerName: string) => void;
    onFriendOffline?: (puuid: string) => void;
  } = {};

  // --- Room Invitation System (Story 4.5) ---
  private inviteCallbacks: {
    onInviteSent?: (targetPuuid: string) => void;
    onInviteFailed?: (reason: InviteFailureReason) => void;
    onInviteReceived?: (fromPuuid: string, fromName: string, roomCode: string) => void;
  } = {};

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
      trackRoomCreate();
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
      trackRoomJoin();
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
    this.socket = io(ROOMS_SERVER_URL, {
      autoConnect: true,
      query: {
        clientVersion: String(CLIENT_VERSION),
      },
    });

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
      trackGroupReroll();
      for (const l of this.comboListeners) l(payload);
    });

    this.socket.on("color-suggestion-received", (rawPayload: { version?: number; memberId: string; senderName?: string; memberName?: string; skinId: number; chromaId: number }) => {
      // Normalize payload: v2 uses memberName, v1 uses senderName
      const payload = {
        memberId: rawPayload.memberId,
        senderName: rawPayload.memberName ?? rawPayload.senderName ?? "Unknown",
        skinId: rawPayload.skinId,
        chromaId: rawPayload.chromaId,
      };
      log.info("[roomsClient] Received color suggestion", { ...payload, version: rawPayload.version });
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

  setSyncMode(mode: SyncMode) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("set-sync-mode", {
        roomId: this.roomId,
        memberId: this.memberId,
        mode,
      });
    } catch (err) {
      log.error('[roomsClient] Error setting sync mode', err);
    }
  }

  applyCustomCombo(picks: Array<{ memberId: string; skinId: number; chromaId: number }>) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("apply-custom-combo", {
        roomId: this.roomId,
        memberId: this.memberId,
        picks,
      });
    } catch (err) {
      log.error('[roomsClient] Error applying custom combo', err);
    }
  }

  applySkinLineSynergy(skinLineId: number) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("apply-skin-line-synergy", {
        roomId: this.roomId,
        memberId: this.memberId,
        skinLineId,
      });
    } catch (err) {
      log.error('[roomsClient] Error applying skin line synergy', err);
    }
  }

  requestGroupReroll(payload: { type: "sameColor"; color: string; sourceMemberId?: string }) {
    try {
      if (!this.socket || !this.roomId || !this.memberId) return;
      this.socket.emit("request-group-reroll", {
        roomId: this.roomId,
        memberId: this.memberId,
        type: payload.type,
        color: payload.color,
        sourceMemberId: payload.sourceMemberId,
      });
    } catch (err) {
      log.error('[roomsClient] Error requesting group reroll', err);
    }
  }

  /**
   * Suggests a color to the room owner.
   * Returns a promise that resolves on success or rejects on failure.
   */
  async suggestColor(skinId: number, chromaId: number): Promise<{ success: boolean; error?: string }> {
    // Validate preconditions
    if (!this.socket) {
      log.warn('[roomsClient] suggestColor failed: socket not connected');
      return { success: false, error: 'Socket not connected' };
    }
    if (!this.roomId) {
      log.warn('[roomsClient] suggestColor failed: not in a room');
      return { success: false, error: 'Not in a room' };
    }
    if (!this.memberId) {
      log.warn('[roomsClient] suggestColor failed: no member ID');
      return { success: false, error: 'No member ID' };
    }
    if (!this.socket.connected) {
      log.warn('[roomsClient] suggestColor failed: socket disconnected');
      return { success: false, error: 'Socket disconnected' };
    }

    log.info('[roomsClient] Sending color suggestion', { roomId: this.roomId, memberId: this.memberId, skinId, chromaId });

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        log.warn('[roomsClient] suggestColor timeout - no acknowledgment received');
        resolve({ success: false, error: 'Request timed out' });
      }, 5000);

      this.socket!.emit(
        "suggest-color",
        {
          roomId: this.roomId,
          memberId: this.memberId,
          skinId,
          chromaId,
        },
        (response: { success: boolean; error?: string }) => {
          clearTimeout(timeout);
          if (response?.success) {
            log.info('[roomsClient] Color suggestion acknowledged by server');
            resolve({ success: true });
          } else {
            log.warn('[roomsClient] Color suggestion failed', response?.error);
            resolve({ success: false, error: response?.error || 'Unknown error' });
          }
        }
      );
    });
  }

  // --- Identity/Presence Methods (Story 4.3) ---

  /**
   * Set callbacks for identity-related events
   */
  setIdentityCallbacks(callbacks: {
    onIdentityConfirmed?: (onlineFriends: string[]) => void;
    onFriendOnline?: (puuid: string, summonerName: string) => void;
    onFriendOffline?: (puuid: string) => void;
  }) {
    this.identityCallbacks = callbacks;
  }

  /**
   * Connect to the server for identity/presence (independent of rooms)
   * Handles automatic reconnection and re-identification (Story 4.8)
   */
  connectIdentity() {
    if (this.identitySocket) return;

    this.identitySocket = io(ROOMS_SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      query: {
        clientVersion: String(CLIENT_VERSION),
      },
    });

    // Handler for EVERY connection (including reconnections)
    this.identitySocket.on("connect", () => {
      log.info("[roomsClient] Identity socket connected", {
        socketId: this.identitySocket?.id,
      });
      presenceStore.setConnectionStatus("connected");

      // Re-identify on reconnection if we have stored identity (Story 4.8)
      if (this.storedIdentity) {
        log.info("[roomsClient] Re-identifying after reconnection");
        this.identitySocket?.emit("identify", this.storedIdentity);
        this.identifiedPuuid = this.storedIdentity.puuid;
      }
    });

    this.identitySocket.on("disconnect", (reason) => {
      log.warn("[roomsClient] Identity socket disconnected", { reason });
      this.identifiedPuuid = null;
      presenceStore.setConnectionStatus("disconnected");
    });

    this.identitySocket.on("connect_error", (error) => {
      log.error("[roomsClient] Identity socket connection error", error);
      presenceStore.setConnectionStatus("connecting");
    });

    // Identity event listeners
    this.identitySocket.on("identity-confirmed", (payload: IdentityConfirmedPayload) => {
      log.info("[roomsClient] Identity confirmed", { onlineFriends: payload.onlineFriends.length });
      this.identityCallbacks.onIdentityConfirmed?.(payload.onlineFriends);
    });

    this.identitySocket.on("friend-online", (payload: FriendOnlinePayload) => {
      log.info("[roomsClient] Friend came online", { puuid: payload.puuid, name: payload.summonerName });
      this.identityCallbacks.onFriendOnline?.(payload.puuid, payload.summonerName);
    });

    this.identitySocket.on("friend-offline", (payload: FriendOfflinePayload) => {
      log.info("[roomsClient] Friend went offline", { puuid: payload.puuid });
      this.identityCallbacks.onFriendOffline?.(payload.puuid);
    });

    // Invite event listeners (Story 4.5)
    this.identitySocket.on("invite-sent", (payload: InviteSentPayload) => {
      log.info("[roomsClient] Invite sent successfully", { targetPuuid: payload.targetPuuid });
      this.inviteCallbacks.onInviteSent?.(payload.targetPuuid);
    });

    this.identitySocket.on("invite-failed", (payload: InviteFailedPayload) => {
      log.warn("[roomsClient] Invite failed", { reason: payload.reason });
      this.inviteCallbacks.onInviteFailed?.(payload.reason);
    });

    this.identitySocket.on("room-invite-received", (payload: RoomInviteReceivedPayload) => {
      log.info("[roomsClient] Received room invite", {
        fromPuuid: payload.fromPuuid,
        fromName: payload.fromName,
        roomCode: payload.roomCode,
      });
      this.inviteCallbacks.onInviteReceived?.(payload.fromPuuid, payload.fromName, payload.roomCode);
    });
  }

  /**
   * Identify the current user to the server
   * Stores identity for automatic re-identification on reconnection (Story 4.8)
   */
  identify(puuid: string, summonerName: string, friends: string[]) {
    // Store identity for reconnection (Story 4.8)
    this.storedIdentity = { puuid, summonerName, friends };

    if (!this.identitySocket) {
      this.connectIdentity();
    }

    // Wait for connection if not yet connected
    if (!this.identitySocket?.connected) {
      this.identitySocket?.once("connect", () => {
        this.identitySocket?.emit("identify", { puuid, summonerName, friends });
        this.identifiedPuuid = puuid;
        log.info("[roomsClient] Sent identify after connection", { puuid, friendsCount: friends.length });
      });
    } else {
      this.identitySocket.emit("identify", { puuid, summonerName, friends });
      this.identifiedPuuid = puuid;
      log.info("[roomsClient] Sent identify", { puuid, friendsCount: friends.length });
    }
  }

  /**
   * Disconnect the identity socket
   */
  disconnectIdentity() {
    if (this.identitySocket) {
      this.identitySocket.disconnect();
      this.identitySocket = null;
      this.identifiedPuuid = null;
      this.storedIdentity = null;
      presenceStore.setConnectionStatus("disconnected");
      log.info("[roomsClient] Identity socket disconnected");
    }
  }

  /**
   * Check if user is identified
   */
  isIdentified() {
    return !!this.identifiedPuuid && this.identitySocket?.connected;
  }

  /**
   * Get the current identified PUUID
   */
  getIdentifiedPuuid() {
    return this.identifiedPuuid;
  }

  // --- Room Invitation Methods (Story 4.5) ---

  /**
   * Set callbacks for invitation events
   */
  setInviteCallbacks(callbacks: {
    onInviteSent?: (targetPuuid: string) => void;
    onInviteFailed?: (reason: InviteFailureReason) => void;
    onInviteReceived?: (fromPuuid: string, fromName: string, roomCode: string) => void;
  }) {
    this.inviteCallbacks = callbacks;
  }

  /**
   * Send a room invitation to a friend
   */
  sendRoomInvite(targetPuuid: string, roomCode: string) {
    if (!this.identitySocket?.connected) {
      log.warn("[roomsClient] Cannot send invite: identity socket not connected");
      this.inviteCallbacks.onInviteFailed?.("not_identified");
      return;
    }

    log.info("[roomsClient] Sending room invite", { targetPuuid, roomCode });
    this.identitySocket.emit("send-room-invite", { targetPuuid, roomCode });
  }
}

export const roomsClient = new RoomsClient();
