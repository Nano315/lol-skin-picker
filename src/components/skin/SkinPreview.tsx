import fallbackSkin from "/fallback-skin.png?url";
import PriorityButtons from "./PriorityButtons";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function SkinPreview({
  selection,
  showPriorityButtons = true,
}: {
  selection: {
    championId: number;
    championAlias: string;
    skinId: number;
    chromaId: number;
  };
  showPriorityButtons?: boolean;
}) {
  const reduced = useReducedMotion();
  const splashUrl =
    selection.skinId && selection.championAlias
      ? `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
          selection.championAlias
        }_${selection.skinId - selection.championId * 1000}.jpg`
      : "";
  const displayedSkin = splashUrl || fallbackSkin;

  const hasSkin = selection.skinId > 0 && selection.championId > 0;

  // Key combines champion+skin so both changes trigger the crossfade.
  const animKey = `${selection.championId}-${selection.skinId}`;

  return (
    <div className="skin-wrapper">
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={animKey}
          src={displayedSkin}
          alt="current skin"
          className="skin-img"
          initial={reduced ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
      {showPriorityButtons && hasSkin && (
        <div className="skin-priority-overlay">
          <PriorityButtons
            championId={selection.championId}
            skinId={selection.skinId}
          />
        </div>
      )}
    </div>
  );
}
