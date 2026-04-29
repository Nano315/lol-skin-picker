import type { OwnedSkin } from "../services/skins.service";
import type { LcuFriend, LcuIdentity } from "../services/lcuWatcher";
import type { SkinLineInfo } from "../services/skinLineService";

export {};

type Unsub = () => void;

declare global {
  interface Window {
    lcu: {
      getStatus: () => Promise<string>;
      onStatus: (cb: (s: string) => void) => Unsub;

      // Identity & Friends
      getIdentity: () => Promise<LcuIdentity | null>;
      getFriends: () => Promise<LcuFriend[] | null>;

      // Skin Lines (Story 6.1)
      getSkinLine: (skinId: number) => Promise<SkinLineInfo | null>;
      getSkinLines: () => Promise<SkinLineInfo[]>;

      // Chroma Color (fixes CORS)
      getChromaColor: (params: {
        championId: number;
        skinId: number;
        chromaId: number;
      }) => Promise<string | null>;

      // Batch chroma colors for a skin (used by ChromaBalls overlay)
      getSkinChromaColors: (params: {
        championId: number;
        skinId: number;
      }) => Promise<Record<number, string | null>>;

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
      rerollSkinOnly: () => Promise<void>;
      rerollChroma: () => Promise<void>;

      getMatchLock: () => Promise<boolean>;
      setMatchLock: (locked: boolean) => Promise<void>;

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

      // Exclusions (skin/chroma random pool)
      getExclusions: (championId: number) => Promise<number[]>;
      getAllExclusions: () => Promise<{ [championId: number]: number[] }>;
      setExcluded: (
        championId: number,
        id: number,
        excluded: boolean
      ) => Promise<void>;
      bulkSetExcluded: (
        championId: number,
        ids: number[],
        excluded: boolean
      ) => Promise<void>;
      clearExclusions: (championId?: number) => Promise<void>;

      // Champion Library (browse all owned champions + their skins)
      getOwnedChampions: () => Promise<
        Array<{
          id: number;
          alias: string;
          name: string;
          mastery: number;
          skinCount: number;
        }>
      >;
      getChampionSkins: (championId: number) => Promise<OwnedSkin[]>;
      invalidateChampionLibrary: () => Promise<void>;

      // Telemetry
      getTelemetryConsent: () => Promise<boolean>;
      setTelemetryConsent: (enabled: boolean) => Promise<boolean>;
      isFirstLaunch: () => Promise<boolean>;
      trackEvent: (
        name: string,
        props?: Record<string, string | number | boolean>
      ) => Promise<void>;
    };

    log: {
      info: (...args: unknown[]) => Promise<void>;
      warn: (...args: unknown[]) => Promise<void>;
      error: (...args: unknown[]) => Promise<void>;
      debug: (...args: unknown[]) => Promise<void>;
    };

    windowControls: {
      minimize: () => Promise<void>;
      toggleMaximize: () => Promise<void>;
      close: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      onMaximizeChange: (cb: (isMax: boolean) => void) => Unsub;
    };

    updates: {
      getState: () => Promise<UpdateState>;
      check: () => Promise<void>;
      download: () => Promise<void>;
      install: () => Promise<void>;
      onStatus: (cb: (state: UpdateState) => void) => Unsub;
    };
  }

  type UpdateStatus =
    | "idle"
    | "checking"
    | "available"
    | "downloading"
    | "downloaded"
    | "not-available"
    | "error"
    | "unavailable";

  interface UpdateState {
    status: UpdateStatus;
    currentVersion: string;
    newVersion: string | null;
    channel: "latest" | "beta" | null;
    percent: number | null;
    errorMessage: string | null;
  }
}
