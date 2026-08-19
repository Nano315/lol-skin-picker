/**
 * "Pas cette draft" — l'etat de la croix du sidecar.
 *
 * Ephemere (jamais persiste) : fermer le sidecar vaut pour la draft en cours,
 * pas pour les suivantes. C'est `app.ts` qui remet le drapeau a zero quand la
 * phase quitte la champ select.
 *
 * Ca vit ici, et non dans un `hideCompanionWindow()` appele depuis le handler
 * IPC, parce que la fermeture est une ENTREE de la machine a etats et non un
 * effet de bord : `computePresentation` doit pouvoir etre rejoue a tout moment
 * (changement de preference, reconnexion du client) et retomber sur la meme
 * decision. Un `hide()` direct etait invisible pour elle, donc perdu au premier
 * recalcul — et il obligeait a redire la regle de vie des raccourcis a un
 * deuxieme endroit.
 */

let dismissed = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function isCompanionDismissed(): boolean {
  return dismissed;
}

/** Croix du sidecar. */
export function dismissCompanion(): void {
  if (dismissed) return;
  dismissed = true;
  notify();
}

/** Fin de la draft : la croix ne vaut plus. */
export function clearCompanionDismissal(): void {
  if (!dismissed) return;
  dismissed = false;
  notify();
}

/** S'abonner aux changements. Renvoie la fonction de desabonnement. */
export function onCompanionDismissalChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
