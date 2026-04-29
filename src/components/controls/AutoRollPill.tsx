import { useEffect, useState } from "react";
import { api } from "@/features/api";
import { usePrefs } from "@/features/hooks/usePrefs";
import { cn } from "@/lib/utils";

/**
 * Pill toggle "Auto-roll on/off" pour le trailing du CardHeader
 * de la section Reroll. Source de vérité = backend, mais on lit le pref
 * local d'abord pour éviter un flash. Largeur fixe pour qu'on/off
 * n'induisent pas de shift de layout.
 */
export default function AutoRollPill() {
  const { save: savePref, read: readPref } = usePrefs();
  const [active, setActive] = useState<boolean>(() => readPref("autoRoll") ?? true);

  useEffect(() => {
    let cancelled = false;
    api
      .getAutoRoll()
      .then((v) => {
        if (!cancelled) setActive(!!v);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = () => {
    const next = !active;
    setActive(next);
    savePref("autoRoll", next);
    void api.setAutoRoll(next).catch(() => {});
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={toggle}
      title={
        active
          ? "Disable auto-roll on champion lock"
          : "Enable auto-roll on champion lock"
      }
      className={cn(
        // self-start + -mt-1 : remonte la pill dans le coin sup. droit
        // (sinon items-center du parent la centre contre la pile titre).
        // min-w-[7.5rem] + justify-center : pas de shift on/off.
        "self-start -mt-1 inline-flex min-w-[7.5rem] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        active
          ? "bg-accent/15 text-accent ring-1 ring-accent/40 hover:bg-accent/20"
          : "bg-white/[0.04] text-ink/70 ring-1 ring-white/10 hover:bg-white/[0.07] hover:text-white"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-accent animate-pulse-slow" : "bg-white/40"
        )}
      />
      Auto-roll {active ? "on" : "off"}
    </button>
  );
}
