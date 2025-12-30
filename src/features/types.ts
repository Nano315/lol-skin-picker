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
