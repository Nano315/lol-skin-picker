import { useEffect, useMemo, useState } from "react";
import type { RoomState, ColorSynergy } from "@/features/roomsClient";
import { roomsClient } from "@/features/roomsClient";
import GradientText from "@/components/GradientText/GradientText";
import { faDice } from "@fortawesome/free-solid-svg-icons";

type Props = {
  room: RoomState;
  phase: string;
  isOwner: boolean;
  selectionLocked: boolean; // ton selection.locked local
};

function makeKey(c: ColorSynergy) {
  return `color:${c.color}`;
}

export function GroupRerollControls({
  room,
  phase,
  isOwner,
  selectionLocked,
}: Props) {
  // On ne garde que les couleurs qui ont au moins 1 combinaison possible
  const colors = (room.synergy?.colors ?? []).filter(
    (c) => c.combinationCount > 0
  );

  const allReady = useMemo(() => {
    if (!room.members.length) return false;
    return room.members.every((m) => m.championId !== 0 && m.ready);
  }, [room.members]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // synchroniser la sélection quand les options changent
  useEffect(() => {
    if (!colors.length) {
      setSelectedKey(null);
      return;
    }
    if (selectedKey && colors.some((c) => makeKey(c) === selectedKey)) {
      return; // clé actuelle encore valide
    }
    setSelectedKey(makeKey(colors[0]));
  }, [colors, selectedKey]);

  // Conditions d’affichage => comme les rerolls solo, mais au niveau du groupe
  if (!isOwner) return null;
  if (phase !== "ChampSelect") return null;
  if (!selectionLocked) return null;
  if (!allReady) return null;
  if (!colors.length) return null;

  const selected = colors.find((c) => makeKey(c) === selectedKey) ?? colors[0];

  const handleReroll = () => {
    if (!selected) return;
    roomsClient.requestGroupReroll({
      type: "sameColor",
      color: selected.color,
    });
  };

  return (
    <div className="group-reroll-wrapper">
      <div className="group-reroll-label">Group Reroll</div>

      <div className="group-reroll-controls">
        <div className="group-reroll-select-wrapper">
          <select
            className="group-reroll-select"
            value={selectedKey ?? ""}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            {colors.map((c) => {
              const key = makeKey(c);
              const combos = c.combinationCount;
              return (
                <option key={key} value={key}>
                  {c.color} • {combos} combinaison
                  {combos > 1 ? "s" : ""}
                </option>
              );
            })}
          </select>

          {/* petit rond de couleur pour prévisualiser */}
          <span
            className="group-reroll-color-dot"
            style={{ backgroundColor: selected.color }}
          />
        </div>

        <button className="reroll-btn" onClick={handleReroll}>
          <GradientText
            className="reroll-text group-reroll-text"
            animationSpeed={6}
            colors={["#6248FF", "#E5FF48", "#FF48ED", "#48BDFF", "#6248FF"]}
            icon={faDice}
            iconSize={"1.9em"}
            gap={"1em"}
          >
            Reroll Group
          </GradientText>
        </button>
      </div>
    </div>
  );
}
