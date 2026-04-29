import Header from "@/components/layout/Header";
import SkinPreview from "@/components/skin/SkinPreview";
import RerollActions from "@/components/controls/RerollActions";
import AutoRollPill from "@/components/controls/AutoRollPill";
import { GlassCard, Reveal, GradientText, CardHeader } from "@/components/ui";

import { useConnection } from "@/features/hooks/useConnection";
import { useGameflow } from "@/features/hooks/useGameflow";
import { useOwnedSkins } from "@/features/hooks/useOwnedSkins";
import { useSelection } from "@/features/hooks/useSelection";
import { useChromaColor } from "@/features/hooks/useChromaColor";
import { api } from "@/features/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const CROSSFADE = { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };

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
  const chromaColor = useChromaColor(selection);

  const hasLockedChampion =
    selection.championId !== 0 && selection.locked && phase === "ChampSelect";

  const activeSkin = skins.find((s) => s.id === selection.skinId);
  const activeChroma = activeSkin?.chromas?.find(
    (c) => c.id === selection.chromaId
  );

  const skinLabel =
    phase === "ChampSelect"
      ? activeSkin
        ? activeSkin.name
        : selection.skinId || "Waiting for lock-in"
      : "...";

  const chromaLabel =
    phase === "ChampSelect"
      ? activeSkin
        ? activeChroma
          ? extractChromaColor(activeChroma.name)
          : "Default"
        : "Waiting for lock-in"
      : "...";

  const championLabel =
    phase === "ChampSelect"
      ? hasLockedChampion
        ? selection.championAlias
        : "Waiting for lock-in"
      : "...";

  const previewChromas = activeSkin?.chromas ?? [];

  const handleSelectChroma = async (variantId: number) => {
    // variantId = skinId (base) OU chromaId.
    await api.applySkinId(variantId);
    api.getSelection().then(setSelection);
  };

  return (
    <div className="app">
      <Header status={status} phase={phase} iconId={iconId} />
      <main className="relative flex flex-col items-center px-4 pb-12 pt-7">
        <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-4">
          <div className="grid grid-cols-12 gap-6">
            {/* ---------- Preview Card (star of the screen) ---------- */}
            <Reveal delay={0} className="col-span-12 xl:col-span-8">
              <GlassCard
                hover={false}
                className={cn(
                  "flex flex-col gap-4 shadow-hero-frame",
                  "transition-[box-shadow,border-color] duration-500",
                  !chromaColor && "hover:border-white/15"
                )}
                style={
                  chromaColor
                    ? {
                        borderColor: chromaColor,
                        boxShadow: `0 30px 120px -20px ${chromaColor}`,
                        backgroundImage: `radial-gradient(ellipse 120% 80% at 50% -10%, ${chromaColor} 0%, transparent 55%)`,
                      }
                    : undefined
                }
              >
                <CardHeader
                  eyebrow="Preview"
                  title={
                    <>
                      Skin <GradientText>Spotlight</GradientText>
                    </>
                  }
                  trailing={
                    <StatusPill variant={hasLockedChampion ? "ready" : "idle"}>
                      {hasLockedChampion ? "Ready" : "Waiting"}
                    </StatusPill>
                  }
                />
                <SkinPreview
                  selection={selection}
                  chromas={hasLockedChampion ? previewChromas : []}
                  onSelectChroma={hasLockedChampion ? handleSelectChroma : undefined}
                />
              </GlassCard>
            </Reveal>

            {/* ---------- Details Card ---------- */}
            <Reveal delay={0.08} className="col-span-12 xl:col-span-4">
              <GlassCard className="flex h-full flex-col gap-4">
                <CardHeader eyebrow="Selection" title="Live Details" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                  <DetailItem label="Phase" value={<AnimatedValue value={phase} />} />
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
            </Reveal>

            {/* ---------- Actions Card (Reroll) ---------- */}
            <Reveal delay={0.16} className="col-span-12">
              <GlassCard className="flex flex-col gap-4">
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
                  onChanged={() => api.getSelection().then(setSelection)}
                />
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </main>
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
  variant?: "ready" | "idle";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
        // Convention couleurs : emerald = etat temporaire positif (ready, synced,
        // dispo), violet (accent) = identite/CTA permanents.
        variant === "ready"
          ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/40"
          : "bg-white/[0.04] text-ink/80 ring-1 ring-white/10"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "ready"
            ? "bg-emerald-300 animate-pulse-slow"
            : "bg-white/40"
        )}
      />
      {children}
    </span>
  );
}

