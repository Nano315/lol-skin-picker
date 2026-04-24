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
  return fetch(url, { ...init, agent: lcuAgent });
}

export { lcuAgent };
