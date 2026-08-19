import { companionApi } from "@/features/api";
import { useIpcSnapshot } from "./useIpcSnapshot";

const NONE: CompanionHotkeyMap = { both: null, skin: null, chroma: null };

/** Le main peut renvoyer `null` avant le premier enregistrement. */
const readHotkeys = async (): Promise<CompanionHotkeyMap> =>
  (await companionApi.getHotkeys()) ?? NONE;

const subscribeHotkeys = (cb: (map: CompanionHotkeyMap) => void) =>
  companionApi.onHotkeys((next) => cb(next ?? NONE));

/**
 * Accelerateurs globaux reellement enregistres.
 *
 * On lit l'etat REEL du main process, pas la preference : un accelerateur peut
 * etre refuse par l'OS parce qu'une autre application le detient. Afficher une
 * pastille clavier qui ne repond pas serait pire que ne rien afficher — d'ou
 * une map dont chaque entree peut valoir `null`.
 */
export function useCompanionHotkeys(): CompanionHotkeyMap {
  return useIpcSnapshot(readHotkeys, subscribeHotkeys, NONE);
}
