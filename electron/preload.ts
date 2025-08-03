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
  getAutoRoll: () => ipcRenderer.invoke("get-auto-roll"),
  toggleAutoRoll: () => ipcRenderer.invoke("toggle-auto-roll"),

  /* actions */
  rerollSkin: () => ipcRenderer.invoke("reroll-skin"),
  rerollChroma: () => ipcRenderer.invoke("reroll-chroma"),

  getSelection: () => ipcRenderer.invoke("get-selection"),
  onSelection: (cb: (s: { skinId: number; chromaId: number }) => void) =>
    ipcRenderer.on("selection", (_e, s) => cb(s)),
});
