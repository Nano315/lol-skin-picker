"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("lcu", {
  /** Récupère l’état courant (promesse) */
  getStatus: () => electron.ipcRenderer.invoke("get-lcu-status"),
  /** Écoute les changements “connected / disconnected” */
  onStatus: (callback) => {
    electron.ipcRenderer.on("lcu-status", (_e, s) => callback(s));
  }
});
