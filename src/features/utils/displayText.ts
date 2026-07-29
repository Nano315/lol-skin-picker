/**
 * Bornage des textes venant du reseau avant affichage.
 *
 * Le serveur borne deja les pseudos (32 caracteres) et les noms de skin line
 * (128) depuis la vague 1 de l'audit. Ce garde-fou est de la defense en
 * profondeur cote client : le renderer ne doit pas dependre du bon comportement
 * du serveur pour rester utilisable. Un pair (ou un serveur compromis, ou une
 * version anterieure du serveur) qui enverrait une chaine demesuree ne doit pas
 * pouvoir defigurer ou figer l'interface de toute la room.
 */

/** Longueur max d'un pseudo affiche. */
export const MAX_DISPLAY_NAME = 24;
/** Longueur max d'un nom de skin line affiche. */
export const MAX_DISPLAY_SKIN_LINE = 40;

/**
 * Tronque une chaine pour l'affichage, avec une ellipse si elle a ete coupee.
 *
 * Utilise `Array.from` pour compter en points de code : couper au milieu d'une
 * paire de substitution (emoji) produirait un caractere de remplacement.
 */
export function truncateForDisplay(
  value: unknown,
  max: number,
  fallback = ""
): string {
  if (typeof value !== "string" || value.length === 0) return fallback;
  const chars = Array.from(value);
  if (chars.length <= max) return value;
  return `${chars.slice(0, max).join("")}…`;
}

/** Raccourci pour un pseudo de joueur. */
export function displayName(value: unknown, fallback = "Joueur"): string {
  return truncateForDisplay(value, MAX_DISPLAY_NAME, fallback);
}

/** Raccourci pour un nom de skin line. */
export function displaySkinLineName(value: unknown, fallback = "Skin line"): string {
  return truncateForDisplay(value, MAX_DISPLAY_SKIN_LINE, fallback);
}
