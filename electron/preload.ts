import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("lcu", {
  /** Récupère l’état courant (promesse) */
  getStatus: () => ipcRenderer.invoke("get-lcu-status"),
  /** Écoute les changements “connected / disconnected” */
  onStatus: (callback: (s: string) => void) => {
    ipcRenderer.on("lcu-status", (_e, s) => callback(s));
  },
});
