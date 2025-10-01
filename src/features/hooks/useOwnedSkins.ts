import { useEffect, useState } from "react";
import { api } from "../api";
import type { OwnedSkin } from "../types";

export function useOwnedSkins() {
  const [skins, setSkins] = useState<OwnedSkin[]>([]);
  useEffect(() => {
    api.getSkins().then(setSkins);
    const off = api.onSkins(setSkins);
    return () => { if (typeof off === "function") off(); };
  }, []);
  return skins;
}
