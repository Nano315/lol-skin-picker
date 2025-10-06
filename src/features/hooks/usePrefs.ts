export function usePrefs() {
  const save = (
    k: "includeDefault" | "includeDefaultChroma" | "autoRoll",
    v: boolean
  ) =>
    localStorage.setItem(`pref-${k}`, String(v));

  const read = (
    k: "includeDefault" | "includeDefaultChroma" | "autoRoll"
  ) => {
    const raw = localStorage.getItem(`pref-${k}`);
    return raw !== null ? raw === "true" : null;
  };

  return { save, read };
}
