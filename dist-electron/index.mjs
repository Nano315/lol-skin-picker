"use strict";
const electron = require("electron");
const api = {
  /* LCU */
  getStatus: () => electron.ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb) => {
    const listener = (_e, s) => cb(s);
    electron.ipcRenderer.on("lcu-status", listener);
    return () => electron.ipcRenderer.removeListener("lcu-status", listener);
  },
  /* Summoner Icon */
  getSummonerIcon: () => electron.ipcRenderer.invoke("get-summoner-icon"),
  onSummonerIcon: (cb) => {
    const listener = (_e, id) => cb(id);
    electron.ipcRenderer.on("summoner-icon", listener);
    return () => electron.ipcRenderer.removeListener("summoner-icon", listener);
  },
  /* Gameflow */
  getPhase: () => electron.ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb) => {
    const listener = (_e, p) => cb(p);
    electron.ipcRenderer.on("gameflow-phase", listener);
    return () => electron.ipcRenderer.removeListener("gameflow-phase", listener);
  },
  /* Skins */
  getSkins: () => electron.ipcRenderer.invoke("get-owned-skins"),
  onSkins: (cb) => {
    const listener = (_e, list) => cb(list);
    electron.ipcRenderer.on("owned-skins", listener);
    return () => electron.ipcRenderer.removeListener("owned-skins", listener);
  },
  /* Options */
  getIncludeDefault: () => electron.ipcRenderer.invoke("get-include-default"),
  toggleIncludeDefault: () => electron.ipcRenderer.invoke("toggle-include-default"),
  getAutoRoll: () => electron.ipcRenderer.invoke("get-auto-roll"),
  toggleAutoRoll: () => electron.ipcRenderer.invoke("toggle-auto-roll"),
  /* Actions */
  rerollSkin: () => electron.ipcRenderer.invoke("reroll-skin"),
  rerollChroma: () => electron.ipcRenderer.invoke("reroll-chroma"),
  getSelection: () => electron.ipcRenderer.invoke("get-selection"),
  /* Divers */
  openExternal: (url) => electron.ipcRenderer.invoke("open-external", url)
};
electron.contextBridge.exposeInMainWorld("lcu", api);
electron.contextBridge.exposeInMainWorld("api", api);
