/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from "electron";
import type { OwnedSkin } from "../services/skins.service";

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
  rerollChroma: () => ipcRenderer.invoke("reroll-chroma"),
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
};

contextBridge.exposeInMainWorld("lcu", api);
contextBridge.exposeInMainWorld("api", api);
contextBridge.exposeInMainWorld("log", logApi);
