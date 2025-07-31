import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("lcu", {
  /* état connection */
  getStatus: () => ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb: (s: string) => void) => {
    ipcRenderer.on("lcu-status", (_e, s) => cb(s));
  },
  /* gameflow */
  getPhase: () => ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb: (p: string) => void) => {
    ipcRenderer.on("gameflow-phase", (_e, p) => cb(p));
  },
});
