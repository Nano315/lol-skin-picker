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
      /** Rediffusion du lock par le main : garde les 2 fenetres synchronisees. */
      onMatchLock: (cb: (locked: boolean) => void) => Unsub;

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

      getAutoAcceptMatch: () => Promise<boolean>;
      setAutoAcceptMatch: (v: boolean) => Promise<void>;

      getWardAutoRoll: () => Promise<boolean>;
      setWardAutoRoll: (v: boolean) => Promise<void>;

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
      getGlobalRecentHistory: (limit: number) => Promise<
        Array<{
          championId: number;
          skinId: number;
          chromaId: number;
          timestamp: number;
        }>
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

      // Onboarding (couche 1: welcome flow + consent gate)
      onboardingGetState: () => Promise<OnboardingState>;
      onboardingMarkCompleted: (
        key: OnboardingKey
      ) => Promise<OnboardingState>;
      onboardingReset: () => Promise<OnboardingState>;
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

    /** Draft Companion — voir electron/main/windows/companionWindow.ts */
    companion: {
      getEnabled: () => Promise<boolean>;
      setEnabled: (v: boolean) => Promise<boolean>;
      /** Masque le sidecar pour la draft en cours, sans toucher a l'option. */
      hide: () => Promise<void>;

      /* --- Raccourcis globaux --- */
      getHotkeysEnabled: () => Promise<boolean>;
      setHotkeysEnabled: (v: boolean) => Promise<boolean>;
      /** Accelerateurs reellement enregistres — `null` = refuse par l'OS. */
      getHotkeys: () => Promise<CompanionHotkeyMap>;
      onHotkeys: (cb: (map: CompanionHotkeyMap) => void) => Unsub;
      /** Un seul ecran et sidecar desactive : vaut-il la peine de le proposer ? */
      shouldSuggest: () => Promise<boolean>;

      /* --- Relais premade (voir CompanionBridgeConnector) --- */
      /** Fenetre principale -> main : publie l'etat de room courant. */
      publishRoom: (state: CompanionRoomState | null) => Promise<void>;
      /** Sidecar : etat cache, pour s'hydrater a l'ouverture. */
      getRoom: () => Promise<CompanionRoomState | null>;
      /** Sidecar : abonnement aux mises a jour de room. */
      onRoom: (cb: (state: CompanionRoomState | null) => void) => Unsub;
      /** Sidecar -> fenetre principale : demande une action de groupe. */
      sendAction: (action: CompanionAction) => Promise<void>;
      /** Fenetre principale : recoit les actions du sidecar. */
      onAction: (cb: (action: CompanionAction) => void) => Unsub;
    };
  }

  /**
   * Vue reduite de la room, taillee pour le sidecar.
   *
   * Volontairement plate et sans `options[]` : le sidecar n'a pas besoin des
   * combinaisons possedees de chaque membre, et les relayer ferait transiter
   * plusieurs centaines de lignes par push de room-state pour rien.
   */
  interface CompanionRoomState {
    inRoom: boolean;
    isOwner: boolean;
    members: CompanionRoomMember[];
    /** Couleur de synergie dominante (premiere du tri serveur), si elle existe. */
    synergyColor: string | null;
    /** Nb de membres partageant cette couleur. */
    synergyCount: number;
    /** Nb de membres ayant soumis leurs options — denominateur du badge. */
    readyCount: number;
  }

  interface CompanionRoomMember {
    id: string;
    name: string;
    isSelf: boolean;
    isOwner: boolean;
    /** A soumis ses owned-options pour son champion verrouille. */
    ready: boolean;
    lockedSkin: boolean;
    /** Participe a la couleur de synergie dominante. */
    inSynergy: boolean;
  }

  /**
   * Le sidecar demande une intention, jamais une valeur : c'est la fenetre
   * principale qui resout la couleur dominante au moment d'agir. Transmettre
   * la couleur depuis le sidecar aurait ouvert une course — le sidecar peut
   * avoir une synergie d'il y a deux secondes.
   */
  type CompanionAction = { type: "matchTeam" };

  /**
   * Accelerateur enregistre pour chaque action, ou `null` si l'OS l'a refuse
   * parce qu'une autre application le detient. L'interface n'affiche une
   * pastille clavier que pour les entrees non nulles : montrer un raccourci
   * qui ne repond pas est pire que ne rien montrer.
   */
  interface CompanionHotkeyMap {
    both: string | null;
    skin: string | null;
    chroma: string | null;
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

  // Onboarding — kept in sync with electron/main/onboardingState.ts.
  type OnboardingKey =
    | "welcomeCompleted"
    | "consentRecorded"
    | "rerollCoachSeen"
    | "matchLockCoachSeen"
    | "synergyCoachSeen"
    | "exclusionToastSeen"
    | "companionCoachSeen";
  interface OnboardingState {
    welcomeCompleted: boolean;
    consentRecorded: boolean;
    rerollCoachSeen: boolean;
    matchLockCoachSeen: boolean;
    synergyCoachSeen: boolean;
    exclusionToastSeen: boolean;
    companionCoachSeen: boolean;
  }
}
