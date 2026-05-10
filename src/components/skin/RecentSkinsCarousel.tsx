/**
 * RecentSkinsCarousel — replaces the Reroll Actions card on Solo when
 * the user is connected but not in champ select. Same bento slot, same
 * height ballpark — just trades inert reroll buttons for a horizontal
 * row of recent picks that auto-cycles through the user's history.
 *
 * Behavior contract:
 *  - Auto-cycles every `cycleIntervalMs` (default 4s)
 *  - Hovering a thumbnail pauses the cycle and previews that one
 *  - Clicking a thumbnail jumps to it and pauses the cycle for 8s,
 *    then resumes from there
 *  - The currently displayed skin is reported to the parent via
 *    `onPreviewSkin` so the big Preview card upstairs can mirror it
 *  - Honors `prefers-reduced-motion` and the global low-spec class —
 *    no auto-cycle, no scale animations, just a static row
 */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { History } from "lucide-react";
import fallbackSkin from "/fallback-skin.png?url";
import {
  GlassCard,
  CardHeader,
  GradientText,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { RecentSkinEntry } from "@/features/history/useGlobalRecentSkins";

interface Props {
  skins: RecentSkinEntry[];
  /**
   * Fired whenever the "currently displayed" skin changes — either via
   * auto-cycle, hover, or click. Parents (Solo) use this to keep the big
   * Preview card upstairs in sync.
   */
  onPreviewSkin: (skin: RecentSkinEntry | null) => void;
  /** True when the list is synthetic (fresh install — owned champions sample). */
  isFallback?: boolean;
  /** Auto-cycle interval, ms. Defaults to 4000. */
  cycleIntervalMs?: number;
  /** ms to keep the auto-cycle paused after a click. Defaults to 8000. */
  clickPauseMs?: number;
}

const DEFAULT_CYCLE = 4000;
const DEFAULT_CLICK_PAUSE = 8000;

/**
 * Module-level: persists the carousel's cycling cursor across mounts so
 * navigating away from Solo and back resumes from where the user was,
 * not from the beginning of the list. Bounded to the current list size
 * inside the component to handle history shrinking between visits.
 */
let cachedActiveIndex = 0;

function thumbnailUrl(skin: RecentSkinEntry): string {
  if (!skin.skinId || !skin.championAlias) return fallbackSkin;
  // Data Dragon "tile" art is the closest CDN asset to a thumbnail; using
  // the splash here too matches the existing SkinPreview behaviour and
  // saves us another asset host.
  const skinIndex = skin.skinId - skin.championId * 1000;
  return `http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${skin.championAlias}_${skinIndex}.jpg`;
}

export function RecentSkinsCarousel({
  skins,
  onPreviewSkin,
  isFallback = false,
  cycleIntervalMs = DEFAULT_CYCLE,
  clickPauseMs = DEFAULT_CLICK_PAUSE,
}: Props) {
  const reduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(() => {
    if (skins.length === 0) return 0;
    return Math.min(cachedActiveIndex, skins.length - 1);
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pausedUntil, setPausedUntil] = useState<number | null>(null);

  // Mirror the cycling cursor to the module-level cache so a remount
  // (after navigating away and back) can restore it instantly.
  useEffect(() => {
    cachedActiveIndex = activeIndex;
  }, [activeIndex]);

  // Reset the cursor when the underlying list shrinks (e.g. user excluded
  // their currently-active recent pick) so we don't end up stuck on an
  // out-of-bounds index.
  useEffect(() => {
    if (activeIndex >= skins.length) setActiveIndex(0);
  }, [activeIndex, skins.length]);

  // Auto-cycle. Pauses while a thumbnail is hovered OR while a click-pause
  // is in effect. The pausedUntil window is tracked separately so the
  // cycle resumes naturally once the timer elapses.
  useEffect(() => {
    if (reduced) return; // accessibility: no auto-motion
    if (skins.length <= 1) return;
    if (hoveredIndex !== null) return;

    if (pausedUntil !== null) {
      const remaining = pausedUntil - Date.now();
      if (remaining > 0) {
        const t = window.setTimeout(() => setPausedUntil(null), remaining);
        return () => window.clearTimeout(t);
      }
      setPausedUntil(null);
    }

    const t = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % skins.length);
    }, cycleIntervalMs);
    return () => window.clearInterval(t);
  }, [skins.length, hoveredIndex, pausedUntil, cycleIntervalMs, reduced]);

  // Single source of truth for "what's currently shown upstairs": hover
  // wins (immediate response to user intent), otherwise the auto-cycled
  // active index. Memoized so onPreviewSkin doesn't fire on every render.
  const displayedIndex = hoveredIndex ?? activeIndex;
  const displayedSkin = skins[displayedIndex] ?? null;

  // Push the current preview to the parent.
  const lastReportedRef = useRef<RecentSkinEntry | null>(null);
  useEffect(() => {
    if (lastReportedRef.current === displayedSkin) return;
    lastReportedRef.current = displayedSkin;
    onPreviewSkin(displayedSkin);
  }, [displayedSkin, onPreviewSkin]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setPausedUntil(Date.now() + clickPauseMs);
  };

  const eyebrow = isFallback ? "Library" : "Recent";
  const title = isFallback ? (
    <>
      Your <GradientText>library</GradientText>
    </>
  ) : (
    <>
      Last <GradientText>picks</GradientText>
    </>
  );
  const helper = isFallback
    ? "Roll a few skins in champ select and your real history takes over here."
    : "Hover to preview, click to pin one for a few seconds.";

  return (
    <GlassCard className="flex flex-col gap-4">
      <CardHeader
        eyebrow={eyebrow}
        title={title}
        trailing={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/70">
            <History className="h-3 w-3" aria-hidden />
            {skins.length}
          </span>
        }
      />

      {skins.length === 0 ? (
        <p className="m-0 py-6 text-center text-sm text-white/50">
          No history yet — your next picks will land here.
        </p>
      ) : (
        <>
          <div
            role="listbox"
            aria-label="Recent skin picks"
            className="flex items-stretch gap-2.5 overflow-x-auto pb-1"
          >
            {skins.map((skin, i) => {
              const isActive = i === displayedIndex;
              return (
                <Thumbnail
                  key={`${skin.championId}-${skin.skinId}-${skin.chromaId}-${i}`}
                  skin={skin}
                  active={isActive}
                  reduced={!!reduced}
                  onHover={() => setHoveredIndex(i)}
                  onLeave={() => setHoveredIndex(null)}
                  onClick={() => handleClick(i)}
                />
              );
            })}
          </div>
          <p className="m-0 text-center text-[11px] leading-relaxed text-white/40">
            {helper}
          </p>
        </>
      )}
    </GlassCard>
  );
}

/* ------------------------------ Thumbnail ------------------------------ */

function Thumbnail({
  skin,
  active,
  reduced,
  onHover,
  onLeave,
  onClick,
}: {
  skin: RecentSkinEntry;
  active: boolean;
  reduced: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const url = thumbnailUrl(skin);

  return (
    <motion.button
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(
        "group relative flex shrink-0 overflow-hidden rounded-2xl border bg-black/30",
        // 90x115 fits ~10 in a 1100px-wide card with comfortable gaps
        "h-[115px] w-[90px]",
        "transition-[border-color,box-shadow] duration-200",
        active
          ? "border-accent/70 shadow-accent-glow"
          : "border-white/10 hover:border-white/30"
      )}
      title={skin.championName}
    >
      <img
        src={url}
        alt={skin.championName}
        loading="lazy"
        draggable={false}
        className={cn(
          "h-full w-full object-cover transition-[transform,opacity] duration-300",
          active ? "scale-[1.06] opacity-100" : "opacity-70 group-hover:opacity-95"
        )}
        onError={(e) => {
          // Fall back to the generic placeholder if the CDN tile is missing
          // (rare — happens on freshly released champions before DDragon updates).
          (e.currentTarget as HTMLImageElement).src = fallbackSkin;
        }}
      />

      {/* Bottom-anchored champion alias label. Subtle so it doesn't fight
          the splash; brightens on active for a "this one's playing" vibe. */}
      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 px-2 py-1.5",
          "bg-gradient-to-t from-black/85 via-black/55 to-transparent",
          "text-[10px] font-bold uppercase tracking-[0.08em]",
          active ? "text-white" : "text-white/75"
        )}
      >
        {skin.championAlias}
      </span>
    </motion.button>
  );
}
