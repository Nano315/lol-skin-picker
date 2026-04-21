import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
  /** Render without the top-border gradient highlight (for nested cards). */
  flat?: boolean;
};

/**
 * Glass-morphism card with top-edge highlight. Default variant matches the
 * vitrine site: rounded-3xl, white/[0.02] bg, white/[0.08] border, shadow-glass.
 * `hover` adds brightness on hover. `flat` removes the top highlight.
 */
export default function GlassCard({
  children,
  className,
  hover = true,
  flat = false,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-glass backdrop-blur-xl",
        !flat &&
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        hover &&
          "transition-all duration-500 hover:border-white/15 hover:shadow-glass-hover",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
