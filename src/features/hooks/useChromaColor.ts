import { useEffect, useState } from "react";
import type { Selection } from "../types";

const hexToRgba = (h: string, alpha = 0.5) => {
  const res = /^#?([0-9a-f]{6})$/i.exec(h);
  if (!res) return null;
  const int = parseInt(res[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

export function useChromaColor(selection: Selection) {
  const [chromaColor, setChromaColor] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!selection.chromaId) {
        setChromaColor(null);
        return;
      }
      const pickHex = (arr?: unknown) =>
        Array.isArray(arr) && typeof arr[0] === "string"
          ? (arr[0] as string)
          : null;

      // 1) chroma direct
      try {
        const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/chromas/${selection.chromaId}.json`;
        const data = await fetch(url).then((r) => (r.ok ? r.json() : null));
        const hex =
          pickHex(data?.colorsHexPrefixed) ||
          pickHex(data?.colorsHex) ||
          pickHex(data?.colors);
        if (hex) {
          setChromaColor(hexToRgba(hex));
          return;
        }
      } catch {
        /* ignore */
      }

      // 2) fallback via champion
      if (!selection.championId || !selection.skinId) {
        setChromaColor(null);
        return;
      }
      try {
        type CChroma = { id: number; colors?: string[] };
        type CSkin = { id: number; chromas?: CChroma[] };
        type CChamp = { skins?: CSkin[] };
        const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${selection.championId}.json`;
        const champ: CChamp = await fetch(url).then((r) => r.json());
        const skin = champ.skins?.find((s) => s.id === selection.skinId);
        const chroma = skin?.chromas?.find((c) => c.id === selection.chromaId);
        const hex = (chroma?.colors && chroma.colors[0]) || null;
        setChromaColor(hex ? hexToRgba(hex) : null);
      } catch {
        setChromaColor(null);
      }
    }
    run();
  }, [selection.championId, selection.skinId, selection.chromaId]);

  return chromaColor;
}
