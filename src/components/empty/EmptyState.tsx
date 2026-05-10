/**
 * EmptyState — generic "the app is waiting on something external" card.
 *
 * Used across Solo / Premade / Library when the LoL Client isn't running, the
 * user isn't in champ select yet, or the relevant data hasn't loaded. Mirrors
 * the WelcomeFlow / TelemetryConsentModal visual language so all "waiting"
 * surfaces feel like siblings:
 *   - GlassCard wrapper with the same top-edge highlight
 *   - Large gradient icon medallion centered at the top
 *   - Title (rich, accepts <GradientText>)
 *   - Optional description paragraph
 *   - Optional status pill at the bottom with a colored pulsing dot
 *
 * No CTA on purpose: these states are resolved by an action OUTSIDE the app
 * (launching League, picking a queue). A button here would be misleading.
 */

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui";
import { cn } from "@/lib/utils";

export type EmptyStateTone = "warning" | "success" | "info" | "neutral";

const TONE_DOT: Record<EmptyStateTone, string> = {
  warning: "bg-amber-400",
  success: "bg-emerald-400",
  info: "bg-accent-strong",
  neutral: "bg-white/40",
};

const TONE_PILL: Record<EmptyStateTone, string> = {
  warning:
    "border-amber-400/30 bg-amber-500/[0.08] text-amber-100",
  success:
    "border-emerald-400/30 bg-emerald-500/[0.08] text-emerald-100",
  info: "border-accent/30 bg-accent/[0.08] text-white",
  neutral: "border-white/10 bg-white/[0.04] text-white/70",
};

interface Props {
  /** lucide icon node, sized 6 (h-6 w-6) — wrapped in a gradient medallion. */
  icon: ReactNode;
  /** Optional small uppercase label above the title. */
  eyebrow?: string;
  /** Title — rich (can drop in <GradientText> for emphasis). */
  title: ReactNode;
  /** Optional supporting copy. */
  description?: ReactNode;
  /** Optional live status pill at the bottom (pulses by default). */
  status?: {
    label: string;
    tone: EmptyStateTone;
  };
  className?: string;
}

export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  status,
  className,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard
        hover={false}
        className={cn(
          "flex flex-col items-center gap-4 px-6 py-10 text-center sm:px-10 sm:py-14",
          className
        )}
      >
        <span
          className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-3xl",
            "bg-gradient-to-br from-accent-strong to-accent shadow-accent-glow ring-1 ring-white/20",
            "text-white"
          )}
          aria-hidden
        >
          {icon}
        </span>

        {eyebrow && (
          <p className="m-0 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </p>
        )}

        <h2 className="m-0 max-w-[420px] text-2xl font-bold leading-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="m-0 max-w-[480px] text-sm leading-relaxed text-white/65">
            {description}
          </p>
        )}

        {status && (
          <div
            className={cn(
              "mt-1 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
              TONE_PILL[status.tone]
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                TONE_DOT[status.tone],
                !reduced && "animate-pulse-slow"
              )}
              aria-hidden
            />
            {status.label}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
