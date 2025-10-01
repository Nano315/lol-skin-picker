export type Selection = {
  championId: number;
  championAlias: string;
  skinId: number;
  chromaId: number;
};

export type OwnedSkin = {
  id: number;
  name: string;
  chromas: { id: number; name: string }[];
};
