"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("lcu", {
  /* état connection */
  getStatus: () => electron.ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb) => {
    electron.ipcRenderer.on("lcu-status", (_e, s) => cb(s));
  },
  /* gameflow */
  getPhase: () => electron.ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb) => {
    electron.ipcRenderer.on("gameflow-phase", (_e, p) => cb(p));
  }
});
