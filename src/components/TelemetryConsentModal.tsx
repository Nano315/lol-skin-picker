import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button, GradientText } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * First-run telemetry opt-in overlay. Lightweight wrapper around a glass card
 * so the first thing the user sees already matches the vitrine DA.
 */
export function TelemetryConsentModal({ onAccept, onDecline }: Props) {
  const reduced = useReducedMotion();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        aria-hidden
      />

      {/* Modal */}
      <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="telemetry-title"
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto relative w-full max-w-md overflow-hidden",
            "rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 shadow-glass backdrop-blur-xl"
          )}
        >
          {/* Top-edge gradient highlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-strong to-accent shadow-accent-glow ring-1 ring-white/20">
              <Sparkles className="h-5 w-5 text-white" aria-hidden />
            </span>
            <h2
              id="telemetry-title"
              className="m-0 text-xl font-bold leading-tight text-white"
            >
              Help improve <GradientText>SkinPicker</GradientText>?
            </h2>
          </div>

          <p className="m-0 text-sm leading-relaxed text-white/80">
            By enabling telemetry, you help us improve the app by sharing
            anonymous usage data and crash reports.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/[0.08] px-3 py-1.5 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            No personal data is ever collected.
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <Button variant="secondary" size="md" onClick={onDecline}>
              No thanks
            </Button>
            <Button variant="primary" size="md" onClick={onAccept}>
              Enable
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
