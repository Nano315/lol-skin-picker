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

/**
 * Extrait le token de couleur d'un nom de chroma du LCU.
 *
 * Les noms arrivent sous la forme "Bard Cafe Chouchous (turquoise)" : seul ce
 * qui est entre parentheses nous interesse, le nom du skin etant deja affiche
 * a cote. Sans parenthese, on renvoie la chaine complete.
 *
 * Il y en avait quatre copies (Solo, ChromaBalls, ChampionDetail, sidecar) :
 * le format vient du LCU, donc un changement en amont les cassait toutes les
 * quatre a la fois, et il fallait penser aux quatre pour le corriger.
 */
export function extractChromaColor(fullName: string): string {
  const match = fullName.match(/\(([^)]+)\)/);
  const raw = (match?.[1] ?? fullName).trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
