import GradientText from "@/components/GradientText/GradientText";
import { faPalette, faDice } from "@fortawesome/free-solid-svg-icons";
import type { OwnedSkin } from "@/features/types";
import { api } from "@/features/api";

export default function RerollControls({
  phase,
  selection,
  skins,
}: {
  phase: string;
  selection: { championId: number; skinId: number };
  skins: OwnedSkin[];
  onChanged: () => void;
}) {
  if (phase !== "ChampSelect" || selection.championId === 0) return null;

  const selectedSkin = skins.find((s) => s.id === selection.skinId);
  const hasChromas =
    !!selectedSkin &&
    selectedSkin.chromas.some((chroma) => chroma.id !== selectedSkin.id);

  return (
    <div className="reroll-wrapper">
      <button className="reroll-btn" onClick={() => api.rerollSkin()}>
        <GradientText
          className="reroll-text"
          animationSpeed={6}
          colors={["#ffffff", "#a3a3a3ff", "#ffffff", "#a3a3a3ff", "#ffffff"]}
          icon={faDice}
          iconSize={"1.9em"}
          gap={"1em"}
        >
          Reroll Skin
        </GradientText>
      </button>

      {hasChromas && (
        <button className="reroll-btn" onClick={() => api.rerollChroma()}>
          <GradientText
            className="reroll-text"
            animationSpeed={6}
            colors={["#6248FF", "#E5FF48", "#FF48ED", "#48BDFF", "#6248FF"]}
            icon={faPalette}
            iconSize={"1.9em"}
            gap={"1em"}
          >
            Reroll Chroma
          </GradientText>
        </button>
      )}
    </div>
  );
}
