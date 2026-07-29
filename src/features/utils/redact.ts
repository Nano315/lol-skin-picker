/**
 * Masquage des identifiants personnels avant ecriture dans les logs.
 *
 * `window.log` transite par electron-log, qui ecrit sur DISQUE
 * (`%APPDATA%/<app>/logs`). Un PUUID est un identifiant Riot stable et
 * reidentifiant ; celui des AMIS l'est aussi, et ces personnes n'ont consenti a
 * rien. Les logs sont par ailleurs les fichiers qu'un utilisateur joint le plus
 * volontiers a un rapport de bug.
 *
 * On garde assez de caracteres pour correler deux lignes entre elles pendant un
 * debug, pas assez pour reidentifier quelqu'un.
 */

/**
 * `abcdefgh…xyz` -> `abcdef…(78)`
 *
 * @param puuid identifiant a masquer
 */
export function redactPuuid(puuid: string | null | undefined): string {
  if (typeof puuid !== "string" || puuid.length === 0) return "(absent)";
  if (puuid.length <= 6) return `…(${puuid.length})`;
  return `${puuid.slice(0, 6)}…(${puuid.length})`;
}

/**
 * Masque un pseudo Riot : premiere lettre + longueur.
 * Utile quand on veut distinguer deux joueurs dans une trace sans nommer
 * personne.
 */
export function redactName(name: string | null | undefined): string {
  if (typeof name !== "string" || name.length === 0) return "(absent)";
  return `${name.slice(0, 1)}…(${name.length})`;
}
