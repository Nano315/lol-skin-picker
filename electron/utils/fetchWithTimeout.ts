import fetch, { type RequestInit, type Response } from "node-fetch";

/**
 * Plafond par defaut pour les appels HTTP sortants (CommunityDragon, API
 * GitHub). Genereux : ces hotes sont parfois lents, on veut couper les
 * connexions mortes, pas les connexions lentes.
 */
export const DEFAULT_EXTERNAL_TIMEOUT_MS = 8000;

/**
 * fetch avec plafond de temps pour les hotes EXTERNES.
 *
 * Un `fetch` sans timeout ne rejette pas quand le pair accepte la connexion
 * puis se tait : la promesse reste pendante indefiniment. Un try/catch autour
 * n'y change rien, il attrape les rejets, pas les blocages. Quand un tel appel
 * se trouve sur le chemin d'une boucle de poll, c'est toute la boucle qui
 * s'arrete sans une seule ligne d'erreur.
 *
 * Pour le LCU (127.0.0.1), passer par `lcuFetch`, qui applique son propre
 * plafond en plus des garde-fous loopback.
 */
export async function fetchWithTimeout(
  url: string,
  timeoutMs: number = DEFAULT_EXTERNAL_TIMEOUT_MS,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal as RequestInit["signal"],
    });
  } finally {
    clearTimeout(timer);
  }
}
