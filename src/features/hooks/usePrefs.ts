import { useCallback, useMemo } from "react";

// Re-export type for use in other components

export type PrefKey = "includeDefault" | "autoRoll" | "performanceMode" | "notificationSound";

export function usePrefs() {
  const save = useCallback((k: PrefKey, v: boolean) => {
    localStorage.setItem(`pref-${k}`, String(v));
    window.dispatchEvent(new CustomEvent("pref-changed", { detail: { key: k, value: v } }));
  }, []);

  const read = useCallback((k: PrefKey) => {
    const raw = localStorage.getItem(`pref-${k}`);
    return raw !== null ? raw === "true" : null;
  }, []);

  return useMemo(
    () => ({ save, read }),
    [save, read]
  ); // Stable callbacks prevent Settings from re-running effects on every render.
}
