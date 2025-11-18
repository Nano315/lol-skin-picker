import { useEffect, useState } from "react";
import { api } from "../api";

export function useSummonerName() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    api
      .getSummonerName()
      .then((n) => {
        const trimmed = (n ?? "").trim();
        setName(trimmed || null);
      })
      .catch(() => setName(null));
  }, []);

  return name;
}
