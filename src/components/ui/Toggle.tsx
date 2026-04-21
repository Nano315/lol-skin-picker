import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  /** Accessible label (required for screen readers since the Toggle has no visible text). */
  "aria-label"?: string;
  /** Optional id forwarded to the underlying button for <label htmlFor> associations. */
  id?: string;
  className?: string;
};

/**
 * iOS-style animated switch. Framer Motion drives the thumb spring, Tailwind
 * handles the on/off track tint. Respects prefers-reduced-motion (falls back
 * to a cheap opacity crossfade).
 *
 * Sizing matches the legacy `.switch/.track/.thumb` CSS (48×26 track, 20×20 thumb).
 */
export default function Toggle({
  checked,
  onChange,
  disabled = false,
  id,
  className,
  "aria-label": ariaLabel,
}: ToggleProps) {
  const reduced = useReducedMotion();

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[26px] w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-40",
        checked
          ? "border-white/20 bg-accent"
          : "border-white/10 bg-white/10",
        className
      )}
    >
      <motion.span
        aria-hidden
        layout
        initial={false}
        animate={{ x: checked ? 24 : 4 }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 600, damping: 34 }
        }
        className={cn(
          "block h-[18px] w-[18px] rounded-full shadow-md",
          checked ? "bg-white" : "bg-white/85"
        )}
      />
    </button>
  );
}
