import type { OwnedSkin, Selection } from "./types";

type Unsub = () => void;
const lcu = window.lcu;

const asUnsub = (ret: unknown): Unsub =>
  typeof ret === "function" ? (ret as () => void) : () => {};

export const api = {
  // connection
  getStatus: () => lcu.getStatus(),
  onStatus: (cb: (s: string) => void): Unsub => asUnsub(lcu.onStatus(cb)),

  // summoner name
  getSummonerName: () => lcu.getSummonerName(),
  onSummonerName: (cb: (name: string) => void): Unsub =>
    asUnsub(lcu.onSummonerName(cb)),

  // gameflow
  getPhase: () => lcu.getPhase(),
  onPhase: (cb: (p: string) => void): Unsub => asUnsub(lcu.onPhase(cb)),

  // skins
  getSkins: () => lcu.getSkins() as Promise<OwnedSkin[]>,
  onSkins: (cb: (s: OwnedSkin[]) => void): Unsub => asUnsub(lcu.onSkins(cb)),

  applySkinId(skinId: number) {
    return window.lcu.applySkinId(skinId);
  },

  // options
  getIncludeDefault: () => lcu.getIncludeDefault(),
  toggleIncludeDefault: () => lcu.toggleIncludeDefault(),
  setIncludeDefault: (v: boolean) => lcu.setIncludeDefault(v),
  getAutoRoll: () => lcu.getAutoRoll(),
  toggleAutoRoll: () => lcu.toggleAutoRoll(),
  setAutoRoll: (v: boolean) => lcu.setAutoRoll(v),

  // actions
  rerollSkin: () => lcu.rerollSkin(),
  rerollChroma: () => lcu.rerollChroma(),

  // selection
  getSelection: () => lcu.getSelection() as Promise<Selection>,
  onSelection: (cb: (s: Selection) => void): Unsub =>
    asUnsub(lcu.onSelection(cb)),

  // summoner
  getSummonerIcon: () => lcu.getSummonerIcon(),
  onSummonerIcon: (cb: (id: number) => void): Unsub =>
    asUnsub(lcu.onSummonerIcon(cb)),

  // misc
  openExternal: (url: string) => lcu.openExternal(url),
};
