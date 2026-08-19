import { useSyncExternalStore } from "react";
import { ownedOptionsStore, type OwnedOptionsState } from "./ownedOptionsStore";

/**
 * Lecture du resultat produit par `OwnedOptionsConnector`.
 *
 * Purement passif : le calcul tourne au niveau de `AppShell`, pas ici. Monter
 * ce hook dans plusieurs composants ne declenche donc aucun travail
 * supplementaire.
 *
 * `useSyncExternalStore` plutot qu'un `useState` + `useEffect` : c'est lui qui
 * ferme la fenetre entre le premier rendu et l'abonnement, sans avoir a la
 * rattraper a la main. Meme choix que `useInvitations` / `useOnlineFriends`.
 */
export function useOwnedOptions(): OwnedOptionsState {
  return useSyncExternalStore(
    ownedOptionsStore.subscribe,
    ownedOptionsStore.getState
  );
}
