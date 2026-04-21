import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useChampionPriorities } from "@/features/priority/usePriority";
import type { Priority } from "@/features/priority/priorityStore";
import {
  GlassCard,
  Reveal,
  GradientText,
  Button,
  CardHeader,
} from "@/components/ui";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Ban, Sparkles, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "favorites" | "deprioritized";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "deprioritized", label: "Deprioritized" },
];

export default function PriorityManager() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const skins = useOwnedSkins();
  const [selection] = useSelection();
  const reduced = useReducedMotion();

  const championId = selection.championId;
  const { priorities, setSkinPriority, favoriteAll, resetAll, loading } =
    useChampionPriorities(championId);

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredSkins = useMemo(() => {
    if (!skins.length) return [];

    return skins
      .filter((s) => s.championId === championId)
      .filter((skin) => {
        const priority = priorities[skin.id] ?? null;
        if (filter === "favorites") return priority === "favorite";
        if (filter === "deprioritized") return priority === "deprioritized";
        return true;
      });
  }, [skins, priorities, filter, championId]);

  const stats = useMemo(() => {
    const owned = skins.filter((s) => s.championId === championId);
    const total = owned.length;
    const favorites = owned.filter((s) => priorities[s.id] === "favorite").length;
    const deprioritized = owned.filter(
      (s) => priorities[s.id] === "deprioritized"
    ).length;
    return { total, favorites, deprioritized };
  }, [skins, priorities, championId]);

  const handlePriorityChange = (skinId: number, priority: Priority) => {
    setSkinPriority(skinId, priority);
  };

  const handleFavoriteAll = () => {
    const skinIds = skins
      .filter((s) => s.championId === championId)
      .map((s) => s.id);
    favoriteAll(skinIds);
  };

  const handleResetAll = () => {
    resetAll();
  };

  const hasChampion = championId > 0;

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
        <div className="mx-auto w-full max-w-[960px] px-2 sm:px-4">
          <div className="grid grid-cols-12 gap-6">
            {/* ---------- Header + controls card ---------- */}
            <Reveal delay={0} className="col-span-12">
              <GlassCard className="flex flex-col gap-5">
                <CardHeader
                  eyebrow="Skin Priority"
                  title={
                    hasChampion ? (
                      <>
                        <GradientText>
                          {selection.championAlias || "Champion"}
                        </GradientText>{" "}
                        Skins
                      </>
                    ) : (
                      "Select a Champion"
                    )
                  }
                  trailing={
                    hasChampion ? (
                      <div className="flex items-center gap-2">
                        <StatBadge
                          icon={<Star className="h-3.5 w-3.5 fill-current" aria-hidden />}
                          value={stats.favorites}
                          tone="favorite"
                          label="Favorites"
                        />
                        <StatBadge
                          icon={<Ban className="h-3.5 w-3.5" aria-hidden />}
                          value={stats.deprioritized}
                          tone="deprio"
                          label="Deprioritized"
                        />
                        <StatBadge
                          icon={<Trophy className="h-3.5 w-3.5" aria-hidden />}
                          value={stats.total}
                          tone="muted"
                          label="Total skins"
                        />
                      </div>
                    ) : undefined
                  }
                />

                {!hasChampion ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <Sparkles className="h-8 w-8 text-muted" aria-hidden />
                    <p className="m-0 text-sm text-white/60">
                      Lock in a champion in champ select to manage skin
                      priorities.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Filter pill group */}
                    <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
                      {FILTERS.map((f) => {
                        const active = filter === f.id;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilter(f.id)}
                            className={cn(
                              "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200",
                              active
                                ? "text-white"
                                : "text-ink/60 hover:text-white"
                            )}
                          >
                            {active && (
                              <motion.span
                                layoutId="priority-filter-pill"
                                className="absolute inset-0 rounded-full border border-accent/40 bg-gradient-to-br from-accent/20 to-accent-strong/10"
                                transition={
                                  reduced
                                    ? { duration: 0 }
                                    : {
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 32,
                                      }
                                }
                              />
                            )}
                            <span className="relative z-10">{f.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bulk actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleFavoriteAll}
                        disabled={loading}
                        icon={<Star className="h-3.5 w-3.5" aria-hidden />}
                      >
                        Favorite All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetAll}
                        disabled={loading}
                        icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </Reveal>

            {/* ---------- Skin list card ---------- */}
            {hasChampion && (
              <Reveal delay={0.08} className="col-span-12">
                <GlassCard className="flex flex-col gap-3">
                  {filteredSkins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                      <Ban className="h-6 w-6 text-muted" aria-hidden />
                      <p className="m-0 text-sm text-white/50">
                        {filter === "all"
                          ? "No owned skins for this champion."
                          : `No ${filter} skins.`}
                      </p>
                    </div>
                  ) : (
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {filteredSkins.map((skin) => {
                        const priority = priorities[skin.id] ?? null;
                        const skinNum = skin.id - championId * 1000;
                        const imgUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${selection.championAlias}_${skinNum}.jpg`;

                        return (
                          <li key={skin.id}>
                            <SkinRow
                              name={skin.name}
                              chromaCount={skin.chromas.length}
                              imgUrl={imgUrl}
                              priority={priority}
                              onToggleFavorite={() =>
                                handlePriorityChange(
                                  skin.id,
                                  priority === "favorite" ? null : "favorite"
                                )
                              }
                              onToggleDeprio={() =>
                                handlePriorityChange(
                                  skin.id,
                                  priority === "deprioritized"
                                    ? null
                                    : "deprioritized"
                                )
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </GlassCard>
              </Reveal>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Local primitives (scoped to Priority) ---------- */

function StatBadge({
  icon,
  value,
  tone,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  tone: "favorite" | "deprio" | "muted";
  label: string;
}) {
  const toneClass =
    tone === "favorite"
      ? "text-amber-300 border-amber-300/25 bg-amber-300/[0.06]"
      : tone === "deprio"
        ? "text-rose-300 border-rose-300/25 bg-rose-300/[0.06]"
        : "text-white/60 border-white/10 bg-white/[0.03]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClass
      )}
      title={label}
    >
      {icon}
      {value}
    </span>
  );
}

function SkinRow({
  name,
  chromaCount,
  imgUrl,
  priority,
  onToggleFavorite,
  onToggleDeprio,
}: {
  name: string;
  chromaCount: number;
  imgUrl: string;
  priority: Priority | null;
  onToggleFavorite: () => void;
  onToggleDeprio: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-white/[0.06]",
        "bg-white/[0.02] p-2.5 pr-3",
        "transition-colors duration-200 hover:border-white/10 hover:bg-white/[0.04]"
      )}
    >
      <div className="h-12 w-[88px] shrink-0 overflow-hidden rounded-lg border border-white/[0.06]">
        <img
          src={imgUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-white">
          {name}
        </span>
        {chromaCount > 0 && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
            +{chromaCount} chroma{chromaCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <PriorityToggle
          active={priority === "favorite"}
          onClick={onToggleFavorite}
          title="Toggle favorite"
          tone="favorite"
        >
          <Star
            className={cn("h-4 w-4", priority === "favorite" && "fill-current")}
            aria-hidden
          />
        </PriorityToggle>
        <PriorityToggle
          active={priority === "deprioritized"}
          onClick={onToggleDeprio}
          title="Toggle deprioritized"
          tone="deprio"
        >
          <Ban className="h-4 w-4" aria-hidden />
        </PriorityToggle>
      </div>
    </div>
  );
}

function PriorityToggle({
  active,
  onClick,
  title,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  tone: "favorite" | "deprio";
  children: React.ReactNode;
}) {
  const activeClass =
    tone === "favorite"
      ? "border-amber-300/40 bg-amber-300/15 text-amber-300"
      : "border-rose-300/40 bg-rose-300/15 text-rose-300";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border transition-colors duration-200",
        active
          ? activeClass
          : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/15 hover:bg-white/[0.05] hover:text-white/80"
      )}
    >
      {children}
    </motion.button>
  );
}
