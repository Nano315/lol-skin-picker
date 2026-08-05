import https from "node:https";
import fetch, {
  type RequestInfo,
  type RequestInit,
  type Response,
} from "node-fetch";

// Le LCU expose un certificat auto-signe sur 127.0.0.1. On desactive la
// validation TLS uniquement pour cet agent dedie, au lieu de neutraliser
// NODE_TLS_REJECT_UNAUTHORIZED pour tout le process.
const lcuAgent = new https.Agent({ rejectUnauthorized: false });

const LCU_HOST = "127.0.0.1";

// Le LCU est sur la loopback : une reponse saine arrive en quelques
// millisecondes. Un appel qui depasse ce delai n'attend pas le reseau, il
// attend un client qui ne repondra pas (fermeture brutale, socket a moitie
// ouverte pendant un patch). Sans plafond, la promesse ne se resout JAMAIS —
// ni resolve ni reject — et un `await lcuFetch(...)` dans une boucle de poll
// laisse celle-ci en attente definitive : l'app cesse silencieusement de
// detecter les champion selects jusqu'au redemarrage. Un try/catch ne protege
// pas de ca : il attrape les rejets, pas les blocages.
const DEFAULT_TIMEOUT_MS = 5000;

function isLcuUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === LCU_HOST && parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * fetch wrapper dedie aux appels vers le LCU (127.0.0.1).
 * Rejette toute URL qui n'est pas vers le LCU pour empecher un usage accidentel
 * sur un autre domaine avec validation TLS desactivee.
 */
export async function lcuFetch(
  url: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const urlStr = typeof url === "string" ? url : url.toString();
  if (!isLcuUrl(urlStr)) {
    throw new Error(
      `[lcuFetch] Refuse: URL hors LCU (attendu https://${LCU_HOST}, recu: ${urlStr})`
    );
  }
  const baseInit: RequestInit = {
    ...init,
    agent: lcuAgent,
    // La verification de l'URL ci-dessus ne couvre que la requete INITIALE.
    // node-fetch suit les redirections par defaut, et le ferait avec ce meme
    // agent : une reponse 302 du LCU vers un hote externe sortait donc du
    // perimetre loopback avec la validation TLS desactivee (et l'en-tete
    // Authorization attache). Aucun endpoint LCU utilise ici ne redirige :
    // on ne suit rien, et un 3xx devient une reponse non-ok que les appelants
    // traitent deja comme un echec.
    redirect: "manual",
  };

  // Un appelant qui fournit son propre signal pilote deja son cycle de vie :
  // on ne le remplace pas par le notre.
  if (init?.signal) {
    return fetch(url, baseInit);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    // Le timeout couvre l'etablissement de la connexion et les en-tetes. La
    // lecture du corps reste a la charge de l'appelant, mais sur la loopback
    // c'est le handshake qui bloque, pas le transfert.
    return await fetch(url, {
      ...baseInit,
      signal: controller.signal as RequestInit["signal"],
    });
  } finally {
    clearTimeout(timer);
  }
}

export { lcuAgent };
