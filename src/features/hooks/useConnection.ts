// src/features/hooks/useConnection.ts
import { useEffect, useState } from "react";
import { api } from "../api";

type ConnectionStatus = "unknown" | "connected" | "disconnected";

export function useConnection() {
  const [status, setStatus] = useState<ConnectionStatus>("unknown");
  const [iconId, setIconId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubStatus: (() => void) | null = null;
    let unsubIcon: (() => void) | null = null;

    async function init() {
      try {
        // 1) etat initial
        const [initialStatus, initialIcon] = await Promise.all([
          api.getStatus(),
          api.getSummonerIcon().catch(() => null),
        ]);

        if (cancelled) return;

        setStatus(initialStatus === "connected" ? "connected" : "disconnected");

        if (typeof initialIcon === "number") {
          setIconId(initialIcon);
        }
      } catch {
        if (!cancelled) {
          setStatus("disconnected");
        }
      }

      // 2) abonnement aux updates temps reel
      unsubStatus = api.onStatus((next) => {
        setStatus(next === "connected" ? "connected" : "disconnected");
      });

      unsubIcon = api.onSummonerIcon((id) => {
        setIconId(id);
      });
    }

    void init();

    return () => {
      cancelled = true;
      unsubStatus?.();
      unsubIcon?.();
    };
  }, []);

  return { status, iconId };
}
