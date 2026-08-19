import type { GroupSkinOption } from "@/features/roomsClient";

/**
 * Combinaisons skin/chroma possedees sur le champion verrouille, plus l'etat
 * du calcul qui les produit.
 *
 * Ce calcul vivait dans un `useEffect` de `Premade.tsx`, donc il ne tournait
 * que si la route /premade etait montee. Un utilisateur qui rejoignait une room
 * puis naviguait ailleurs n'envoyait jamais ses options au serveur : pas de
 * synergie, pas de Match Team, et aucune erreur pour le signaler. Le sidecar de
 * draft rendait le cas courant, puisqu'il donne l'impression qu'on n'a plus
 * besoin de la fenetre principale.
 *
 * Le calcul est donc remonte dans `OwnedOptionsConnector` (monte par
 * `AppShell`, donc toujours vivant), et son resultat atterrit ici. Meme motif
 * que `matchLockStore` : module TS simple, abonnement par callback, pas de
 * librairie d'etat.
 */

export type OwnedOptionsState = {
  options: GroupSkinOption[];
  /** Un calcul est en cours — les selecteurs de synergie se desactivent. */
  isSyncing: boolean;
  /** Avancement 0-100, pour la barre de progression. */
  progress: number;
};

type Listener = (state: OwnedOptionsState) => void;

const EMPTY: OwnedOptionsState = {
  options: [],
  isSyncing: false,
  progress: 0,
};

const listeners = new Set<Listener>();
let state: OwnedOptionsState = EMPTY;

function emit() {
  for (const fn of listeners) fn(state);
}

export const ownedOptionsStore = {
  getState(): OwnedOptionsState {
    return state;
  },

  /**
   * Un seul mutateur, une seule garde d'egalite. Il y en avait cinq, chacun
   * avec sa propre comparaison (et `setOptions` n'en avait aucune) : c'est
   * exactement le genre d'ecart qui produit un rendu en trop ou un rendu
   * manquant selon le champ qu'on touche.
   */
  patch(next: Partial<OwnedOptionsState>): void {
    const merged = { ...state, ...next };
    const unchanged = (
      Object.keys(merged) as (keyof OwnedOptionsState)[]
    ).every((key) => merged[key] === state[key]);
    if (unchanged) return;
    state = merged;
    emit();
  },

  /** Sortie de room ou champion desverrouille : on ne garde pas un resultat
   *  qui ne correspond plus a rien. */
  reset(): void {
    ownedOptionsStore.patch(EMPTY);
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
