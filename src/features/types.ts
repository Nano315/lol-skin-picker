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
