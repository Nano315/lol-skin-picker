import { useCallback, useMemo } from "react";

export function usePrefs() {
  const save = useCallback((k: "includeDefault" | "autoRoll", v: boolean) => {
    localStorage.setItem(`pref-${k}`, String(v));
  }, []);

  const read = useCallback((k: "includeDefault" | "autoRoll") => {
    const raw = localStorage.getItem(`pref-${k}`);
    return raw !== null ? raw === "true" : null;
  }, []);

  return useMemo(
    () => ({ save, read }),
    [save, read]
  ); // Stable callbacks prevent Settings from re-running effects on every render.
}
