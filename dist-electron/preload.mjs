"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("lcu", {
  /* connexion */
  getStatus: () => electron.ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb) => electron.ipcRenderer.on("lcu-status", (_e, s) => cb(s)),
  /* Icon */
  getSummonerIcon: () => electron.ipcRenderer.invoke("get-summoner-icon"),
  onSummonerIcon: (cb) => electron.ipcRenderer.on("summoner-icon", (_e, id) => cb(id)),
  /* gameflow */
  getPhase: () => electron.ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb) => electron.ipcRenderer.on("gameflow-phase", (_e, p) => cb(p)),
  /* skins + chromas */
  getSkins: () => electron.ipcRenderer.invoke("get-owned-skins"),
  onSkins: (cb) => electron.ipcRenderer.on("owned-skins", (_e, list) => cb(list)),
  /* options */
  getIncludeDefault: () => electron.ipcRenderer.invoke("get-include-default"),
  toggleIncludeDefault: () => electron.ipcRenderer.invoke("toggle-include-default"),
  getAutoRoll: () => electron.ipcRenderer.invoke("get-auto-roll"),
  toggleAutoRoll: () => electron.ipcRenderer.invoke("toggle-auto-roll"),
  /* actions */
  rerollSkin: () => electron.ipcRenderer.invoke("reroll-skin"),
  rerollChroma: () => electron.ipcRenderer.invoke("reroll-chroma"),
  getSelection: () => electron.ipcRenderer.invoke("get-selection"),
  onSelection: (cb) => electron.ipcRenderer.on("selection", (_e, sel) => cb(sel)),
  /* dm discord */
  openExternal: (url) => electron.ipcRenderer.invoke("open-external", url)
});
