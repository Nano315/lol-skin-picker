import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { api } from "@/features/api";
import { cn } from "@/lib/utils";

type Chroma = { id: number; name: string };

type ChromaBallsProps = {
  championId: number;
  skinId: number;
  chromas: Chroma[];
  currentChromaId: number;
  onSelect: (chromaId: number) => void;
  /** Opt-out of selection while the app is busy elsewhere. */
  disabled?: boolean;
};

/**
 * LCU chroma names look like "Bard Café Chouchous (turquoise)".
 * Extract the parenthesized token for tooltips — the skin name is already
 * visible elsewhere on screen.
 */
function prettyChromaName(fullName: string) {
  const match = fullName.match(/\(([^)]+)\)/);
  const raw = (match?.[1] ?? fullName).trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Overlay sélecteur de chromas, posé sur le splash art. "Default" = base
 * (pas de chroma), puis un pastille par chroma de la palette.
 *
 * On batch-fetch les couleurs via une seule IPC pour éviter N requêtes
 * CommunityDragon quand un skin a 8+ chromas.
 */
export default function ChromaBalls({
  championId,
  skinId,
  chromas,
  currentChromaId,
  onSelect,
  disabled = false,
}: ChromaBallsProps) {
  const reduced = useReducedMotion();
  const [colors, setColors] = useState<Record<number, string | null>>({});

  useEffect(() => {
    let cancelled = false;
    if (!championId || !skinId || chromas.length === 0) {
      setColors({});
      return;
    }
    api
      .getSkinChromaColors(championId, skinId)
      .then((map) => {
        if (!cancelled) setColors(map);
      })
      .catch(() => {
        if (!cancelled) setColors({});
      });
    return () => {
      cancelled = true;
    };
  }, [championId, skinId, chromas.length]);

  if (chromas.length === 0) return null;

  const isBaseActive = !currentChromaId;

  return (
    <div className="chroma-balls" role="group" aria-label="Chroma palette">
      <Ball
        label="Default"
        color={null}
        active={isBaseActive}
        disabled={disabled}
        reduced={!!reduced}
        isBase
        onClick={() => onSelect(skinId)}
      />
      {chromas.map((c) => {
        const active = c.id === currentChromaId;
        return (
          <Ball
            key={c.id}
            label={prettyChromaName(c.name)}
            color={colors[c.id] ?? null}
            active={active}
            disabled={disabled}
            reduced={!!reduced}
            onClick={() => onSelect(c.id)}
          />
        );
      })}
    </div>
  );
}

function Ball({
  label,
  color,
  active,
  disabled,
  reduced,
  isBase = false,
  onClick,
}: {
  label: string;
  color: string | null;
  active: boolean;
  disabled: boolean;
  reduced: boolean;
  isBase?: boolean;
  onClick: () => void;
}) {
  // Diagonal white+grey gradient for "Default" pastille, plain color otherwise.
  const background = isBase
    ? "linear-gradient(135deg, #f5f5f5 0%, #f5f5f5 48%, #1a1a1a 52%, #1a1a1a 100%)"
    : color ?? "rgba(255,255,255,0.12)";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={reduced || disabled ? undefined : { scale: 1.12, y: -2 }}
      whileTap={reduced || disabled ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 500, damping: 26 }}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn("chroma-ball", active && "is-active")}
      style={{ background }}
    >
      <span className="chroma-ball-inner" aria-hidden />
    </motion.button>
  );
}
