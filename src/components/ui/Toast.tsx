import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}

const VARIANTS: Record<
  ToastType,
  { icon: LucideIcon; border: string; glow: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-400/40",
    glow: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(34,197,94,0.18)]",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: XCircle,
    border: "border-rose-400/40",
    glow: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(239,68,68,0.18)]",
    iconColor: "text-rose-400",
  },
  info: {
    icon: Info,
    border: "border-sky-400/40",
    glow: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(59,130,246,0.18)]",
    iconColor: "text-sky-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-400/40",
    glow: "shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(249,115,22,0.18)]",
    iconColor: "text-amber-400",
  },
};

/**
 * Glass toast card. Hovering pauses auto-dismiss. Framer Motion handles
 * slide-in/out from the top-right of the viewport; respects reduced-motion.
 */
export function Toast({
  id,
  type,
  message,
  duration = 5000,
  onDismiss,
}: ToastProps) {
  const reduced = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const variant = VARIANTS[type];
  const Icon = variant.icon;

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for exit animation to complete before removing from the stack.
    setTimeout(() => {
      onDismiss(id);
    }, 240);
  }, [id, onDismiss]);

  useEffect(() => {
    if (isPaused || duration <= 0) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, isPaused, handleDismiss]);

  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, x: 48, scale: 0.96 }}
      animate={
        isExiting
          ? { opacity: 0, x: 48, scale: 0.96 }
          : { opacity: 1, x: 0, scale: 1 }
      }
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3",
        "bg-[rgba(20,20,25,0.82)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent",
        "relative",
        variant.border,
        variant.glow
      )}
    >
      <Icon
        className={cn("h-5 w-5 shrink-0", variant.iconColor)}
        aria-hidden
      />
      <span className="flex-1 text-sm font-medium leading-snug text-white/90">
        {message}
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors",
          "hover:bg-white/[0.08] hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        )}
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </motion.div>
  );
}
