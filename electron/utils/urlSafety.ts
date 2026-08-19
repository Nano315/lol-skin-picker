/**
 * Assainissement des valeurs interpolees dans une URL construite cote main.
 *
 * Le process principal fait des requetes vers deux cibles sensibles :
 *   - le League Client sur 127.0.0.1, AUTHENTIFIE en Basic ;
 *   - CommunityDragon en HTTPS.
 *
 * Les identifiants qui composent ces chemins arrivent du renderer par IPC (ou
 * d'une reponse reseau). Interpoles bruts, `"1/../../riotclient/kill"` ou
 * `"1?x=y"` sortaient du endpoint prevu : traversee de chemin vers un autre
 * endpoint LCU, avec les credentials attaches.
 *
 * Pour un identifiant, contraindre a un ENTIER BORNE est plus fort
 * qu'`encodeURIComponent` : la valeur ne peut plus contenir de separateur, quel
 * que soit l'encodage. `encodeSegment` reste disponible pour les rares segments
 * legitimement textuels.
 */

/** Borne haute large : les ids Riot (champions, skins, chromas) restent bien en dessous. */
const MAX_ENTITY_ID = 1_000_000_000;

/**
 * Chaine composee UNIQUEMENT de chiffres, 10 au maximum.
 *
 * On ne passe volontairement pas par `Number()` sur une valeur arbitraire :
 * `Number(null)`, `Number([])` et `Number("")` valent 0, `Number(true)` vaut 1,
 * et `Number("1e3")` vaut 1000. Toutes ces valeurs auraient produit un
 * identifiant "valide" a partir d'une entree qui n'en est pas un.
 */
const DIGITS_ONLY_RE = /^\d{1,10}$/;

/**
 * Cœur de la validation : n'accepte qu'un `number` entier borne, ou une chaine
 * strictement numerique.
 */
function coerceUrlId(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 0 || value > MAX_ENTITY_ID) return null;
    return value;
  }
  if (typeof value === "string" && DIGITS_ONLY_RE.test(value)) {
    const n = Number(value);
    return n <= MAX_ENTITY_ID ? n : null;
  }
  return null;
}

/**
 * Convertit une valeur en identifiant numerique sur pour un chemin d'URL.
 *
 * @throws si la valeur n'est pas un entier positif borne.
 */
export function toUrlId(value: unknown, label = "id"): number {
  const n = coerceUrlId(value);
  if (n === null) {
    throw new Error(
      `[urlSafety] ${label} invalide: ${JSON.stringify(value)} (entier attendu entre 0 et ${MAX_ENTITY_ID})`
    );
  }
  return n;
}

/**
 * Variante non levante : renvoie `null` au lieu de lever.
 * Pratique dans les handlers IPC qui degradent silencieusement.
 */
export function tryUrlId(value: unknown): number | null {
  return coerceUrlId(value);
}

/**
 * Encode un segment de chemin textuel.
 *
 * `encodeURIComponent` echappe `/`, `?`, `#` et `..` reste inoffensif une fois
 * les separateurs encodes.
 */
export function encodeSegment(value: unknown, label = "segment"): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 128) {
    throw new Error(
      `[urlSafety] ${label} invalide: chaine non vide de 128 caracteres max attendue`
    );
  }
  return encodeURIComponent(value);
}

/**
 * Hotes vers lesquels un lien peut etre ouvert — dans le navigateur externe.
 *
 * Liste unique, partagee par les DEUX chemins qui peuvent ouvrir un lien :
 * le handler IPC `open-external` et le `setWindowOpenHandler` installe sur
 * chaque fenetre. Les deux avaient leur propre copie, et elles avaient deja
 * diverge (aptabase absent d'un cote) : un lien s'ouvrait depuis un chemin et
 * etait silencieusement bloque depuis l'autre.
 */
export const ALLOWED_EXTERNAL_HOSTS = new Set<string>([
  "discord.com",
  "www.discord.com",
  "github.com",
  "www.github.com",
  "raw.githubusercontent.com",
  "communitydragon.org",
  "www.communitydragon.org",
  "aptabase.com",
  "www.aptabase.com",
  "riotgames.com",
  "www.riotgames.com",
]);

/**
 * Un lien externe doit etre en HTTPS ET pointer vers un hote de la liste.
 *
 * On compare le `hostname` parse, jamais un prefixe de chaine : un
 * `startsWith("https://github.com")` serait contourne par
 * `https://github.com.evil.com`.
 */
export function isAllowedExternalUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  return ALLOWED_EXTERNAL_HOSTS.has(parsed.hostname.toLowerCase());
}
