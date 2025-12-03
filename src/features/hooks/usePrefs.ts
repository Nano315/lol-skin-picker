import { useCallback, useMemo } from "react";

export function usePrefs() {
  const save = useCallback((k: "includeDefault" | "autoRoll" | "performanceMode", v: boolean) => {
    localStorage.setItem(`pref-${k}`, String(v));
    window.dispatchEvent(new CustomEvent("pref-changed", { detail: { key: k, value: v } }));
  }, []);

  const read = useCallback((k: "includeDefault" | "autoRoll" | "performanceMode") => {
    const raw = localStorage.getItem(`pref-${k}`);
    return raw !== null ? raw === "true" : null;
  }, []);

  return useMemo(
    () => ({ save, read }),
    [save, read]
  ); // Stable callbacks prevent Settings from re-running effects on every render.
}
