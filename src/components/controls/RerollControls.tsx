import GradientText from "@/components/GradientText/GradientText";
import { faPalette, faDice, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import type { OwnedSkin, Selection } from "@/features/types";
import { api } from "@/features/api";
import type { GroupSkinOption } from "@/features/roomsClient";

export default function RerollControls({
  phase,
  selection,
  skins,
  activeRoomColor,
  skinOptions,
  onChanged,
}: {
  phase: string;
  selection: Selection;
  skins: OwnedSkin[];
  activeRoomColor?: string;
  skinOptions?: GroupSkinOption[];
  onChanged: () => void;
}) {
  const notInChampSelect = phase !== "ChampSelect";
  const noChampion = selection.championId === 0;
  const notLocked = !selection.locked;
  const canReroll = !notInChampSelect && !noChampion && !notLocked;

  const hasChromas = !!skins.find((s) => s.id === selection.skinId)?.chromas
    ?.length;

  // --- Solo Color Reroll Logic ---
  const matchingSkins = activeRoomColor
    ? skins.filter((s) => {
      const colorLower = activeRoomColor.toLowerCase();

      // Strategy 1: Use provided skinOptions (Hex matching)
      if (skinOptions) {
        // Check if any option for this skin (or its chromas) matches the room color
        return skinOptions.some(opt =>
          opt.skinId === s.id &&
          opt.auraColor === activeRoomColor
        );
      }
      // Strategy 2: Fallback to Name matching
      return s.chromas.some((c) => c.name.toLowerCase().includes(colorLower));
    })
    : [];
  const canSoloReroll = canReroll && matchingSkins.length >= 2;
  const handleSoloColorReroll = async () => {
    if (matchingSkins.length < 2) return;
    // Pick a random skin from matching ones
    const currentSkinId = selection.skinId;
    const available = matchingSkins.filter((s) => s.id !== currentSkinId);
    const pool = available.length > 0 ? available : matchingSkins;
    const randomSkin = pool[Math.floor(Math.random() * pool.length)];
    // Find the matching chroma for this skin
    let matchingChromaId = 0;
    if (skinOptions) {
      const match = skinOptions.find(opt =>
        opt.skinId === randomSkin.id &&
        opt.auraColor === activeRoomColor
      );
      if (match) matchingChromaId = match.chromaId;
    } else {
      const colorLower = activeRoomColor!.toLowerCase();
      const match = randomSkin.chromas.find((c) =>
        c.name.toLowerCase().includes(colorLower)
      );
      if (match) matchingChromaId = match.id;
    }
    if (matchingChromaId || (skinOptions && matchingChromaId === 0)) {
      // Note: matchingChromaId === 0 means the base skin matches the color
      await api.setSkin(randomSkin.id);
      if (matchingChromaId !== 0) {
        await api.setChroma(matchingChromaId);
      }
      onChanged();
    }
  };

  return (
    <div className="reroll-wrapper">
      {!canReroll && (
        <p className="muted">Lock in a champion to enable reroll.</p>
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

          {canSoloReroll && (
            <button className="reroll-btn" onClick={handleSoloColorReroll}>
              <GradientText
                className="reroll-text"
                animationSpeed={6}
                // Use activeRoomColor for gradient if it's a valid hex, otherwise fallback
                colors={
                  activeRoomColor?.startsWith("#")
                    ? [activeRoomColor, "#ffffff", activeRoomColor, "#ffffff", activeRoomColor]
                    : ["#FFD700", "#8A2BE2", "#FFD700", "#8A2BE2", "#FFD700"]
                }
                icon={faArrowsRotate}
                iconSize={"1.9em"}
                gap={"1em"}
              >
                Reroll Color
              </GradientText>
            </button>
          )}
        </>
      )}
    </div>
  );
}
