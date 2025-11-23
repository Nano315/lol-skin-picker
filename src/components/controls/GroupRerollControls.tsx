// GroupRerollControls.tsx
import { useEffect, useMemo, useState } from "react";
import type { RoomState, ColorSynergy } from "@/features/roomsClient";
import { roomsClient } from "@/features/roomsClient";
import GradientText from "@/components/GradientText/GradientText";
import { faDice } from "@fortawesome/free-solid-svg-icons";

type Props = {
  room: RoomState;
  phase: string;
  isOwner: boolean;
  selectionLocked: boolean;
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
  const colors = (room.synergy?.colors ?? []).filter(
    (c) => c.combinationCount > 0
  );

  const allReady = useMemo(() => {
    if (!room.members.length) return false;
    return room.members.every((m) => m.championId !== 0 && m.ready);
  }, [room.members]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!colors.length) {
      setSelectedKey(null);
      setOpen(false);
      return;
    }
    if (selectedKey && colors.some((c) => makeKey(c) === selectedKey)) {
      return;
    }
    setSelectedKey(makeKey(colors[0]));
  }, [colors, selectedKey]);

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

  const selectedLabel = (() => {
    const combos = selected.combinationCount;
    return `${combos} combinaison${combos > 1 ? "s" : ""}`;
  })();

  return (
    <div className="group-reroll-wrapper">
      <div className="group-reroll-label">Group Reroll</div>

      <div className="group-reroll-controls">
        <div className="group-reroll-select-wrapper">
          {/* Trigger custom "select" */}
          <button
            type="button"
            className="group-reroll-trigger"
            onClick={() => setOpen((o) => !o)}
          >
            <div className="group-reroll-trigger-main">
              <span
                className="group-reroll-chip"
                style={{ backgroundColor: selected.color }}
              />
              <span className="group-reroll-trigger-text">{selectedLabel}</span>
            </div>
            <span className="group-reroll-trigger-caret">▾</span>
          </button>

          {/* Dropdown options */}
          {open && (
            <div className="group-reroll-dropdown">
              {colors.map((c) => {
                const key = makeKey(c);
                const combos = c.combinationCount;
                const label = `${combos} combo${combos > 1 ? "s" : ""}`;

                const isActive = key === selectedKey;

                return (
                  <button
                    key={key}
                    type="button"
                    className={
                      "group-reroll-option" +
                      (isActive ? " group-reroll-option--active" : "")
                    }
                    onClick={() => {
                      setSelectedKey(key);
                      setOpen(false);
                    }}
                  >
                    <span
                      className="group-reroll-chip"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="group-reroll-option-text">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
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
