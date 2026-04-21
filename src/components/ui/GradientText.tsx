import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Static text gradient (white → accent-strong). Mirror of the vitrine site's
 * ui/GradientText. Use for emphasized words inside headings.
 *
 * Distinct from the legacy animated `components/GradientText` component that
 * uses FA icons and color loops — keep that one for its existing call sites.
 */
export default function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-br from-white via-white to-accent-strong bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
