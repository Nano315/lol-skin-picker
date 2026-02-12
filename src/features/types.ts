export type Selection = {
  championId: number;
  championAlias: string;
  skinId: number;
  chromaId: number;
  locked: boolean;
};

// LCU Identity & Friends types
export type LcuFriend = {
  puuid: string;
  name: string;
  availability: string;
};

export type LcuIdentity = {
  puuid: string | null;
  summonerName: string | null;
  friends: LcuFriend[];
  isLoading: boolean;
  error: string | null;
};

// Socket Identity Handshake types (Story 4.3)
export type IdentifyPayload = {
  puuid: string;
  summonerName: string;
  friends: string[];
};

export type IdentityConfirmedPayload = {
  onlineFriends: string[];
};

export type FriendOnlinePayload = {
  puuid: string;
  summonerName: string;
};

export type FriendOfflinePayload = {
  puuid: string;
};

// Online friend with details (enriched from LcuFriend)
export type OnlineFriend = {
  puuid: string;
  summonerName: string;
};

// --- Room Invitation Types (Story 4.5) ---

// Payload for 'room-invite-received' event (S->C)
export type RoomInviteReceivedPayload = {
  fromPuuid: string;
  fromName: string;
  roomCode: string;
};

// Payload for 'invite-sent' event (S->C)
export type InviteSentPayload = {
  targetPuuid: string;
};

// Payload for 'invite-failed' event (S->C)
export type InviteFailedPayload = {
  reason: "not_identified" | "not_friend" | "rate_limited" | "friend_offline" | "already_in_room";
};

// Invite failure reasons for UI display
export type InviteFailureReason = InviteFailedPayload["reason"];

export type OwnedSkin = {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
  championId: number;
};

export type ConnectionStatus = "unknown" | "connected" | "disconnected";

// AppError structure based on backend and network errors
export type AppError = {
  code: string; // e.g., ROOM_NOT_FOUND, NETWORK_ERROR
  message: string;
  context?: unknown;
};

// Toast message structure
export type Toast = {
  type: "info" | "success" | "error" | "warning";
  message: string;
  duration?: number;
};

// Group history - mirrors backend type (for reference)
export type ChromaCombination = {
  color: string;
  members: Array<{ memberId: string; skinId: number; chromaId: number }>;
  timestamp: number;
};

// Story 6.2: Skin line synergy (mirrors backend)
export type SkinLineSynergy = {
  type: "skinLine";
  skinLineId: number;
  skinLineName: string;
  members: string[];
  coverage: number;
  combinationCount: number;
};

// Story 6.2: Sync mode (mirrors backend)
export type SyncMode = "chromas" | "skins" | "both";
