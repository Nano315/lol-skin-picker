import { contextBridge, ipcRenderer } from "electron";
import type { OwnedSkin } from "./championSkins.js"; // ← import uniquement type

contextBridge.exposeInMainWorld("lcu", {
  /* connexion */
  getStatus: () => ipcRenderer.invoke("get-lcu-status"),
  onStatus: (cb: (s: string) => void) =>
    ipcRenderer.on("lcu-status", (_e, s) => cb(s)),

  /* gameflow */
  getPhase: () => ipcRenderer.invoke("get-gameflow-phase"),
  onPhase: (cb: (p: string) => void) =>
    ipcRenderer.on("gameflow-phase", (_e, p) => cb(p)),

  /* skins + chromas */
  getSkins: () => ipcRenderer.invoke("get-owned-skins"),
  onSkins: (cb: (s: OwnedSkin[]) => void) =>
    ipcRenderer.on("owned-skins", (_e, list) => cb(list as OwnedSkin[])),

  /* options */
  getIncludeDefault: () => ipcRenderer.invoke("get-include-default"),
  toggleIncludeDefault: () => ipcRenderer.invoke("toggle-include-default"),

  /* actions */
  rerollSkin: () => ipcRenderer.invoke("reroll-skin"),
});
