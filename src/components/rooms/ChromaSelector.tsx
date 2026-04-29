import { Ban } from "lucide-react";
import type { ColorSynergy } from "@/features/roomsClient";
import { cn } from "@/lib/utils";

interface ChromaSelectorProps {
  synergies: ColorSynergy[];
  onApply: (color: string | null) => void;
  activeColor: string | null;
  totalMembers: number;
  disabled?: boolean;
}

/**
 * Chroma synergy picker. Default pill resets to "no chroma"; subsequent
 * bubbles are color-coded orbs with a member-coverage badge (e.g. "2/3"
 * = 2 of 3 room members own a skin in this color) and the vitrine DA's
 * gold ring when active.
 */
export function ChromaSelector({ synergies, onApply, activeColor, totalMembers, disabled }: ChromaSelectorProps) {
  if (synergies.length === 0) return null;

  const defaultActive = activeColor === null;

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-black/20 p-3">
      <div className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
        Chromas
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onApply(null)}
          title="Default (No Chroma)"
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            defaultActive
              ? "border-transparent bg-gradient-to-br from-accent-strong to-accent text-white shadow-accent-glow"
              : "border-white/10 bg-white/[0.05] text-white/90 hover:-translate-y-0.5 hover:bg-white/[0.1]"
          )}
        >
          <Ban className="h-3.5 w-3.5" aria-hidden />
          <span>Default</span>
        </button>
        {synergies.map((s) => {
          const isActive = activeColor === s.color;
          return (
            <button
              key={s.color}
              type="button"
              onClick={() => onApply(s.color)}
              title={`Sync on ${s.color}`}
              disabled={disabled}
              style={{ backgroundColor: s.color }}
              className={cn(
                "relative h-10 w-10 rounded-full border-2 transition-all duration-200",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale",
                isActive
                  ? "scale-110 border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.35)]"
                  : "border-white/10 hover:scale-105 hover:border-white/50"
              )}
              aria-pressed={isActive}
            >
              <span className="absolute -bottom-1 -right-1 rounded bg-black/80 px-1 py-[1px] text-[0.65rem] font-bold leading-tight tabular-nums text-white">
                {s.members.length}/{totalMembers}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
