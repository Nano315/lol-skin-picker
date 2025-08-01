"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("lcu", {
  /* connexion */
  getStatus: () => electron.ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb) => electron.ipcRenderer.on("lcu-status", (_e, s) => cb(s)),
  /* gameflow */
  getPhase: () => electron.ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb) => electron.ipcRenderer.on("gameflow-phase", (_e, p) => cb(p)),
  /* skins + chromas */
  getSkins: () => electron.ipcRenderer.invoke("get-owned-skins"),
  onSkins: (cb) => electron.ipcRenderer.on("owned-skins", (_e, list) => cb(list))
});
