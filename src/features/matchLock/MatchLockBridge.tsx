import { useEffect } from "react";
import { api } from "@/features/api";
import { matchLockStore } from "./matchLockStore";

/**
 * Synchronise le match lock entre les fenetres.
 *
 * Le lock est bascule depuis deux endroits — le widget `MatchControls` de la
 * fenetre principale et le pied du sidecar de draft — et chaque fenetre a son
 * propre `matchLockStore` (module par processus de rendu). Le main process
 * arbitre : il rediffuse `match-lock-changed` a tout le monde, on l'applique
 * ici.
 *
 * A monter dans CHAQUE racine (AppShell et CompanionShell). L'etat initial est
 * relu au montage, sinon un sidecar ouvert apres coup afficherait "unlocked"
 * alors que le lock est actif.
 */
export function MatchLockBridge() {
  useEffect(() => {
    let cancelled = false;

    void api
      .getMatchLock()
      .then((locked) => {
        if (!cancelled) matchLockStore.applyRemote(locked);
      })
      .catch(() => {
        /* main transitoirement occupe : la rediffusion nous rattrapera */
      });

    const unsub = api.onMatchLock((locked) => {
      matchLockStore.applyRemote(locked);
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return null;
}
