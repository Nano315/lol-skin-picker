import { useCallback, useRef, useState } from "react";
import { api } from "@/features/api";

/**
 * La machine a etats d'un reroll : garde de re-entrance, action en cours,
 * temporisation post-action.
 *
 * Elle existait en deux exemplaires — `RerollActions` (fenetre principale) et
 * `CompanionSidecar` — avec les memes 450 ms, le meme `useRef` anti-double-clic
 * et le meme aiguillage a trois branches. Les deux avaient deja divergé sur la
 * condition d'activation, ce qui est exactement le probleme : la regle d'un
 * reroll ne devrait pas dependre de la fenetre qui l'affiche.
 *
 * Seule la PRESENTATION reste propre a chaque appelant : le sidecar tient dans
 * 260 px, la fenetre principale non.
 */

export type RerollKind = "both" | "skin" | "chroma";

/** Anti-spam + temps de laisser l'animation de splash se jouer. */
export const REROLL_COOLDOWN_MS = 450;

const REROLL_BY_KIND: Record<RerollKind, () => Promise<unknown>> = {
  both: () => api.rerollSkin(),
  skin: () => api.rerollSkinOnly(),
  chroma: () => api.rerollChroma(),
};

type UseRerollActionOptions = {
  /** L'utilisateur peut-il declencher un reroll maintenant ? */
  canAct: boolean;
  /** Le skin courant a-t-il des chromas ? Sans eux, "chroma" n'a pas de sens. */
  hasChromas: boolean;
  /** Rafraichissement de la selection apres un reroll reussi. */
  onChanged: () => void | Promise<void>;
};

export function useRerollAction({
  canAct,
  hasChromas,
  onChanged,
}: UseRerollActionOptions) {
  const [pending, setPending] = useState<RerollKind | null>(null);

  // Verrou synchrone : `pending` ne devient visible qu'au rendu suivant, deux
  // clics dans la meme frame passeraient tous les deux.
  const busyRef = useRef(false);

  // Les conditions sont relues au declenchement plutot que capturees, ce qui
  // rend `run` stable. Sans ca, le handler clavier de `RerollActions` devrait
  // se reabonner a chaque changement d'etat.
  const latest = useRef({ canAct, hasChromas, onChanged });
  latest.current = { canAct, hasChromas, onChanged };

  const run = useCallback(async (kind: RerollKind) => {
    const current = latest.current;
    if (busyRef.current || !current.canAct) return;
    if (kind === "chroma" && !current.hasChromas) return;

    busyRef.current = true;
    setPending(kind);
    try {
      await REROLL_BY_KIND[kind]();
      await current.onChanged();
      await new Promise((resolve) => setTimeout(resolve, REROLL_COOLDOWN_MS));
    } finally {
      busyRef.current = false;
      setPending(null);
    }
  }, []);

  return { pending, run };
}
