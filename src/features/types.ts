export type Selection = {
  championId: number;
  championAlias: string;
  skinId: number;
  chromaId: number;
  locked: boolean;
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
