const hexToRgba = (h: string, alpha = 0.5) => {
  const res = /^#?([0-9a-f]{6})$/i.exec(h);
  if (!res) return null;
  const int = parseInt(res[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * Renvoie EXACTEMENT la même couleur que useChromaColor,
 * mais dans une fonction utilitaire async réutilisable.
 */
export async function computeChromaColor(params: {
  championId: number;
  skinId: number;
  chromaId: number;
}): Promise<string | null> {
  const { championId, skinId, chromaId } = params;

  // Pas de chroma => pas de couleur
  if (!chromaId) return null;

  const pickHex = (arr?: unknown) =>
    Array.isArray(arr) && typeof arr[0] === "string"
      ? (arr[0] as string)
      : null;

  // 1) chroma direct
  try {
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/chromas/${chromaId}.json`;
    const data = await fetch(url).then((r) => (r.ok ? r.json() : null));
    const hex =
      pickHex(data?.colorsHexPrefixed) ||
      pickHex(data?.colorsHex) ||
      pickHex(data?.colors);
    if (hex) {
      return hexToRgba(hex);
    }
  } catch {
    /* ignore */
  }

  // 2) fallback via champion
  if (!championId || !skinId) return null;

  try {
    type CChroma = { id: number; colors?: string[] };
    type CSkin = { id: number; chromas?: CChroma[] };
    type CChamp = { skins?: CSkin[] };
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;
    const champ: CChamp = await fetch(url).then((r) => r.json());
    const skin = champ.skins?.find((s) => s.id === skinId);
    const chroma = skin?.chromas?.find((c) => c.id === chromaId);
    const hex = (chroma?.colors && chroma.colors[0]) || null;
    return hex ? hexToRgba(hex) : null;
  } catch {
    return null;
  }
}
