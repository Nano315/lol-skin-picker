import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: "div" | "section" | "article" | "header";
  /** Use a mount-triggered animation instead of scroll-triggered (useful in
   *  Electron where there's rarely real scroll — default for this app). */
  onMount?: boolean;
};

/**
 * Entrance animation wrapper. `whileInView` by default (scroll-triggered) or
 * mount-triggered via `onMount`. Respects prefers-reduced-motion.
 *
 * Note: we deliberately *don't* animate `opacity` — only the `y` translate.
 * Reason: the GlassCard children rely on `backdrop-blur` to hide the
 * atmospheric MascotsLayer that sits beneath the content (z:1). During an
 * opacity fade the cards are translucent enough that the mascots visibly
 * bleed through, then pop "behind" only once opacity reaches 1. Keeping the
 * cards fully opaque from frame 1 solves that while preserving the slide.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.8,
  as = "div",
  onMount = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  const initial = reduced ? false : { y };
  const target = { y: 0 };
  const transition = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  if (onMount) {
    return (
      <MotionTag
        initial={initial}
        animate={target}
        transition={transition}
        className={cn(className)}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={initial}
      whileInView={target}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
