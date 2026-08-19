import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { api } from "@/features/api";
import { extractChromaColor } from "@/features/utils/displayText";
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
            label={extractChromaColor(c.name)}
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
  //
  // Deux details non negociables sur cette valeur, sous peine de revoir des
  // aretes parasites a l'interieur du rond :
  //
  //  • `border-box` — sans lui, `background-origin` vaut `padding-box` : le
  //    degrade est calcule sur 19x19 (22 moins les 2x1.5px de bordure) mais
  //    peint sur 22x22, donc `background-repeat` recopie un bout de motif sur
  //    le bord droit et bas. La diagonale ne passe alors plus par le centre et
  //    laisse une couture nette dans l'anneau. Invisible sur une couleur
  //    pleine — la repeter donne la meme couleur — d'ou un bug limite a la
  //    seule pastille "Default".
  //
  //  • butee franche a 50% plutot qu'une bande 48%→52% : sur 22px cette bande
  //    fait moins d'un pixel et ne rend qu'un liseré sale.
  const background = isBase
    ? "linear-gradient(135deg, #f5f5f5 0 50%, #1a1a1a 50% 100%) border-box"
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
      {/*
        `.chroma-ball-inner` (inset 2px, `background: inherit`) repeindrait la
        diagonale de la pastille "Default" sur une boite plus petite de 4px :
        les deux diagonales ne tomberaient plus au meme endroit, ce qui
        reintroduirait l'arete que le `border-box` ci-dessus elimine. Comme
        l'element ne peint QUE ce fond, ne pas le rendre du tout revient au
        meme que le neutraliser.
      */}
      {!isBase && <span className="chroma-ball-inner" aria-hidden />}
    </motion.button>
  );
}
