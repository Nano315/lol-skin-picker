// src/features/hooks/useSummonerName.ts
import { useEffect, useState } from "react";
import { api } from "../api";

export function useSummonerName(status: string) {
  const [name, setName] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Si on n’est pas connecte → reset du nom et pas d’abonnement
    if (status !== "connected") {
      setName("");
      return;
    }

    // 1) on recupere la valeur actuelle (si SkinsService l’a deja)
    async function init() {
      try {
        const raw = await api.getSummonerName();
        if (!cancelled) {
          setName((raw ?? "").trim());
        }
      } catch {
        if (!cancelled) {
          setName("");
        }
      }
    }
    void init();

    // 2) on s’abonne aux futurs changements pousses par le main
    const unsub =
      api.onSummonerName &&
      api.onSummonerName((n) => {
        if (!cancelled) {
          setName((n ?? "").trim());
        }
      });

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [status]);

  return name;
}
