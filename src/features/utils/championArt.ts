/**
 * URLs des visuels de champion servis par Data Dragon.
 *
 * L'arithmetique `skinId - championId * 1000` et l'hote etaient recopies dans
 * cinq composants. Deux d'entre eux avaient perdu l'`encodeURIComponent` que
 * les trois autres appliquent — or l'alias peut venir d'un pair par
 * `room-state` ou de CommunityDragon, et la CSP `img-src` borne l'HOTE, pas le
 * chemin. Passer par un seul constructeur fait voyager la garde avec l'URL.
 */

/**
 * - `splash` : illustration pleine largeur (16:9).
 * - `loading` : portrait vertical, centre sur le champion, bien plus leger.
 * - `tiles` : vignette carree.
 */
export type ChampionArtKind = "splash" | "loading" | "tiles";

const DDRAGON_CHAMPION = "https://ddragon.leagueoflegends.com/cdn/img/champion";

/**
 * Numero du skin chez Data Dragon. `0` est le skin de base : les ids du LCU
 * sont `championId * 1000 + index`.
 */
export function skinIndexOf(championId: number, skinId: number): number {
  return skinId - championId * 1000;
}

export function championArtUrl(
  kind: ChampionArtKind,
  championAlias: string,
  skinIndex: number
): string {
  if (!championAlias) return "";
  return `${DDRAGON_CHAMPION}/${kind}/${encodeURIComponent(
    championAlias
  )}_${skinIndex}.jpg`;
}
