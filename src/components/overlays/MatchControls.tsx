/**
 * Floating session-level controls. Currently exposes a single toggle (Match
 * Lock) but is designed to host more per-game options later (auto-decline
 * invites, focus mode, etc.) without a re-architecture.
 *
 * Anchors bottom-left or bottom-right based on the user pref (Settings →
 * Quick controls position). Always mounted via AppShell so it persists
 * across route changes.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lock, Unlock, X, Clock } from "lucide-react";
import { useMatchLock } from "@/features/matchLock/useMatchLock";
import { useWidgetSide } from "@/features/matchLock/widgetSide";
import { useGameflow } from "@/features/hooks/useGameflow";
import { Toggle } from "@/components/ui";
import { matchLockStore } from "@/features/matchLock/matchLockStore";
import { cn } from "@/lib/utils";

const IN_MATCH_PHASES = new Set([
  "ChampSelect",
  "InProgress",
  "WaitingForStats",
  "PreEndOfGame",
  "EndOfGame",
]);

// Phases that indicate the user actually entered a game (post-draft). The
// match lock auto-reset only fires after leaving one of these — otherwise a
// champ-select dodge would silently disarm the lock that the user set up for
// the next try.
const POST_GAME_PHASES = new Set([
  "InProgress",
  "WaitingForStats",
  "PreEndOfGame",
  "EndOfGame",
]);

export default function MatchControls() {
  const { locked, setLocked } = useMatchLock();
  const [side] = useWidgetSide();
  const phase = useGameflow();
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPhaseRef = useRef<string | null>(null);

  const inMatch = IN_MATCH_PHASES.has(phase);

  // Auto-reset when leaving the post-game phases (per-game default). A
  // ChampSelect → Lobby transition (dodge) intentionally does NOT reset:
  // the user's lock should survive into the next attempt.
  useEffect(() => {
    const prev = prevPhaseRef.current;
    if (prev && POST_GAME_PHASES.has(prev) && !POST_GAME_PHASES.has(phase)) {
      matchLockStore.setLocked(false);
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  // Click outside to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ESC to close.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed bottom-5 z-40",
        side === "right" ? "right-5" : "left-5"
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 32 }
            }
            className={cn(
              "absolute bottom-full mb-3 w-[300px] overflow-hidden rounded-3xl border border-white/[0.08] bg-glass-surface shadow-glass backdrop-blur-xl",
              side === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="flex items-start justify-between p-5 pb-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-strong">
                  Match
                </span>
                <h3 className="m-0 mt-0.5 text-lg font-bold text-white">
                  This Game
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-white/40 transition-colors duration-150 hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="border-t border-white/[0.06] px-5 py-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    locked
                      ? "bg-accent/20 text-accent"
                      : "bg-white/[0.04] text-white/40"
                  )}
                >
                  {locked ? (
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Unlock className="h-3.5 w-3.5" aria-hidden />
                  )}
                </span>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">
                      Lock skin this match
                    </div>
                    <p className="m-0 mt-1 text-xs leading-relaxed text-white/50">
                      Owner can't change your skin during champ select.
                    </p>
                  </div>
                  <Toggle
                    checked={locked}
                    onChange={setLocked}
                    aria-label="Lock skin this match"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-t border-white/[0.06] bg-white/[0.01] px-5 py-2.5 text-[11px] text-white/40">
              <Clock className="h-3 w-3" aria-hidden />
              {inMatch
                ? "Active for this match"
                : "Will apply to your next match"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={reduced ? undefined : { y: -2, scale: 1.05 }}
        whileTap={reduced ? undefined : { scale: 0.95 }}
        aria-label={
          locked ? "Match locked — open controls" : "Open match controls"
        }
        aria-expanded={open}
        className={cn(
          "flex items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200",
          locked
            ? "h-12 w-12 border-accent/40 bg-gradient-to-br from-accent/30 to-accent-strong/20 text-accent shadow-accent-glow animate-pulse-slow"
            : "h-11 w-11 border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white"
        )}
      >
        {locked ? (
          <Lock className="h-4 w-4" aria-hidden />
        ) : (
          <Unlock className="h-4 w-4" aria-hidden />
        )}
      </motion.button>
    </div>
  );
}
