/**
 * Coachmark — small absolute-positioned callout that points at a UI target.
 *
 * Used for one-shot couche-3 hints (Reroll, Match Lock, Synergy panel). The
 * parent decides where to anchor (via `className`) — this component is
 * presentation-only and doesn't measure the target itself, which keeps it
 * lightweight and avoids layout thrash from observers.
 *
 * The arrow is a CSS triangle on the side closest to the target, so the
 * eye is led naturally from the callout to the thing being highlighted.
 *
 * Dismissal: click "Got it" → `onDismiss`. Parents can also wire a target
 * click to `onDismiss` so the coachmark disappears when the user does the
 * thing it was teaching them.
 */

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export type CoachmarkArrow = "top" | "bottom" | "left" | "right";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  /** Short attention-grabber, ~3-5 words. */
  title: string;
  /** Supporting copy, ~1-2 lines. */
  description: ReactNode;
  /** Side of the callout where the arrow points (toward the target). */
  arrow?: CoachmarkArrow;
  /**
   * Tailwind classes for absolute positioning relative to the parent. The
   * parent must be `relative`. Examples:
   *   - "top-2 right-2"                (top-right corner of card)
   *   - "bottom-full mb-3 right-0"     (above the parent, anchored right)
   *   - "left-full ml-3 top-1/2 -translate-y-1/2" (to the right of parent)
   */
  className?: string;
  /**
   * Override the arrow's position class. Useful when the callout anchors
   * away from the target's center — e.g. floating widgets in a viewport
   * corner where the default centered arrow points into empty space.
   * Pass the full Tailwind position pair (axis offset + side offset),
   * e.g. `"right-4 -bottom-1.5 border-b border-r"` for an arrow near the
   * right edge of the bottom side.
   */
  arrowClassName?: string;
  /** Override dismiss-button label. Defaults to "Got it". */
  ctaLabel?: string;
}

const ARROW_BASE =
  "absolute h-3 w-3 rotate-45 border-white/[0.08] bg-white/[0.04] backdrop-blur-xl";

const ARROW_POSITION: Record<CoachmarkArrow, string> = {
  // Arrow on the BOTTOM of the callout → callout sits ABOVE the target.
  bottom: "left-1/2 -translate-x-1/2 -bottom-1.5 border-b border-r",
  // Arrow on the TOP → callout BELOW the target.
  top: "left-1/2 -translate-x-1/2 -top-1.5 border-t border-l",
  // Arrow on the LEFT → callout to the RIGHT of the target.
  left: "top-1/2 -translate-y-1/2 -left-1.5 border-l border-b",
  // Arrow on the RIGHT → callout to the LEFT of the target.
  right: "top-1/2 -translate-y-1/2 -right-1.5 border-r border-t",
};

export function Coachmark({
  visible,
  onDismiss,
  title,
  description,
  arrow = "bottom",
  className,
  arrowClassName,
  ctaLabel = "Got it",
}: Props) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={title}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            // `w-[280px]` is intentional, not `max-w-[280px]`. Some parents
            // (like the floating MatchControls container, ~48px wide because
            // its only non-absolute child is the lock button) trigger CSS
            // shrink-to-fit on absolutely-positioned children and the
            // coachmark collapses to the width of its longest word. Fixed
            // width keeps the layout predictable across every anchor.
            //
            // Default `relative` so the arrow (absolute child of the
            // callout) anchors to the callout itself. Consumers that want
            // an out-of-flow callout (e.g. anchored to a floating widget)
            // pass `absolute ...` in `className` and twMerge replaces
            // `relative` with `absolute`. This avoids the previous bug
            // where rerollCoach / synergyCoach were `absolute` below the
            // bottom card on a page and ended up rendered outside the
            // viewport on anything below 1440p.
            "relative z-30 w-[280px] overflow-visible",
            "rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 shadow-glass backdrop-blur-xl",
            className
          )}
        >
          {/* Top-edge highlight matches GlassCard so coachmarks look like siblings */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent"
          />

          {/* CSS-triangle arrow pointing at the target. `arrowClassName`
              lets the parent shift the arrow when the callout is anchored
              to a corner instead of the target's center. */}
          <span
            aria-hidden
            className={cn(ARROW_BASE, arrowClassName ?? ARROW_POSITION[arrow])}
          />

          <div className="text-sm font-semibold leading-tight text-white">
            {title}
          </div>
          <p className="m-0 mt-1.5 text-xs leading-relaxed text-white/65">
            {description}
          </p>
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              {ctaLabel}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
