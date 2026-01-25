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

      getSummonerName: () => Promise<string>;
      onSummonerName: (cb: (name: string) => void) => Unsub;

      getPhase: () => Promise<string>;
      onPhase: (cb: (p: string) => void) => Unsub;

      getSkins: () => Promise<OwnedSkin[]>;
      onSkins: (cb: (s: OwnedSkin[]) => void) => Unsub;

      applySkinId: (id: number) => Promise<void>;

      getIncludeDefault: () => Promise<boolean>;
      toggleIncludeDefault: () => Promise<void>;
      setIncludeDefault: (v: boolean) => Promise<void>;

      getAutoRoll: () => Promise<boolean>;
      toggleAutoRoll: () => Promise<void>;
      setAutoRoll: (v: boolean) => Promise<void>;

      getPerformanceMode: () => Promise<boolean>;
      togglePerformanceMode: () => Promise<void>;
      setPerformanceMode: (v: boolean) => Promise<void>;

      rerollSkin: () => Promise<void>;
      rerollChroma: () => Promise<void>;

      getSelection: () => Promise<{
        championId: number;
        championAlias: string;
        skinId: number;
        chromaId: number;
        locked: boolean;
      }>;
      onSelection: (
        cb: (s: {
          championId: number;
          championAlias: string;
          skinId: number;
          chromaId: number;
          locked: boolean;
        }) => void
      ) => Unsub;

      openExternal: (url: string) => Promise<void>;

      openLogsFolder: () => Promise<void>;
      
      getOpenAtLogin: () => Promise<boolean>;
      setOpenAtLogin: (v: boolean) => Promise<void>;

      // History
      getHistorySettings: () => Promise<{
        historySize: number;
        historyEnabled: boolean;
      }>;
      setHistorySettings: (settings: {
        historySize?: number;
        historyEnabled?: boolean;
      }) => Promise<void>;
      getRecentHistory: (championId: number) => Promise<
        Array<{ skinId: number; chromaId: number; timestamp: number }>
      >;
      addToHistory: (
        championId: number,
        skinId: number,
        chromaId: number
      ) => Promise<void>;
      clearHistory: (championId?: number) => Promise<void>;
    };

    api: Window["lcu"];

    log: {
      info: (...args: unknown[]) => Promise<void>;
      warn: (...args: unknown[]) => Promise<void>;
      error: (...args: unknown[]) => Promise<void>;
      debug: (...args: unknown[]) => Promise<void>;
    };
  }
}
