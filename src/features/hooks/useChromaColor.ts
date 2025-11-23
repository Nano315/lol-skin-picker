import { useEffect, useState } from "react";
import type { Selection } from "../types";
import { computeChromaColor } from "../chromaColor";

export function useChromaColor(selection: Selection) {
  const [chromaColor, setChromaColor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const color = await computeChromaColor({
        championId: selection.championId,
        skinId: selection.skinId,
        chromaId: selection.chromaId,
      });

      if (!cancelled) {
        setChromaColor(color);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [selection.championId, selection.skinId, selection.chromaId]);

  return chromaColor;
}
