import { Ban } from "lucide-react";
import type { SkinLineSynergy } from "@/features/roomsClient";
import { cn } from "@/lib/utils";

interface SkinLineageSelectorProps {
  synergies: SkinLineSynergy[];
  onApply: (skinLineId: number | null) => void;
  activeId: number | null;
  disabled?: boolean;
}

/**
 * Skin-line synergy picker. Same pill semantics as ChromaSelector but with
 * text labels and a compact combination counter badge.
 */
export function SkinLineageSelector({ synergies, onApply, activeId, disabled }: SkinLineageSelectorProps) {
  if (synergies.length === 0) return null;

  const defaultActive = activeId === null;

  const baseOption =
    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  const activeOption =
    "border-transparent bg-gradient-to-br from-accent-strong to-accent text-white shadow-accent-glow";
  const idleOption =
    "border-white/10 bg-white/[0.05] text-white/90 hover:-translate-y-0.5 hover:bg-white/[0.1]";

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-black/20 p-3">
      <div className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
        Skin Lines
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onApply(null)}
          title="Default (No Skin Line)"
          disabled={disabled}
          className={cn(baseOption, defaultActive ? activeOption : idleOption)}
          aria-pressed={defaultActive}
        >
          <Ban className="h-3.5 w-3.5" aria-hidden />
          <span>Default</span>
        </button>
        {synergies.map((s) => {
          const isActive = activeId === s.skinLineId;
          return (
            <button
              key={s.skinLineId}
              type="button"
              onClick={() => onApply(s.skinLineId)}
              title={`Sync on ${s.skinLineName}`}
              disabled={disabled}
              className={cn(baseOption, isActive ? activeOption : idleOption)}
              aria-pressed={isActive}
            >
              <span>{s.skinLineName}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-[1px] text-xs font-bold",
                  isActive ? "bg-black/25 text-white" : "bg-black/30 text-white/90"
                )}
              >
                {s.combinationCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
