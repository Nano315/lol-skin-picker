import { useEffect, useRef, useState } from "react";
import { Dices, RefreshCw, Palette, Sparkles, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { api } from "@/features/api";
import { useMatchLock } from "@/features/matchLock/useMatchLock";
import { cn } from "@/lib/utils";
import type { OwnedSkin, Selection, ConnectionStatus } from "@/features/types";

type RerollActionsProps = {
  phase: string;
  status: ConnectionStatus;
  selection: Selection;
  skins: OwnedSkin[];
  onChanged: () => void;
  /**
   * External gating (room sync, group operation in flight, etc.). When true,
   * tous les boutons sont désactivés mais restent visibles pour ne pas
   * shifter le layout.
   */
  disabled?: boolean;
  /**
   * Mode multi (owner only) : ajoute un CTA "Match Team" empilé directement
   * au-dessus du Reroll central (même largeur, même style compact), avec
   * Skin/Chroma sur les flancs de la rangée Reroll. Le bouton reste
   * persistant — juste désactivé quand pas de couleur active ou pas de
   * skin matchant — pour éviter le shift de layout au gré des recalculs
   * de team color.
   */
  synergyAction?: {
    onClick: () => void;
    loading: boolean;
    /** Hex de la couleur active. Si undefined → bouton inactif. */
    color?: string;
    /** Nb de skins matchant la couleur active. 0 → bouton inactif. */
    candidatesCount: number;
  };
};

type ActionKind = "both" | "skin" | "chroma";

/**
 * Refonte Reroll.
 *
 * Hiérarchie horizontale (Home + multi-member) :
 *   [ Skin only ]  [ ── REROLL ── ]  [ Chroma only ]
 * Le hero "Reroll" prend 2/4 de la largeur, les secondaires 1/4 chacun.
 *
 * Layout "stacked CTA" (multi-owner) :
 *
 *                [ ── Match Team ●── ]
 *   [ Skin only ] [ ──── Reroll ──── ] [ Chroma only ]
 *
 * Les 2 CTA (Match Team, Reroll) sont superposés au centre, même largeur
 * (col 2 = 2fr) et même style `compact`. Les secondaires (col 1, col 3)
 * spannent les 2 rangées avec `self-center` : leur centre vertical
 * s'aligne pile sur le milieu du gap entre les CTA, ce qui équilibre
 * l'optique du losange tout en gardant leurs dimensions standard.
 * Match Team reste persistant (juste désactivé) pour éviter le shift de
 * layout au gré des recalculs de team color.
 *
 * Raccourcis clavier : Space = both, S = skin only, C = chroma only.
 */
export default function RerollActions({
  phase,
  status,
  selection,
  skins,
  onChanged,
  disabled: externallyDisabled = false,
  synergyAction,
}: RerollActionsProps) {
  const reduced = useReducedMotion();
  const { locked: matchLocked } = useMatchLock();

  const isConnected = status === "connected";
  const inChampSelect = phase === "ChampSelect";
  const hasChampion = selection.championId !== 0;
  const isLocked = selection.locked === true;
  const canInteract =
    isConnected &&
    inChampSelect &&
    hasChampion &&
    isLocked &&
    !externallyDisabled &&
    !matchLocked;

  const currentSkin = skins.find((s) => s.id === selection.skinId);
  const hasChromas = (currentSkin?.chromas?.length ?? 0) > 0;

  const [loading, setLoading] = useState<ActionKind | null>(null);
  const lockRef = useRef(false);

  async function runAction(kind: ActionKind) {
    if (lockRef.current || !canInteract) return;
    if (kind === "chroma" && !hasChromas) return;

    lockRef.current = true;
    setLoading(kind);
    try {
      if (kind === "both") await api.rerollSkin();
      else if (kind === "skin") await api.rerollSkinOnly();
      else await api.rerollChroma();
      onChanged();
      // Debounce post-action pour éviter le spam + laisser l'anim jouer.
      await new Promise((r) => setTimeout(r, 450));
    } finally {
      lockRef.current = false;
      setLoading(null);
    }
  }

  // Raccourcis clavier. On ignore les events quand un input/textarea est
  // focus, ou quand l'utilisateur tient un modifier (Cmd/Ctrl/Alt) —
  // on ne veut pas intercepter Ctrl+S, Alt+Space, etc.
  useEffect(() => {
    function isEditableTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return target.isContentEditable;
    }

    function onKey(e: KeyboardEvent) {
      if (!canInteract || lockRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isEditableTarget(e.target)) return;

      if (e.code === "Space") {
        e.preventDefault();
        void runAction("both");
      } else if (e.code === "KeyS") {
        e.preventDefault();
        void runAction("skin");
      } else if (e.code === "KeyC" && hasChromas) {
        e.preventDefault();
        void runAction("chroma");
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInteract, hasChromas]);

  // Message de statut quand on ne peut pas du tout interagir (pas connecté,
  // pas en champ select, pas verrouillé). On remplace alors tout par un
  // texte d'attente — le CTA hero doit rester engageant et pas grisé en
  // permanence.
  const statusMessage = !isConnected
    ? "Waiting for League Client..."
    : !inChampSelect
    ? "Waiting for Champion Select..."
    : !hasChampion
    ? "Select a champion..."
    : !isLocked
    ? "Lock in your champion to sync"
    : matchLocked
    ? "Match locked — unlock to reroll"
    : null;

  if (statusMessage) {
    return (
      <div className="flex min-h-[84px] w-full items-center justify-center gap-2 text-sm text-muted">
        {!isConnected && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        <span>{statusMessage}</span>
      </div>
    );
  }

  // ---------- Bundles de props partagés entre layouts ----------
  const skinProps = {
    icon: <RefreshCw className="h-[18px] w-[18px]" aria-hidden />,
    title: "Reroll skin",
    subtitle: "Pick a random skin from your pool",
    shortcut: "S",
    onClick: () => runAction("skin"),
    loading: loading === "skin",
    disabled: externallyDisabled || (!!loading && loading !== "skin"),
    reduced: !!reduced,
  } as const;

  const chromaProps = {
    icon: <Palette className="h-[18px] w-[18px]" aria-hidden />,
    title: "Reroll chroma",
    subtitle: hasChromas
      ? "Cycle the palette of this skin"
      : "This skin has no chromas",
    shortcut: "C",
    onClick: () => runAction("chroma"),
    loading: loading === "chroma",
    disabled:
      !hasChromas || externallyDisabled || (!!loading && loading !== "chroma"),
    dimmed: !hasChromas,
    reduced: !!reduced,
  } as const;

  const bothBaseProps = {
    title: "Reroll",
    subtitle: "Fresh skin and chroma",
    onClick: () => runAction("both"),
    loading: loading === "both",
    disabled: externallyDisabled || (!!loading && loading !== "both"),
    reduced: !!reduced,
    tooltip: "Reroll skin and chroma  ·  Space",
    ariaLabel: "Reroll skin and chroma",
    ariaKeyshortcuts: "Space",
  } as const;

  // ---------- Stacked CTA layout (multi-owner) ----------
  if (synergyAction) {
    const hasColor = !!synergyAction.color;
    const hasCandidates = synergyAction.candidatesCount > 0;
    const synergyDisabled =
      !hasColor || !hasCandidates || externallyDisabled || !!loading;

    const synergySubtitle = !hasColor
      ? "No active team color"
      : !hasCandidates
      ? "No matching skin owned"
      : "Sync to the team color";

    return (
      <div className="grid grid-cols-[1fr_2fr_1fr] items-stretch gap-3">
        {/* Row 1, col 2 : Match Team (au-dessus de Reroll) */}
        <CTAAction
          compact
          className="col-start-2 row-start-1"
          icon={<Sparkles className="h-5 w-5" aria-hidden />}
          title="Match Team"
          subtitle={synergySubtitle}
          badge={
            <span
              className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/40"
              style={{
                background: hasColor
                  ? synergyAction.color
                  : "rgba(255,255,255,0.25)",
              }}
              aria-hidden
            />
          }
          onClick={synergyAction.onClick}
          loading={synergyAction.loading}
          disabled={synergyDisabled}
          reduced={!!reduced}
          tooltip="Pick a skin/chroma matching the team's active color"
          ariaLabel="Match team combo"
        />

        {/* Skin/Chroma spannent les 2 rangées + self-center : leur centre
            vertical s'aligne sur le milieu du gap entre les 2 CTA centraux. */}
        <SecondaryAction
          {...skinProps}
          className="col-start-1 row-span-2 row-start-1 self-center"
        />
        <CTAAction
          {...bothBaseProps}
          compact
          className="col-start-2 row-start-2"
          icon={<Dices className="h-5 w-5" aria-hidden />}
          badge={
            <CTABadge>
              <span aria-hidden>⎵</span>
              <span>Space</span>
            </CTABadge>
          }
        />
        <SecondaryAction
          {...chromaProps}
          className="col-start-3 row-span-2 row-start-1 self-center"
        />
      </div>
    );
  }

  // ---------- Horizontal layout (Home + multi-member) ----------
  return (
    <div className="flex flex-row items-stretch gap-3">
      <SecondaryAction {...skinProps} className="flex-1" />
      <CTAAction
        {...bothBaseProps}
        className="flex-[2]"
        icon={<Dices className="h-6 w-6" aria-hidden />}
        badge={
          <CTABadge>
            <span aria-hidden>⎵</span>
            <span>Space</span>
          </CTABadge>
        }
      />
      <SecondaryAction {...chromaProps} className="flex-1" />
    </div>
  );
}

/* ---------- Sub-components (scoped to RerollActions) ---------- */

function CTAAction({
  icon,
  title,
  subtitle,
  badge,
  compact = false,
  className,
  onClick,
  loading,
  disabled,
  reduced,
  tooltip,
  ariaLabel,
  ariaKeyshortcuts,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  /**
   * `compact` réduit padding, taille d'icône et tailles de texte. À utiliser
   * dans le layout diamond où la cell est étroite.
   */
  compact?: boolean;
  /** Classes de positionnement/sizing imposées par le parent (flex-[2], col-start-2…). */
  className?: string;
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  reduced: boolean;
  tooltip?: string;
  ariaLabel?: string;
  ariaKeyshortcuts?: string;
}) {
  const isDisabled = loading || disabled;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      whileHover={reduced || isDisabled ? undefined : { y: -2 }}
      whileTap={reduced || isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      title={tooltip}
      aria-label={ariaLabel ?? title}
      aria-keyshortcuts={ariaKeyshortcuts}
      className={cn(
        "shine group relative overflow-hidden rounded-3xl text-left text-white",
        "bg-gradient-to-b from-accent-strong to-accent",
        "ring-1 ring-white/20 shadow-accent-glow hover:shadow-accent-glow-strong",
        "transition-shadow duration-300 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "px-4 py-3" : "px-6 py-4",
        className
      )}
    >
      <div className={cn("flex items-center", compact ? "gap-3" : "gap-4")}>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25",
            compact ? "h-9 w-9" : "h-12 w-12"
          )}
        >
          {loading ? (
            <Loader2
              className={cn(
                "animate-spin",
                compact ? "h-5 w-5" : "h-6 w-6"
              )}
              aria-hidden
            />
          ) : (
            icon
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <span
            className={cn(
              "font-bold leading-tight",
              compact ? "text-[14px]" : "text-[17px]"
            )}
          >
            {title}
          </span>
          <span
            className={cn(
              "truncate leading-snug text-white/80",
              compact ? "text-[11.5px]" : "text-[12.5px]"
            )}
          >
            {subtitle}
          </span>
        </div>
        {badge}
      </div>
    </motion.button>
  );
}

function CTABadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white/95 ring-1 ring-white/25 sm:inline-flex">
      {children}
    </div>
  );
}

function SecondaryAction({
  icon,
  title,
  subtitle,
  shortcut,
  className,
  onClick,
  loading,
  disabled,
  dimmed = false,
  reduced,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  shortcut: string;
  /** Classes de positionnement/sizing imposées par le parent. */
  className?: string;
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  dimmed?: boolean;
  reduced: boolean;
}) {
  const isDisabled = loading || disabled;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      whileHover={reduced || isDisabled ? undefined : { y: -2 }}
      whileTap={reduced || isDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      title={`${title}  ·  ${shortcut}`}
      aria-label={title}
      aria-keyshortcuts={shortcut}
      className={cn(
        "group relative overflow-hidden rounded-3xl px-4 py-4",
        "glass border border-white/10 text-left text-ink/90",
        "transition-colors duration-200 focus-visible:outline-none",
        !isDisabled && "hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
        "disabled:cursor-not-allowed",
        dimmed && "opacity-45",
        !dimmed && isDisabled && "opacity-60",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10",
            !dimmed && !isDisabled && "group-hover:bg-white/[0.08]"
          )}
        >
          {loading ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden />
          ) : (
            icon
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-[14px] font-semibold leading-tight text-white">
            {title}
          </span>
          <span className="truncate text-[12px] leading-snug text-white/55">
            {subtitle}
          </span>
        </div>
        <div className="ml-auto hidden shrink-0 items-center gap-1 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10.5px] font-semibold text-white/55 ring-1 ring-white/10 sm:inline-flex">
          {shortcut}
        </div>
      </div>
    </motion.button>
  );
}
