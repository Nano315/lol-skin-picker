import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  RotateCcw,
  Trophy,
  SlidersHorizontal,
  Palette,
} from "lucide-react";
import { GlassCard } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { OwnedChampion } from "@/features/championLibrary/useChampionLibrary";

type SortMode = "mastery" | "skins" | "name";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "mastery", label: "Mastery" },
  { id: "skins", label: "Skins" },
  { id: "name", label: "A–Z" },
];

interface Props {
  champions: OwnedChampion[];
  exclusionsByChampion: Record<number, number[]>;
  selectedId: number | null;
  onSelect: (id: number) => void;
  loading: boolean;
  onRefresh: () => Promise<void> | void;
}

const ICON_BASE =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons";

export function ChampionList({
  champions,
  exclusionsByChampion,
  selectedId,
  onSelect,
  loading,
  onRefresh,
}: Props) {
  const reduced = useReducedMotion();
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("mastery");

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? champions.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.alias.toLowerCase().includes(q)
        )
      : champions;

    return [...filtered].sort((a, b) => {
      if (sortMode === "mastery") {
        if (b.mastery !== a.mastery) return b.mastery - a.mastery;
        return a.name.localeCompare(b.name);
      }
      if (sortMode === "skins") {
        if (b.skinCount !== a.skinCount) return b.skinCount - a.skinCount;
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
  }, [champions, search, sortMode]);

  // Auto-select the first visible champion on initial load (best discoverability —
  // users immediately see what the detail panel looks like). Only fires while
  // selectedId is null so the user keeps control once they pick something.
  useEffect(() => {
    if (selectedId === null && visible.length > 0) {
      onSelect(visible[0].id);
    }
  }, [selectedId, visible, onSelect]);

  return (
    <GlassCard className="flex h-full min-h-[480px] flex-col gap-3 p-4 lg:min-h-[calc(100vh-160px)] lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-104px)]">
      {/* Search */}
      <label className="relative block">
        <span className="sr-only">Search champion</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          aria-hidden
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search champion…"
          className={cn(
            "block w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] py-2 pl-9 pr-3",
            "text-sm text-white placeholder:text-white/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
            "transition-colors duration-150 hover:border-white/15"
          )}
        />
      </label>

      {/* Sort + refresh row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
          {SORT_OPTIONS.map((opt) => {
            const active = sortMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortMode(opt.id)}
                className={cn(
                  "relative rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150",
                  active ? "text-white" : "text-ink/60 hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="library-sort-pill"
                    className="absolute inset-0 rounded-full border border-accent/40 bg-gradient-to-br from-accent/20 to-accent-strong/10"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={loading}
          title="Refresh from client"
          aria-label="Refresh from client"
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] text-white/50",
            "transition-colors duration-150 hover:border-white/15 hover:text-white",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          <RotateCcw
            className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            aria-hidden
          />
        </button>
      </div>

      {/* List */}
      <div className="-mx-1 flex-1 overflow-y-auto pr-1">
        {loading && visible.length === 0 ? (
          <ListSkeleton />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="m-0 text-sm text-white/50">
              {search ? "No champion matches." : "No owned champions found."}
            </p>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {visible.map((c) => {
              const exclusionCount =
                exclusionsByChampion[c.id]?.length ?? 0;
              const active = c.id === selectedId;
              return (
                <li key={c.id}>
                  <ChampionRow
                    champion={c}
                    active={active}
                    exclusionCount={exclusionCount}
                    onClick={() => onSelect(c.id)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </GlassCard>
  );
}

function ChampionRow({
  champion,
  active,
  exclusionCount,
  onClick,
}: {
  champion: OwnedChampion;
  active: boolean;
  exclusionCount: number;
  onClick: () => void;
}) {
  const iconUrl = `${ICON_BASE}/${champion.id}.png`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2 text-left transition-colors duration-150",
        active
          ? "border-accent/40 bg-gradient-to-br from-accent/15 to-accent-strong/5"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
      )}
    >
      <img
        src={iconUrl}
        alt=""
        aria-hidden
        loading="lazy"
        className="h-10 w-10 shrink-0 rounded-xl border border-white/[0.08] object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-white">
          {champion.name}
        </span>
        <span className="flex items-center gap-2 text-[11px] text-white/50">
          <span className="inline-flex items-center gap-1">
            <Trophy className="h-3 w-3" aria-hidden />
            {formatMastery(champion.mastery)}
          </span>
          <span className="text-white/20">•</span>
          <span className="inline-flex items-center gap-1">
            <Palette className="h-3 w-3" aria-hidden />
            {champion.skinCount}
          </span>
        </span>
      </div>
      {exclusionCount > 0 && (
        <span
          className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent-strong"
          title={`${exclusionCount} excluded`}
        >
          <SlidersHorizontal className="h-2.5 w-2.5" aria-hidden />
          {exclusionCount}
        </span>
      )}
    </button>
  );
}

function ListSkeleton() {
  return (
    <ul className="m-0 flex list-none flex-col gap-1 p-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.01] p-2.5"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/5" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-3 w-24 animate-pulse rounded-full bg-white/5" />
            <div className="h-2 w-16 animate-pulse rounded-full bg-white/5" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function formatMastery(points: number): string {
  if (points <= 0) return "0 pts";
  if (points >= 1_000_000) return `${(points / 1_000_000).toFixed(1)}M pts`;
  if (points >= 1_000) return `${Math.round(points / 1_000)}k pts`;
  return `${points} pts`;
}
