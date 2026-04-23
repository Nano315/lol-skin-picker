import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Check, Download, Loader2, Sparkles, X } from "lucide-react";
import { useUpdateAvailability } from "@/features/hooks/useUpdateAvailability";
import { cn } from "@/lib/utils";

/**
 * Petite pastille emerald inseree dans la title bar a gauche des controles
 * de fenetre. Apparait des qu'un update est disponible (ou en cours de
 * download/installation) et reste visible tant que l'utilisateur ne l'a
 * pas applique.
 *
 * Suit exactement la meme logique de filtrage beta/release que le tray :
 * c'est le main process qui decide quel update est valide pour le canal
 * courant (cf. updaterHooks dans tray.ts), le renderer ne fait que
 * refleter l'etat broadcaste.
 */
export default function UpdateAvailableChip() {
  const { state, download, install } = useUpdateAvailability();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Ferme le popup au clic en dehors (pour pas qu'il reste ouvert quand
  // l'utilisateur retourne dans l'app).
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Ferme aussi sur Escape, classique.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const visible =
    state.status === "available" ||
    state.status === "downloading" ||
    state.status === "downloaded";

  if (!visible) return null;

  const channelLabel =
    state.channel === "beta" ? "Beta" : state.channel === "latest" ? "Stable" : "";
  const versionLabel = state.newVersion ? `v${state.newVersion}` : "Update";

  // Mapping etat -> contenu visuel de la pastille
  const chipContent = (() => {
    if (state.status === "downloading") {
      const pct = state.percent ?? 0;
      return (
        <>
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          <span>{pct}%</span>
        </>
      );
    }
    if (state.status === "downloaded") {
      return (
        <>
          <Check className="h-3 w-3" aria-hidden />
          <span>Install</span>
        </>
      );
    }
    return (
      <>
        <ArrowUp className="h-3 w-3" aria-hidden />
        <span>{versionLabel}</span>
      </>
    );
  })();

  const ariaLabel = (() => {
    if (state.status === "downloading")
      return `Downloading update ${state.percent ?? 0}%`;
    if (state.status === "downloaded")
      return `Update ${versionLabel} ready to install — click to install`;
    return `Update ${versionLabel} available — click for details`;
  })();

  return (
    <div
      ref={containerRef}
      className="no-drag relative flex h-full items-center pr-2"
    >
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel}
        aria-expanded={open}
        initial={reduced ? false : { opacity: 0, x: 8, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        whileHover={reduced ? undefined : { y: -1 }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        className={cn(
          "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5",
          "border border-emerald-400/30 bg-emerald-500/[0.12]",
          "text-[11px] font-semibold tracking-tight text-emerald-200",
          "shadow-[0_0_16px_-4px_rgba(16,185,129,0.4)]",
          "transition-colors duration-200",
          "hover:border-emerald-400/50 hover:bg-emerald-500/[0.18] hover:text-emerald-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40",
        )}
      >
        {/* Dot pulse a gauche pour attirer l'oeil — masque pendant le download
            pour eviter la collision visuelle avec le spinner. */}
        {state.status === "available" && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
        )}
        {chipContent}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Update details"
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute right-0 top-full z-[10000] mt-2 w-72 overflow-hidden",
              "rounded-2xl border border-white/[0.08] bg-[#0d0d12]/95 p-4",
              "shadow-glass backdrop-blur-xl",
            )}
          >
            {/* Top-edge highlight, comme dans TelemetryConsentModal */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] ring-1 ring-white/20">
                <Sparkles className="h-4 w-4 text-white" aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="m-0 text-sm font-bold leading-tight text-white">
                  {state.status === "downloaded"
                    ? "Update ready"
                    : state.status === "downloading"
                      ? "Downloading update"
                      : "Update available"}
                </h3>
                {state.newVersion && (
                  <p className="m-0 mt-0.5 text-xs text-white/60">
                    v{state.newVersion}
                    {channelLabel && (
                      <span className="ml-1.5 text-white/40">
                        ({channelLabel})
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>

            {state.currentVersion && (
              <p className="m-0 mt-3 text-[11px] text-white/40">
                Current: v{state.currentVersion}
              </p>
            )}

            {state.status === "downloading" && (
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-300"
                    style={{ width: `${state.percent ?? 0}%` }}
                  />
                </div>
                <p className="m-0 mt-1.5 text-[11px] text-white/50">
                  {state.percent ?? 0}% downloaded
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Later
              </button>
              {state.status === "downloaded" ? (
                <button
                  type="button"
                  onClick={() => {
                    void install();
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5",
                    "bg-gradient-to-b from-emerald-400 to-emerald-600 text-xs font-semibold text-white",
                    "shadow-[0_8px_24px_-8px_rgba(16,185,129,0.7)] ring-1 ring-white/20",
                    "transition-shadow duration-200 hover:shadow-[0_10px_28px_-6px_rgba(16,185,129,0.85)]",
                  )}
                >
                  <Check className="h-3 w-3" aria-hidden />
                  Install &amp; restart
                </button>
              ) : (
                <button
                  type="button"
                  disabled={state.status === "downloading"}
                  onClick={() => {
                    void download();
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5",
                    "bg-gradient-to-b from-emerald-400 to-emerald-600 text-xs font-semibold text-white",
                    "shadow-[0_8px_24px_-8px_rgba(16,185,129,0.7)] ring-1 ring-white/20",
                    "transition-shadow duration-200 hover:shadow-[0_10px_28px_-6px_rgba(16,185,129,0.85)]",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  {state.status === "downloading" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                      Downloading…
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3" aria-hidden />
                      Install now
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
