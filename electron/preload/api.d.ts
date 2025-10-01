import type { OwnedSkin } from "../services/skins.service";

export {};

type Unsub = () => void;

declare global {
  interface Window {
    lcu: {
      getStatus: () => Promise<string>;
      onStatus: (cb: (s: string) => void) => Unsub;

      getSummonerIcon: () => Promise<number>;
      onSummonerIcon: (cb: (id: number) => void) => Unsub;

      getPhase: () => Promise<string>;
      onPhase: (cb: (p: string) => void) => Unsub;

      getSkins: () => Promise<OwnedSkin[]>;
      onSkins: (cb: (s: OwnedSkin[]) => void) => Unsub;

      getIncludeDefault: () => Promise<boolean>;
      toggleIncludeDefault: () => Promise<void>;
      getAutoRoll: () => Promise<boolean>;
      toggleAutoRoll: () => Promise<void>;

      rerollSkin: () => Promise<void>;
      rerollChroma: () => Promise<void>;

      getSelection: () => Promise<{
        championId: number;
        championAlias: string;
        skinId: number;
        chromaId: number;
      }>;
      onSelection: (
        cb: (s: {
          championId: number;
          championAlias: string;
          skinId: number;
          chromaId: number;
        }) => void
      ) => Unsub;

      openExternal: (url: string) => Promise<void>;
    };

    api: Window["lcu"];
  }
}
