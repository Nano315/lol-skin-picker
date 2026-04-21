import type { ReactNode } from "react";

type CardHeaderProps = {
  /** Small uppercase label over the title (e.g. "Selection", "Actions"). */
  eyebrow: string;
  /** Main title — accepts rich nodes so callers can drop in GradientText etc. */
  title: ReactNode;
  /** Optional trailing slot, right-aligned (badge, action button, pill...). */
  trailing?: ReactNode;
};

/**
 * Unified card header used across Home / Rooms / Priority / Settings.
 * Keeps the same eyebrow + title + trailing layout everywhere so the cards
 * feel like siblings regardless of page context.
 */
export default function CardHeader({ eyebrow, title, trailing }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          {eyebrow}
        </p>
        <h3 className="m-0 mt-1 text-xl font-bold text-white">{title}</h3>
      </div>
      {trailing}
    </div>
  );
}
