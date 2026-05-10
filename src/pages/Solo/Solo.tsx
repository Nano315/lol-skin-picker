import { useCallback, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { WifiOff } from "lucide-react";

import Header from "@/components/layout/Header";
import SkinPreview from "@/components/skin/SkinPreview";
import RerollActions from "@/components/controls/RerollActions";
import AutoRollPill from "@/components/controls/AutoRollPill";
import { GlassCard, GradientText, CardHeader } from "@/components/ui";
import { EmptyState } from "@/components/empty/EmptyState";
import { Coachmark } from "@/components/coachmark/Coachmark";
import { RecentSkinsCarousel } from "@/components/skin/RecentSkinsCarousel";

import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useChromaColor } from "@/features/hooks/useChromaColor";
import { useCoachmark } from "@/features/onboarding/useCoachmark";
import {
  useGlobalRecentSkins,
  type RecentSkinEntry,
} from "@/features/history/useGlobalRecentSkins";
import { api } from "@/features/api";
import { cn } from "@/lib/utils";
import type { Selection } from "@/features/types";

const CROSSFADE = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };
const LAYOUT_TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Module-level: the last skin the carousel was previewing before Solo
 * unmounted. Restored on remount so the big Preview card never blanks
 * out for a render cycle while the carousel re-emits from index 0.
 * Pairs with the carousel's own `cachedActiveIndex` and the recent-skins
 * hook's `lastGoodResult` cache so coming back to Solo feels instant.
 */
let lastCarouselSkin: RecentSkinEntry | null = null;

/**
 * LCU chroma names look like "Bard Café Chouchous (turquoise)".
 * We only want the parenthesized color token since the skin name is
 * already shown above. Fall back to the full string if no match.
 */
function extractChromaColor(fullName: string): string {
  const match = fullName.match(/\(([^)]+)\)/);
  const raw = (match?.[1] ?? fullName).trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Build a `Selection`-shaped object from a recent skin entry, so the same
 * SkinPreview / useChromaColor pipeline that drives the live (in-game) view
 * can also drive the standby carousel preview without forking either.
 */
function syntheticSelection(skin: RecentSkinEntry): Selection {
  return {
    championId: skin.championId,
    championAlias: skin.championAlias,
    skinId: skin.skinId,
    chromaId: skin.chromaId,
    locked: false,
  };
}

function AnimatedValue({ value }: { value: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={CROSSFADE}
        className="inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Solo() {
  const { status, iconId } = useConnection();
  const phase = useGameflow();
  const skins = useOwnedSkins();
  const [selection, setSelection] = useSelection();
  const reduced = useReducedMotion();

  const inChampSelect = phase === "ChampSelect";
  const hasLockedChampion =
    selection.championId !== 0 && selection.locked && inChampSelect;

  // Recent-skins carousel feed (standby mode). Cheap to keep mounted in all
  // states — the IPC fetch fires once on mount and on focus, no polling.
  const { skins: recentSkins, isFallback: recentIsFallback } =
    useGlobalRecentSkins(10);

  // Carousel reports its currently displayed skin (cycle / hover / click) via
  // this state. We feed it back into the Preview card upstairs so the big
  // splash mirrors the small thumbnail. `useCallback` keeps the prop stable —
  // otherwise the carousel's internal "did the parent change?" effect would
  // refire on every render of Solo.
  //
  // Initial value comes from `lastCarouselSkin` (module-level), so when the
  // user navigates away from Solo and back, the Preview keeps the splash
  // they were last seeing instead of flashing the fallback PNG for a frame.
  const [carouselSkin, setCarouselSkin] = useState<RecentSkinEntry | null>(
    () => lastCarouselSkin
  );
  const handleCarouselPreview = useCallback((skin: RecentSkinEntry | null) => {
    lastCarouselSkin = skin;
    setCarouselSkin(skin);
  }, []);

  // Effective selection driving the Preview card. In ChampSelect we always
  // show the live LCU selection. In standby we mirror the carousel; if the
  // carousel hasn't reported anything yet (cold mount) we fall back to the
  // live selection so the card never blanks out mid-transition.
  const previewSelection: Selection =
    inChampSelect || !carouselSkin
      ? selection
      : syntheticSelection(carouselSkin);

  const chromaColor = useChromaColor(previewSelection);

  const activeSkin = skins.find((s) => s.id === selection.skinId);
  const activeChroma = activeSkin?.chromas?.find(
    (c) => c.id === selection.chromaId
  );

  const skinLabel =
    phase === "ChampSelect"
      ? activeSkin
        ? activeSkin.name
        : selection.skinId || "Lock in your pick"
      : "...";

  const chromaLabel =
    phase === "ChampSelect"
      ? activeSkin
        ? activeChroma
          ? extractChromaColor(activeChroma.name)
          : "Default"
        : "Lock in your pick"
      : "...";

  const championLabel =
    phase === "ChampSelect"
      ? hasLockedChampion
        ? selection.championAlias
        : "Lock in your pick"
      : "...";

  const previewChromas = activeSkin?.chromas ?? [];

  const handleSelectChroma = async (variantId: number) => {
    // variantId = skinId (base) OU chromaId.
    await api.applySkinId(variantId);
    api.getSelection().then(setSelection);
  };

  // Couche 3 — coachmark on Reroll + AutoRoll, fired the first time the user
  // is in champ select with a locked champion. The "ready" gate ensures the
  // coachmark only shows when the Actions card is actually meaningful (i.e.
  // the user can actually press the buttons we're highlighting).
  const rerollCoach = useCoachmark("rerollCoachSeen", hasLockedChampion);

  const isClientReady = status === "connected";

  if (!isClientReady) {
    return (
      <div className="app">
        <Header status={status} phase={phase} iconId={iconId} />
        <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
          <div className="mx-auto w-full max-w-[720px] px-2 sm:px-4">
            <EmptyState
              icon={<WifiOff className="h-6 w-6" aria-hidden />}
              eyebrow="Standby"
              title={
                <>
                  Waiting for <GradientText>League</GradientText>
                </>
              }
              description="SkinPicker hooks in the moment your client opens — just launch League."
              status={{
                label:
                  status === "checking"
                    ? "Looking for the client…"
                    : "Client not detected",
                tone: "warning",
              }}
            />
          </div>
        </main>
      </div>
    );
  }

  // ----- Connected: standby OR champ select with smooth choreography -----
  // The Preview card is always mounted and uses Framer's `layout` prop so
  // its size animates between full-width (standby) and 8/12 (champ select).
  // The Details card (4/12) and the bottom-row swap (Carousel ↔ Actions)
  // ride AnimatePresence so they fade/slide in and out coordinated with
  // the Preview's resize. LayoutGroup ties them together so the timing
  // matches across siblings.
  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
        <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-4">
          <LayoutGroup>
            <div className="grid grid-cols-12 gap-6">
              {/* ---------- Preview Card (resizes between modes) ---------- */}
              <motion.div
                layout
                transition={LAYOUT_TRANSITION}
                className={cn(
                  "col-span-12",
                  inChampSelect && "xl:col-span-8"
                )}
              >
                <PreviewCard
                  selection={previewSelection}
                  chromaColor={chromaColor}
                  inChampSelect={inChampSelect}
                  hasLockedChampion={hasLockedChampion}
                  previewChromas={previewChromas}
                  onSelectChroma={handleSelectChroma}
                  reduced={!!reduced}
                />
              </motion.div>

              {/* ---------- Details Card (champ select only) ---------- */}
              <AnimatePresence>
                {inChampSelect && (
                  <motion.div
                    layout
                    key="details"
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 32 }}
                    transition={LAYOUT_TRANSITION}
                    className="col-span-12 xl:col-span-4"
                  >
                    <GlassCard className="flex h-full flex-col gap-4">
                      <CardHeader eyebrow="Selection" title="Live Details" />
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                        <DetailItem
                          label="Phase"
                          value={<AnimatedValue value={phase} />}
                        />
                        <DetailItem
                          label="Champion"
                          value={<AnimatedValue value={championLabel} />}
                        />
                        <DetailItem
                          label="Skin"
                          value={<AnimatedValue value={String(skinLabel)} />}
                        />
                        <DetailItem
                          label="Chroma"
                          value={<AnimatedValue value={String(chromaLabel)} />}
                        />
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---------- Bottom Row: Actions ↔ Carousel ---------- */}
              <motion.div layout className="col-span-12">
                <AnimatePresence mode="wait">
                  {inChampSelect ? (
                    <motion.div
                      key="actions"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={LAYOUT_TRANSITION}
                    >
                      <GlassCard className="relative flex flex-col gap-4">
                        <CardHeader
                          eyebrow="Actions"
                          title="Reroll"
                          trailing={<AutoRollPill />}
                        />
                        <RerollActions
                          phase={phase}
                          status={status}
                          selection={selection}
                          skins={skins}
                          onChanged={() =>
                            api.getSelection().then(setSelection)
                          }
                        />
                        {/* Coachmark anchored inline below RerollActions —
                            only meaningful (and only visible) when a
                            champion is locked, since that's when the
                            buttons it points at are interactive. */}
                        <Coachmark
                          visible={rerollCoach.visible}
                          onDismiss={rerollCoach.dismiss}
                          arrow="top"
                          className="mx-auto mt-4"
                          title="Don't like the roll?"
                          description="Hit Reroll for another, or toggle Auto-roll off to keep the current skin between games."
                        />
                      </GlassCard>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="carousel"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={LAYOUT_TRANSITION}
                    >
                      <RecentSkinsCarousel
                        skins={recentSkins}
                        onPreviewSkin={handleCarouselPreview}
                        isFallback={recentIsFallback}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </LayoutGroup>
        </div>
      </main>
    </div>
  );
}

/* ---------- Preview Card subcomponent ---------- */

function PreviewCard({
  selection,
  chromaColor,
  inChampSelect,
  hasLockedChampion,
  previewChromas,
  onSelectChroma,
  reduced,
}: {
  selection: Selection;
  chromaColor: string | null;
  inChampSelect: boolean;
  hasLockedChampion: boolean;
  previewChromas: { id: number; name: string }[];
  onSelectChroma: (id: number) => Promise<void>;
  reduced: boolean;
}) {
  const inStandby = !inChampSelect;

  // boxShadow choreography:
  //  - With chromaColor + standby: slow pulse to feel alive
  //  - With chromaColor + champ select: static glow (matches in-game intent)
  //  - Without chromaColor: no shadow
  const shadow = chromaColor
    ? inStandby && !reduced
      ? {
          boxShadow: [
            `0 30px 100px -20px ${chromaColor}66`,
            `0 30px 140px -20px ${chromaColor}cc`,
            `0 30px 100px -20px ${chromaColor}66`,
          ],
        }
      : { boxShadow: `0 30px 120px -20px ${chromaColor}` }
    : { boxShadow: "0 0 0 transparent" };

  const shadowTransition =
    inStandby && !reduced
      ? { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 0.5 };

  return (
    <motion.div
      animate={shadow}
      transition={shadowTransition}
      style={{
        borderColor: chromaColor || undefined,
        backgroundImage: chromaColor
          ? `radial-gradient(ellipse 120% 80% at 50% -10%, ${chromaColor} 0%, transparent 55%)`
          : undefined,
      }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-glass backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "transition-[border-color] duration-500",
        !chromaColor && "hover:border-white/15"
      )}
    >
      <div className="flex flex-col gap-4">
        <CardHeader
          eyebrow="Preview"
          title={
            <>
              Skin <GradientText>Spotlight</GradientText>
            </>
          }
          trailing={
            <StatusPill
              variant={
                hasLockedChampion ? "ready" : inChampSelect ? "idle" : "standby"
              }
            >
              {hasLockedChampion
                ? "Ready"
                : inChampSelect
                ? "Waiting"
                : "Standby"}
            </StatusPill>
          }
        />
        <SkinPreview
          selection={selection}
          chromas={hasLockedChampion ? previewChromas : []}
          onSelectChroma={hasLockedChampion ? onSelectChroma : undefined}
          // Don't expose the exclusion toggle while in standby: a recent-pick
          // splash showcased there is read-only ambient content; making it
          // mutable from a passive view would surprise users.
          showInclusionToggle={inChampSelect}
        />
      </div>
      {/* Subtle ambient sparkles only in standby — adds life to the idle
          state without competing with the in-game splash glow. */}
      {inStandby && !reduced && <StandbyParticles />}
    </motion.div>
  );
}

/* ---------- Standby ambient particles ---------- */

function StandbyParticles() {
  // Static set of positions/delays so React doesn't reshuffle them on every
  // re-render (which would re-trigger Framer animations and feel jittery).
  const sparkles = [
    { top: "12%", left: "18%", delay: 0 },
    { top: "30%", left: "82%", delay: 0.6 },
    { top: "55%", left: "9%", delay: 1.2 },
    { top: "70%", left: "74%", delay: 1.8 },
    { top: "85%", left: "32%", delay: 2.4 },
    { top: "20%", left: "55%", delay: 3.0 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            top: s.top,
            left: s.left,
            boxShadow: "0 0 8px rgba(255,255,255,0.85)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 2.4,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Local primitives (scoped to Home) ---------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="m-0 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="m-0 mt-1.5 text-[0.95rem] font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function StatusPill({
  children,
  variant = "idle",
}: {
  children: React.ReactNode;
  variant?: "ready" | "idle" | "standby";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
        // Convention couleurs : emerald = etat temporaire positif (ready, synced,
        // dispo), accent = identite/CTA permanents, white = neutral idle.
        variant === "ready"
          ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/40"
          : variant === "standby"
          ? "bg-accent/12 text-white/85 ring-1 ring-accent/30"
          : "bg-white/[0.04] text-ink/80 ring-1 ring-white/10"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse-slow",
          variant === "ready"
            ? "bg-emerald-300"
            : variant === "standby"
            ? "bg-accent-strong"
            : "bg-white/40"
        )}
      />
      {children}
    </span>
  );
}
