/**
 * Quelle fenetre doit etre visible, et quand.
 *
 * Avant ce module, la reponse etait eparpillee dans trois endroits d'`app.ts`
 * qui appelaient chacun `show()` + `maximize()` avec leurs propres conditions
 * (connexion LCU, changement de phase, seconde instance). Ajouter le sidecar
 * aurait fait un quatrieme cas a garder synchronise avec les trois autres.
 *
 * La regle vit donc ici, sous forme de fonction PURE : aucun import Electron,
 * aucun effet de bord, donc testable sans mocker quoi que ce soit. `app.ts` se
 * contente de fournir les entrees et d'appliquer la sortie.
 */

export type WindowVisibility = "shown" | "hidden";

export type PresentationInput = {
  /** Preference utilisateur : le sidecar de draft est-il active ? */
  companionEnabled: boolean;
  /** Le client League est-il joignable ? */
  lcuConnected: boolean;
  /** Phase gameflow courante (valeur brute du LCU, "Unknown" au demarrage). */
  phase: string;
  /**
   * L'utilisateur a ferme le sidecar avec la croix pour CETTE draft.
   * Remis a zero des que la phase quitte la champ select.
   */
  companionDismissed: boolean;
};

export type PresentationState = {
  main: WindowVisibility;
  companion: WindowVisibility;
};

/**
 * Phase pendant laquelle le joueur est en partie (ou sur l'ecran de
 * chargement). Rien de SkinPicker ne doit etre affiche a ce moment : ni la
 * fenetre principale (elle recouvrirait le jeu), ni le sidecar — on ne dessine
 * jamais par-dessus le jeu lui-meme.
 */
const IN_GAME_PHASE = "InProgress";

/** Seule phase ou le sidecar a une raison d'exister. */
const DRAFT_PHASE = "ChampSelect";

const HIDDEN: PresentationState = {
  main: "hidden",
  companion: "hidden",
};

export function computePresentation(
  input: PresentationInput
): PresentationState {
  // Client ferme : plus rien a piloter, on efface tout. C'est aussi ce qui
  // garantit qu'un sidecar ne survit pas a la fermeture du client.
  if (!input.lcuConnected) return HIDDEN;

  // En partie : tout disparait. Cette regle passe AVANT celle du sidecar,
  // sinon un `companionEnabled` suffirait a laisser une fenetre par-dessus le
  // jeu.
  if (input.phase === IN_GAME_PHASE) return HIDDEN;

  // Draft avec le sidecar active : c'est lui qui prend la main, et la fenetre
  // principale s'efface. Elle est MASQUEE, jamais fermee — l'arbre React reste
  // monte, ce dont depend le pipeline premade (`sendOwnedOptions` vit dans un
  // effet de la route /premade).
  if (input.companionEnabled && input.phase === DRAFT_PHASE) {
    // Croix cliquee : le sidecar part, mais on ne fait PAS remonter la fenetre
    // principale a la place. Elle est maximisee — elle recouvrirait la draft
    // que l'utilisateur vient justement de demander a ne pas encombrer.
    // "Pas cette fois" veut dire rien du tout, pas "l'autre fenetre".
    if (input.companionDismissed) return HIDDEN;
    return { main: "hidden", companion: "shown" };
  }

  // Tout le reste (lobby, matchmaking, fin de partie, phase inconnue au
  // demarrage) : comportement historique, la fenetre principale en grand.
  return { main: "shown", companion: "hidden" };
}
