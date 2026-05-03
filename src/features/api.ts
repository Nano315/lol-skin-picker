import type { OwnedSkin, Selection, LcuFriend } from "./types";

type Unsub = () => void;
const lcu = window.lcu;

const asUnsub = (ret: unknown): Unsub =>
  typeof ret === "function" ? (ret as () => void) : () => { };

export const api = {
  // connection
  getStatus: () => lcu.getStatus(),
  onStatus: (cb: (s: string) => void): Unsub => asUnsub(lcu.onStatus(cb)),

  // identity & friends
  getIdentity: () => lcu.getIdentity(),
  getFriends: () => lcu.getFriends() as Promise<LcuFriend[] | null>,

  // summoner name
  getSummonerName: () => lcu.getSummonerName(),
  onSummonerName: (cb: (name: string) => void): Unsub =>
    asUnsub(lcu.onSummonerName(cb)),

  // gameflow
  getPhase: () => lcu.getPhase(),
  onPhase: (cb: (p: string) => void): Unsub => asUnsub(lcu.onPhase(cb)),

  // skins
  getSkins: () => lcu.getSkins() as Promise<OwnedSkin[]>,
  onSkins: (cb: (s: OwnedSkin[]) => void): Unsub => asUnsub(lcu.onSkins(cb)),

  applySkinId(skinId: number) {
    return window.lcu.applySkinId(skinId);
  },

  // options
  getIncludeDefault: () => lcu.getIncludeDefault(),
  toggleIncludeDefault: () => lcu.toggleIncludeDefault(),
  setIncludeDefault: (v: boolean) => lcu.setIncludeDefault(v),
  getAutoRoll: () => lcu.getAutoRoll(),
  toggleAutoRoll: () => lcu.toggleAutoRoll(),
  setAutoRoll: (v: boolean) => lcu.setAutoRoll(v),
  getPerformanceMode: () => lcu.getPerformanceMode(),
  togglePerformanceMode: () => lcu.togglePerformanceMode(),
  setPerformanceMode: (v: boolean) => lcu.setPerformanceMode(v),
  getOpenAtLogin: () => lcu.getOpenAtLogin(),
  setOpenAtLogin: (v: boolean) => lcu.setOpenAtLogin(v),
  getAutoAcceptMatch: () => lcu.getAutoAcceptMatch(),
  setAutoAcceptMatch: (v: boolean) => lcu.setAutoAcceptMatch(v),

  // actions
  rerollSkin: () => lcu.rerollSkin(),
  rerollSkinOnly: () => lcu.rerollSkinOnly(),
  rerollChroma: () => lcu.rerollChroma(),

  // match lock
  getMatchLock: () => lcu.getMatchLock(),
  setMatchLock: (locked: boolean) => lcu.setMatchLock(locked),
  getSkinChromaColors: (championId: number, skinId: number) =>
    lcu.getSkinChromaColors({ championId, skinId }),

  // selection
  getSelection: () => lcu.getSelection() as Promise<Selection>,
  onSelection: (cb: (s: Selection) => void): Unsub =>
    asUnsub(lcu.onSelection(cb)),

  // summoner
  getSummonerIcon: () => lcu.getSummonerIcon(),
  onSummonerIcon: (cb: (id: number) => void): Unsub =>
    asUnsub(lcu.onSummonerIcon(cb)),

  // misc
  openExternal: (url: string) => lcu.openExternal(url),

  openLogsFolder: () => lcu.openLogsFolder(),

  // aliases for specific targeting
  setSkin: (id: number) => lcu.applySkinId(id),
  setChroma: (id: number) => lcu.applySkinId(id),

  // history
  getHistorySettings: () => lcu.getHistorySettings(),
  setHistorySettings: (settings: { historySize?: number; historyEnabled?: boolean }) =>
    lcu.setHistorySettings(settings),
  getRecentHistory: (championId: number) => lcu.getRecentHistory(championId),
  addToHistory: (championId: number, skinId: number, chromaId: number) =>
    lcu.addToHistory(championId, skinId, chromaId),
  clearHistory: (championId?: number) => lcu.clearHistory(championId),

  // exclusions (skin/chroma random pool)
  getExclusions: (championId: number) => lcu.getExclusions(championId),
  getAllExclusions: () => lcu.getAllExclusions(),
  setExcluded: (championId: number, id: number, excluded: boolean) =>
    lcu.setExcluded(championId, id, excluded),
  bulkSetExcluded: (championId: number, ids: number[], excluded: boolean) =>
    lcu.bulkSetExcluded(championId, ids, excluded),
  clearExclusions: (championId?: number) => lcu.clearExclusions(championId),
};

// Telemetry exports
export const getTelemetryConsent = () => window.lcu.getTelemetryConsent();
export const setTelemetryConsent = (enabled: boolean) =>
  window.lcu.setTelemetryConsent(enabled);
export const isFirstLaunch = () => window.lcu.isFirstLaunch();

// Updates exports — pilote la pastille in-app dans la title bar
export const updatesApi = {
  getState: () => window.updates.getState(),
  check: () => window.updates.check(),
  download: () => window.updates.download(),
  install: () => window.updates.install(),
  onStatus: (cb: (state: UpdateState) => void): Unsub =>
    asUnsub(window.updates.onStatus(cb)),
};
