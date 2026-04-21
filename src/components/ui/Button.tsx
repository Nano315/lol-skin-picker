import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "magic" | "ghost";
type Size = "sm" | "md" | "lg" | "icon" | "icon-lg";

type NativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof HTMLMotionProps<"button">
>;

type ButtonProps = NativeProps &
  Pick<HTMLMotionProps<"button">, "onClick" | "type" | "disabled" | "title"> & {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    children?: ReactNode;
    className?: string;
  };

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "shine bg-gradient-to-b from-accent-strong to-accent text-white shadow-accent-glow ring-1 ring-white/20 hover:shadow-accent-glow-strong",
  secondary:
    "glass text-ink/90 hover:text-white hover:bg-white/[0.06] border border-white/10",
  magic:
    "shine bg-gradient-to-br from-fuchsia-500 via-accent-strong to-accent text-white shadow-accent-glow ring-1 ring-white/25 hover:shadow-accent-glow-strong",
  ghost:
    "text-muted hover:text-white hover:bg-white/[0.04]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-full",
  md: "px-5 py-2.5 text-sm gap-2 rounded-full",
  lg: "px-7 py-3.5 text-base gap-2.5 rounded-full",
  icon: "h-10 w-10 rounded-full",
  "icon-lg": "h-[52px] w-[52px] shrink-0 rounded-full",
};

/**
 * Unified primary action button. Variants inherit the vitrine site's
 * visual language: gradient + glow for primary, glass for secondary.
 * Uses framer-motion for consistent micro-interactions (y:-2 hover,
 * scale:0.98 tap), degrades gracefully with prefers-reduced-motion.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    iconPosition = "left",
    children,
    className,
    disabled,
    ...rest
  },
  ref
) {
  const reduced = useReducedMotion();
  const isDisabled = disabled || loading;

  const hoverAnim = reduced || isDisabled ? undefined : { y: -2 };
  const tapAnim = reduced || isDisabled ? undefined : { y: 0, scale: 0.98 };

  const iconEl = loading ? (
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
  ) : (
    icon
  );

  return (
    <motion.button
      ref={ref}
      whileHover={hoverAnim}
      whileTap={tapAnim}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      disabled={isDisabled}
      className={cn(
        "group relative inline-flex items-center justify-center font-semibold",
        "transition-shadow duration-300 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {iconEl && iconPosition === "left" && iconEl}
      {children && <span className="relative z-10">{children}</span>}
      {iconEl && iconPosition === "right" && iconEl}
    </motion.button>
  );
});

export default Button;
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize };
