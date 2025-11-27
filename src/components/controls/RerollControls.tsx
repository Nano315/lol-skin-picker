import GradientText from "@/components/GradientText/GradientText";
import { faPalette, faDice } from "@fortawesome/free-solid-svg-icons";
import type { OwnedSkin, Selection } from "@/features/types";
import { api } from "@/features/api";

export default function RerollControls({
  phase,
  selection,
  skins,
}: {
  phase: string;
  selection: Selection;
  skins: OwnedSkin[];
  onChanged: () => void;
}) {
  const notInChampSelect = phase !== "ChampSelect";
  const noChampion = selection.championId === 0;
  const notLocked = !selection.locked;
  const canReroll = !notInChampSelect && !noChampion && !notLocked;

  const hasChromas = !!skins.find((s) => s.id === selection.skinId)?.chromas
    ?.length;

  return (
    <div className="reroll-wrapper">
      {!canReroll && (
        <p className="muted">Verrouille un champion en phase de draft pour activer le reroll.</p>
      )}

      {canReroll && (
        <>
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
        </>
      )}
    </div>
  );
}
