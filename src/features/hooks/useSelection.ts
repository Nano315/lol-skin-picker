import { useEffect, useState } from "react";
import { api } from "../api";
import type { Selection } from "../types";

export function useSelection() {
  const [selection, setSelection] = useState<Selection>({
    championId: 0,
    championAlias: "",
    skinId: 0,
    chromaId: 0,
  });

  useEffect(() => {
    api.getSelection().then(setSelection);
    const off = api.onSelection(setSelection);
    return () => { if (typeof off === "function") off(); };
  }, []);

  return [selection, setSelection] as const;
}
