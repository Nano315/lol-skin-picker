import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw,
  Trophy,
} from "lucide-react";
import {
  GlassCard,
  Reveal,
  GradientText,
  Button,
  Toggle,
} from "@/components/ui";
import { useChampionSkins } from "@/features/championLibrary/useChampionLibrary";
import { useChampionExclusions } from "@/features/exclusions/useExclusions";
import { useToast } from "@/features/hooks/useToast";
import { cn } from "@/lib/utils";
import type { OwnedChampion } from "@/features/championLibrary/useChampionLibrary";

interface Props {
  champion: OwnedChampion | null;
  onExclusionsChange?: () => void;
}

export function ChampionDetail({ champion, onExclusionsChange }: Props) {
  const championId = champion?.id ?? null;
  const { skins, loading: skinsLoading } = useChampionSkins(championId);
  const {
    excluded,
    isExcluded,
    toggle,
    setMany,
    reset,
    loading: exclusionsLoading,
  } = useChampionExclusions(championId ?? 0);
  const { showToast } = useToast();

  const includedSkins = useMemo(
    () => skins.filter((s) => !excluded.has(s.id)).length,
    [skins, excluded]
  );

  const allVariantIds = useMemo(() => {
    const ids: number[] = [];
    for (const s of skins) {
      ids.push(s.id);
      for (const c of s.chromas) ids.push(c.id);
    }
    return ids;
  }, [skins]);

  const totalIncluded = useMemo(
    () => allVariantIds.filter((id) => !excluded.has(id)).length,
    [allVariantIds, excluded]
  );

  if (!champion) {
    return (
      <Reveal delay={0.05}>
        <GlassCard className="flex h-full min-h-[480px] flex-col items-center justify-center gap-3 py-12 text-center">
          <Sparkles className="h-8 w-8 text-muted" aria-hidden />
          <p className="m-0 max-w-[280px] text-sm text-white/60">
            Pick a champion to fine-tune which skins and chromas the random can
            apply.
          </p>
        </GlassCard>
      </Reveal>
    );
  }

  const handleSkinToggle = async (skin: (typeof skins)[number]) => {
    const willExclude = !isExcluded(skin.id);

    if (willExclude && totalIncluded === 1) {
      showToast({
        type: "error",
        message: "At least one skin must stay included.",
        duration: 2200,
      });
      return;
    }

    await toggle(skin.id);
    onExclusionsChange?.();
  };

  const handleChromaToggle = async (chromaId: number) => {
    const willExclude = !isExcluded(chromaId);
    if (willExclude && totalIncluded === 1) {
      showToast({
        type: "error",
        message: "At least one skin must stay included.",
        duration: 2200,
      });
      return;
    }
    await toggle(chromaId);
    onExclusionsChange?.();
  };

  const handleReset = async () => {
    await reset();
    onExclusionsChange?.();
  };

  return (
    <div className="flex flex-col gap-4">
      <Reveal delay={0}>
        <ChampionHeader
          champion={champion}
          totalSkins={skins.length}
          includedSkins={includedSkins}
          onReset={handleReset}
          loading={exclusionsLoading || skinsLoading}
          hasExclusions={excluded.size > 0}
        />
      </Reveal>

      <Reveal delay={0.06}>
        <GlassCard className="flex flex-col gap-3">
          {skinsLoading && skins.length === 0 ? (
            <SkinSkeleton />
          ) : skins.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <p className="m-0 text-sm text-white/50">
                No skins owned for this champion.
              </p>
            </div>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {skins.map((skin) => (
                <li key={skin.id}>
                  <SkinRow
                    skin={skin}
                    championAlias={champion.alias}
                    skinExcluded={isExcluded(skin.id)}
                    isChromaExcluded={isExcluded}
                    onToggleSkin={() => handleSkinToggle(skin)}
                    onToggleChroma={handleChromaToggle}
                    onSetManyChromas={(ids, exclude) => {
                      void setMany(ids, exclude);
                      onExclusionsChange?.();
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </Reveal>
    </div>
  );
}

function ChampionHeader({
  champion,
  totalSkins,
  includedSkins,
  onReset,
  loading,
  hasExclusions,
}: {
  champion: OwnedChampion;
  totalSkins: number;
  includedSkins: number;
  onReset: () => void;
  loading: boolean;
  hasExclusions: boolean;
}) {
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.alias}_0.jpg`;

  return (
    <GlassCard className="relative overflow-hidden p-0">
      <div className="absolute inset-0">
        <img
          src={splashUrl}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-bg/0" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-strong">
            Library
          </span>
          <h2 className="m-0 text-2xl font-bold text-white sm:text-3xl">
            <GradientText>{champion.name}</GradientText>
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="h-3 w-3" aria-hidden />
              {formatMastery(champion.mastery)}
            </span>
            <span className="text-white/30">•</span>
            <span>
              {includedSkins} / {totalSkins} skins eligible
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={loading || !hasExclusions}
            icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
          >
            Reset
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function SkinRow({
  skin,
  championAlias,
  skinExcluded,
  isChromaExcluded,
  onToggleSkin,
  onToggleChroma,
  onSetManyChromas,
}: {
  skin: { id: number; name: string; chromas: { id: number; name: string }[]; championId: number };
  championAlias: string;
  skinExcluded: boolean;
  isChromaExcluded: (id: number) => boolean;
  onToggleSkin: () => void;
  onToggleChroma: (chromaId: number) => void;
  onSetManyChromas: (ids: number[], excluded: boolean) => void;
}) {
  const [chromasOpen, setChromasOpen] = useState(false);
  const reduced = useReducedMotion();

  const skinNum = skin.id - skin.championId * 1000;
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championAlias}_${skinNum}.jpg`;

  const includedChromas = skin.chromas.filter(
    (c) => !isChromaExcluded(c.id)
  ).length;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/[0.02] transition-all duration-200",
        skinExcluded
          ? "border-white/[0.04] opacity-50"
          : "border-white/[0.06] hover:border-white/15"
      )}
    >
      <div className="flex items-center gap-3 p-2.5 pr-3">
        <div className="relative h-14 w-[100px] shrink-0 overflow-hidden rounded-xl border border-white/[0.06]">
          <img
            src={splashUrl}
            alt=""
            aria-hidden
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-300",
              skinExcluded && "grayscale-[0.4]"
            )}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-white">
            {skin.name}
          </span>
          {skin.chromas.length > 0 ? (
            <button
              type="button"
              onClick={() => setChromasOpen((o) => !o)}
              className="mt-0.5 inline-flex items-center gap-1 self-start text-[11px] font-medium text-white/50 transition-colors hover:text-white/80"
            >
              {chromasOpen ? (
                <ChevronUp className="h-3 w-3" aria-hidden />
              ) : (
                <ChevronDown className="h-3 w-3" aria-hidden />
              )}
              {includedChromas}/{skin.chromas.length} chroma
              {skin.chromas.length > 1 ? "s" : ""}
            </button>
          ) : (
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">
              No chroma
            </span>
          )}
        </div>
        <Toggle
          checked={!skinExcluded}
          onChange={onToggleSkin}
          aria-label={`Toggle ${skin.name}`}
        />
      </div>

      <AnimatePresence initial={false}>
        {chromasOpen && skin.chromas.length > 0 && (
          <motion.div
            key="chromas"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 32 }
            }
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 border-t border-white/[0.04] p-2.5 pt-3">
              {skin.chromas.map((chroma) => {
                const excluded = isChromaExcluded(chroma.id);
                return (
                  <ChromaChip
                    key={chroma.id}
                    label={extractChromaLabel(chroma.name)}
                    excluded={excluded}
                    onClick={() => onToggleChroma(chroma.id)}
                  />
                );
              })}
              <ChromaBulkButton
                onClick={() =>
                  onSetManyChromas(
                    skin.chromas.map((c) => c.id),
                    includedChromas > 0 // if any are included → exclude all
                  )
                }
                label={includedChromas > 0 ? "Exclude all" : "Include all"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChromaChip({
  label,
  excluded,
  onClick,
}: {
  label: string;
  excluded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-150",
        excluded
          ? "border-white/[0.06] bg-white/[0.01] text-white/30 line-through hover:border-white/15 hover:text-white/50"
          : "border-accent/30 bg-accent/10 text-white hover:border-accent/50"
      )}
      aria-pressed={!excluded}
      title={excluded ? `${label} (excluded)` : label}
    >
      {label}
    </button>
  );
}

function ChromaBulkButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/[0.08] bg-transparent px-2.5 py-1 text-xs font-medium text-white/50 transition-colors duration-150 hover:border-white/20 hover:text-white"
    >
      {label}
    </button>
  );
}

function SkinSkeleton() {
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.01] p-2.5 pr-3"
        >
          <div className="h-14 w-[100px] shrink-0 animate-pulse rounded-xl bg-white/5" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-32 animate-pulse rounded-full bg-white/5" />
            <div className="h-2 w-20 animate-pulse rounded-full bg-white/5" />
          </div>
          <div className="h-[26px] w-12 animate-pulse rounded-full bg-white/5" />
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

/**
 * LCU chroma names look like "Pulsefire Ezreal (turquoise)". Strip the skin
 * name prefix when present — the skin name is already the row's title.
 */
function extractChromaLabel(fullName: string): string {
  const match = fullName.match(/\(([^)]+)\)/);
  if (match) {
    const raw = match[1].trim();
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return fullName;
}
