import type { OwnedSkin, Selection } from "./types";

type Unsub = () => void;
const lcu = window.lcu;

const asUnsub = (ret: unknown): Unsub =>
  typeof ret === "function" ? (ret as () => void) : () => {};

export const api = {
  // connection
  getStatus: () => lcu.getStatus(),
  onStatus: (cb: (s: string) => void): Unsub => asUnsub(lcu.onStatus(cb)),

  // gameflow
  getPhase: () => lcu.getPhase(),
  onPhase: (cb: (p: string) => void): Unsub => asUnsub(lcu.onPhase(cb)),

  // skins
  getSkins: () => lcu.getSkins() as Promise<OwnedSkin[]>,
  onSkins: (cb: (s: OwnedSkin[]) => void): Unsub => asUnsub(lcu.onSkins(cb)),

  // options
  getIncludeDefault: () => lcu.getIncludeDefault(),
  toggleIncludeDefault: () => lcu.toggleIncludeDefault(),
  getAutoRoll: () => lcu.getAutoRoll(),
  toggleAutoRoll: () => lcu.toggleAutoRoll(),

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
