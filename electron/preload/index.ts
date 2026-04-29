/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from "electron";
import type { OwnedSkin } from "../services/skins.service";
import type { LcuFriend, LcuIdentity } from "../services/lcuWatcher";
import type { SkinLineInfo } from "../services/skinLineService";

const logApi = {
  info: (...args: any[]) => ipcRenderer.invoke("log-message", "info", ...args),
  warn: (...args: any[]) => ipcRenderer.invoke("log-message", "warn", ...args),
  error: (...args: any[]) => ipcRenderer.invoke("log-message", "error", ...args),
  debug: (...args: any[]) => ipcRenderer.invoke("log-message", "debug", ...args),
};

const api = {
  /* LCU */
  getStatus: () => ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb: (s: string) => void) => {
    const listener = (_e: any, s: string) => cb(s);
    ipcRenderer.on("lcu-status", listener);
    return () => ipcRenderer.removeListener("lcu-status", listener);
  },

  /* Identity & Friends */
  getIdentity: () => ipcRenderer.invoke("lcu:getIdentity") as Promise<LcuIdentity | null>,
  getFriends: () => ipcRenderer.invoke("lcu:getFriends") as Promise<LcuFriend[] | null>,

  /* Skin Lines (Story 6.1) */
  getSkinLine: (skinId: number) => ipcRenderer.invoke("lcu:getSkinLine", skinId) as Promise<SkinLineInfo | null>,
  getSkinLines: () => ipcRenderer.invoke("lcu:getSkinLines") as Promise<SkinLineInfo[]>,

  /* Chroma Color (fixes CORS) */
  getChromaColor: (params: { championId: number; skinId: number; chromaId: number }) =>
    ipcRenderer.invoke("lcu:getChromaColor", params) as Promise<string | null>,
  getSkinChromaColors: (params: { championId: number; skinId: number }) =>
    ipcRenderer.invoke("lcu:getSkinChromaColors", params) as Promise<Record<number, string | null>>,

  /* Summoner Icon */
  getSummonerIcon: () => ipcRenderer.invoke("get-summoner-icon"),
  onSummonerIcon: (cb: (id: number) => void) => {
    const listener = (_e: any, id: number) => cb(id);
    ipcRenderer.on("summoner-icon", listener);
    return () => ipcRenderer.removeListener("summoner-icon", listener);
  },

  /* Summoner Name */
  getSummonerName: () => ipcRenderer.invoke("get-summoner-name"),
  onSummonerName: (cb: (name: string) => void) => {
    const listener = (_e: any, name: string) => cb(name);
    ipcRenderer.on("summoner-name", listener);
    return () => ipcRenderer.removeListener("summoner-name", listener);
  },

  /* Gameflow */
  getPhase: () => ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb: (p: string) => void) => {
    const listener = (_e: any, p: string) => cb(p);
    ipcRenderer.on("gameflow-phase", listener);
    return () => ipcRenderer.removeListener("gameflow-phase", listener);
  },

  /* Skins */
  getSkins: () => ipcRenderer.invoke("get-owned-skins"),
  onSkins: (cb: (s: OwnedSkin[]) => void) => {
    const listener = (_e: any, list: OwnedSkin[]) => cb(list);
    ipcRenderer.on("owned-skins", listener);
    return () => ipcRenderer.removeListener("owned-skins", listener);
  },

  applySkinId: (skinId: number) => ipcRenderer.invoke("apply-skin-id", skinId),

  /* Options */
  getIncludeDefault: () => ipcRenderer.invoke("get-include-default"),
  toggleIncludeDefault: () => ipcRenderer.invoke("toggle-include-default"),
  setIncludeDefault: (v: boolean) =>
    ipcRenderer.invoke("set-include-default", v),

  getAutoRoll: () => ipcRenderer.invoke("get-auto-roll"),
  toggleAutoRoll: () => ipcRenderer.invoke("toggle-auto-roll"),
  setAutoRoll: (v: boolean) => ipcRenderer.invoke("set-auto-roll", v),

  getPerformanceMode: () => ipcRenderer.invoke("get-performance-mode"),
  togglePerformanceMode: () => ipcRenderer.invoke("toggle-performance-mode"),
  setPerformanceMode: (v: boolean) =>
    ipcRenderer.invoke("set-performance-mode", v),

  /* Actions & Selection */
  rerollSkin: () => ipcRenderer.invoke("reroll-skin"),
  rerollSkinOnly: () => ipcRenderer.invoke("reroll-skin-only"),
  rerollChroma: () => ipcRenderer.invoke("reroll-chroma"),

  getMatchLock: () => ipcRenderer.invoke("get-match-lock") as Promise<boolean>,
  setMatchLock: (locked: boolean) =>
    ipcRenderer.invoke("set-match-lock", locked),
  getSelection: () => ipcRenderer.invoke("get-selection"),
  onSelection: (
    cb: (s: {
      championId: number;
      championAlias: string;
      skinId: number;
      chromaId: number;
      locked: boolean;
    }) => void
  ) => {
    const listener = (_e: any, sel: any) => cb(sel);
    ipcRenderer.on("selection", listener);
    return () => ipcRenderer.removeListener("selection", listener);
  },

  /* Divers */
  openExternal: (url: string) => ipcRenderer.invoke("open-external", url),

  openLogsFolder: () => ipcRenderer.invoke("open-logs-folder"),

  getOpenAtLogin: () => ipcRenderer.invoke("get-open-at-login"),
  setOpenAtLogin: (v: boolean) => ipcRenderer.invoke("set-open-at-login", v),

  /* History */
  getHistorySettings: () => ipcRenderer.invoke("get-history-settings"),
  setHistorySettings: (settings: { historySize?: number; historyEnabled?: boolean }) =>
    ipcRenderer.invoke("set-history-settings", settings),
  getRecentHistory: (championId: number) =>
    ipcRenderer.invoke("get-recent-history", championId),
  addToHistory: (championId: number, skinId: number, chromaId: number) =>
    ipcRenderer.invoke("add-to-history", championId, skinId, chromaId),
  clearHistory: (championId?: number) =>
    ipcRenderer.invoke("clear-history", championId),

  /* Exclusions (skin/chroma random pool) */
  getExclusions: (championId: number) =>
    ipcRenderer.invoke("exclusions:get", championId) as Promise<number[]>,
  getAllExclusions: () =>
    ipcRenderer.invoke("exclusions:get-all") as Promise<{
      [championId: number]: number[];
    }>,
  setExcluded: (championId: number, id: number, excluded: boolean) =>
    ipcRenderer.invoke("exclusions:set", championId, id, excluded),
  bulkSetExcluded: (championId: number, ids: number[], excluded: boolean) =>
    ipcRenderer.invoke("exclusions:bulk-set", championId, ids, excluded),
  clearExclusions: (championId?: number) =>
    ipcRenderer.invoke("exclusions:clear", championId),

  /* Champion Library (browse all owned champions + their skins) */
  getOwnedChampions: () =>
    ipcRenderer.invoke("championLibrary:getOwned") as Promise<
      Array<{
        id: number;
        alias: string;
        name: string;
        mastery: number;
        skinCount: number;
      }>
    >,
  getChampionSkins: (championId: number) =>
    ipcRenderer.invoke("championLibrary:getSkins", championId) as Promise<
      OwnedSkin[]
    >,
  invalidateChampionLibrary: () =>
    ipcRenderer.invoke("championLibrary:invalidate"),

  /* Telemetry */
  getTelemetryConsent: () => ipcRenderer.invoke("telemetry:getConsent"),
  setTelemetryConsent: (enabled: boolean) =>
    ipcRenderer.invoke("telemetry:setConsent", enabled),
  isFirstLaunch: () => ipcRenderer.invoke("telemetry:isFirstLaunch"),
  trackEvent: (
    name: string,
    props?: Record<string, string | number | boolean>
  ) => ipcRenderer.invoke("telemetry:track", name, props),
};

const windowControls = {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  toggleMaximize: () => ipcRenderer.invoke("window:toggleMaximize"),
  close: () => ipcRenderer.invoke("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized") as Promise<boolean>,
  onMaximizeChange: (cb: (isMax: boolean) => void) => {
    const listener = (_e: any, isMax: boolean) => cb(isMax);
    ipcRenderer.on("window:maximize-change", listener);
    return () => ipcRenderer.removeListener("window:maximize-change", listener);
  },
};

const updates = {
  getState: () => ipcRenderer.invoke("updates:getState"),
  check: () => ipcRenderer.invoke("updates:check"),
  download: () => ipcRenderer.invoke("updates:download"),
  install: () => ipcRenderer.invoke("updates:install"),
  onStatus: (cb: (s: any) => void) => {
    const listener = (_e: any, state: any) => cb(state);
    ipcRenderer.on("updates:status", listener);
    return () => ipcRenderer.removeListener("updates:status", listener);
  },
};

contextBridge.exposeInMainWorld("lcu", api);
contextBridge.exposeInMainWorld("log", logApi);
contextBridge.exposeInMainWorld("windowControls", windowControls);
contextBridge.exposeInMainWorld("updates", updates);
