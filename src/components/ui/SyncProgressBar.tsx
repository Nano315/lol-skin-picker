// src/components/ui/SyncProgressBar.tsx
import { motion, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SyncProgressBarProps = {
  /** 0..100 — values outside are clamped. */
  progress: number;
  label?: string;
};

/**
 * Thin progress bar for "computing skin synergies" and similar background
 * syncs. Track + fill use the accent gradient; completes in emerald. The
 * width update animates via framer-motion for a smooth transition.
 */
export function SyncProgressBar({ progress, label }: SyncProgressBarProps) {
  const reduced = useReducedMotion();
  const isComplete = progress >= 100;
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || (isComplete ? "Sync complete" : "Syncing")}
      className="w-full py-2"
    >
      <div className="mb-1.5 flex items-center justify-between text-xs text-white/70">
        <span className="inline-flex items-center gap-1.5">
          {isComplete ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-white/80" aria-hidden />
          )}
          {label || (isComplete ? "Sync complete" : "Syncing...")}
        </span>
        <span className="font-semibold text-white/90">{displayProgress}%</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          initial={false}
          animate={{ width: `${displayProgress}%` }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
          }
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            isComplete
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-accent to-accent-strong shadow-[0_0_12px_rgba(139,92,246,0.45)]"
          )}
        />
      </div>
    </div>
  );
}
