export function usePrefs() {
  type Key = "includeDefault" | "autoRoll" | "autoWard";

  const save = (k: Key, v: boolean) =>
    localStorage.setItem(`pref-${k}`, String(v));

  const read = (k: Key) => {
    const raw = localStorage.getItem(`pref-${k}`);
    return raw !== null ? raw === "true" : null;
  };

  return { save, read };
}
