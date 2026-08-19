import { globalShortcut } from "electron";
import { logger } from "../logger";
import { broadcast } from "./windows/broadcast";

/**
 * Raccourcis globaux du Draft Companion.
 *
 * Ils ne sont enregistres que pendant la champ select, jamais en permanence.
 * Un raccourci global est capte pour TOUT le systeme : garder Alt+S 24h/24
 * priverait l'utilisateur de la combinaison dans ses autres applications,
 * alors qu'il n'en a besoin que ~40 secondes par partie. La fenetre de conflit
 * passe ainsi de 100 % du temps a la duree d'une draft.
 *
 * Un spike sur Windows 11 a verifie que ces combinaisons se declenchent bien
 * quand le client League a le focus — c'est toute leur raison d'etre.
 */

export type HotkeyAction = "both" | "skin" | "chroma";

/** Miroir des trois boutons du sidecar. */
const ACCELERATORS: Record<HotkeyAction, string> = {
  both: "Alt+R",
  skin: "Alt+S",
  chroma: "Alt+C",
};

/**
 * Accelerateur effectivement enregistre, par action. `null` = refuse par l'OS
 * parce qu'une autre application le detient. L'interface s'en sert pour ne pas
 * afficher une pastille clavier qui ne repondrait pas.
 */
export type HotkeyMap = Record<HotkeyAction, string | null>;

const NONE: HotkeyMap = { both: null, skin: null, chroma: null };

let onTrigger: ((action: HotkeyAction) => void) | null = null;
let wanted = false;
let activeMap: HotkeyMap = NONE;

/**
 * `onTrigger` doit etre injecte : il se referme sur `SkinsService`, que ce
 * module n'a aucune raison de connaitre. La publication de la map, elle, n'a
 * jamais eu qu'une implementation possible — la diffuser d'ici evite de faire
 * transiter un callback a sens unique par `app.ts`.
 */
export function initHotkeys(trigger: (action: HotkeyAction) => void): void {
  onTrigger = trigger;
}

/** Les deux fenetres affichent les pastilles clavier : tout le monde recoit. */
function publishActiveMap(): void {
  broadcast("companion:hotkeys", activeMap);
}

export function getActiveHotkeys(): HotkeyMap {
  return activeMap;
}

/**
 * Aligne l'etat reel sur l'etat voulu. Idempotent : `applyPresentation`
 * l'appelle a chaque event de phase, on ne veut pas re-enregistrer trois
 * accelerateurs a chaque poll du gameflow.
 */
export function setHotkeysActive(next: boolean): void {
  if (next === wanted) return;
  wanted = next;
  if (next) registerAll();
  else unregisterAll();
}

/** A appeler sur `will-quit` : un raccourci global survit au process sinon. */
export function releaseHotkeys(): void {
  wanted = false;
  unregisterAll();
}

function registerAll(): void {
  const map: HotkeyMap = { ...NONE };

  for (const action of Object.keys(ACCELERATORS) as HotkeyAction[]) {
    const accelerator = ACCELERATORS[action];
    // `register` renvoie false quand un autre process detient deja la
    // combinaison — on l'enregistre dans la map plutot que de le masquer,
    // pour que l'interface reste honnete.
    const ok = globalShortcut.register(accelerator, () => {
      logger.debug(`[Hotkeys] ${accelerator} declenche`);
      onTrigger?.(action);
    });

    if (ok) {
      map[action] = accelerator;
    } else {
      logger.warn(
        `[Hotkeys] ${accelerator} refuse — deja pris par une autre application`
      );
    }
  }

  activeMap = map;
  logger.info("[Hotkeys] actifs", activeMap);
  publishActiveMap();
}

function unregisterAll(): void {
  // Par nom et non `unregisterAll()` : ce dernier libererait aussi tout
  // raccourci qu'un autre morceau de l'app viendrait a enregistrer.
  for (const accelerator of Object.values(ACCELERATORS)) {
    globalShortcut.unregister(accelerator);
  }
  if (activeMap === NONE) return;
  activeMap = NONE;
  publishActiveMap();
}
