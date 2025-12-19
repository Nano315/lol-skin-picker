import { useState, useEffect } from "react";
import styles from "./ControlBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDice, 
  faPalette, 
  faUsers,
  faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/features/api";
import { roomsClient } from "@/features/roomsClient";
import type { OwnedSkin, Selection } from "@/features/types";
import type { RoomState, GroupSkinOption } from "@/features/roomsClient";
type ControlBarProps = {
  // Application State
  phase: string;
  selection: Selection;
  skins: OwnedSkin[];
  onChanged: () => void;
  // Room Context (Optional)
  room?: RoomState;
  isOwner?: boolean;
  activeRoomColor?: string; // The color currently "suggested" or active for the room
  skinOptions?: GroupSkinOption[]; // The current user's skin options that match colors
};
export default function ControlBar({
  phase,
  selection,
  skins,
  onChanged,
  room,
  isOwner = false,
  activeRoomColor,
  skinOptions,
}: ControlBarProps) {
  // --- Derived State ---
  const notInChampSelect = phase !== "ChampSelect";
  const noChampion = selection.championId === 0;
  const notLocked = !selection.locked;
  
  // Can we operate at all?
  const canInteract = !notInChampSelect && !noChampion && !notLocked;
  // Do we have chromas for the *current* skin?
  const currentSkinId = selection.skinId;
  const currentSkin = skins.find((s) => s.id === currentSkinId);
  const hasChromas = (currentSkin?.chromas?.length ?? 0) > 0;
  // --- Commander / Group Logic ---
  // Available synergy colors
  const synergyColors = (room?.synergy?.colors ?? []).filter(
    (c) => c.combinationCount > 0
  );
  // Local state for the "selected" color to sync (for Owner)
  const [selectedSynergyColor, setSelectedSynergyColor] = useState<string | null>(null);
  // Auto-select first color if none selected
  useEffect(() => {
    if (!selectedSynergyColor && synergyColors.length > 0) {
      setSelectedSynergyColor(synergyColors[0].color);
    }
  }, [synergyColors, selectedSynergyColor]);
  const handleGroupSync = () => {
    if (!selectedSynergyColor) return;
    roomsClient.requestGroupReroll({
      type: "sameColor",
      color: selectedSynergyColor,
    });
  };
  // --- Smart Action Logic (Synergy Button) ---
  
  // Helper: Find all valid { skinId, chromaId } pairs that match the active color
  const getSynergyCandidates = () => {
    if (!activeRoomColor) return [];
    
    const candidates: { skinId: number; chromaId: number }[] = [];
    const colorLower = activeRoomColor.toLowerCase();

    // Strategy 1: Use provided skinOptions (Exact Hex matching) -> Preferred
    if (skinOptions && skinOptions.length > 0) {
      for (const opt of skinOptions) {
        if (opt.auraColor === activeRoomColor) {
          candidates.push({ skinId: opt.skinId, chromaId: opt.chromaId });
        }
      }
      return candidates;
    }

    // Strategy 2: Fallback to Name matching (if no options provided)
    for (const skin of skins) {
      // Check chromas
      if (skin.chromas) {
        for (const chroma of skin.chromas) {
          if (chroma.name.toLowerCase().includes(colorLower)) {
            candidates.push({ skinId: skin.id, chromaId: chroma.id });
          }
        }
      }
      // Also allow base skin if it magically matches name (unlikely for colors but possible)
      // or if we decide base skin counts. User emphasized "possess a chroma matching",
      // but usually we include base if it matches. 
    }
    return candidates;
  };

  const synergyCandidates = getSynergyCandidates();
  const canSynergyReroll = canInteract && synergyCandidates.length > 0;
  
  const handleSynergyReroll = async () => {
    if (synergyCandidates.length === 0) return;
    
    // Pick a random candidate
    // Try to pick one that isn't the current one, if multiple exist
    let pool = synergyCandidates;
    if (pool.length > 1) {
      pool = pool.filter(c => c.skinId !== selection.skinId || c.chromaId !== (selection.chromaId || 0));
      if (pool.length === 0) pool = synergyCandidates; // Should not happen if length > 1 but safe fallback
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];

    // Apply
    await api.setSkin(pick.skinId);
    if (pick.chromaId !== 0) {
      // Small delay to ensure skin is set? Usually LCU handles rapid requests okay-ish, 
      // but await setSkin shoud be enough.
      await api.setChroma(pick.chromaId);
    }
    onChanged();
  };

  // Visuals
  const showMagicButton = !!activeRoomColor && canSynergyReroll;
  return (
    <div className={styles.container}>
      {/* 1. Commander Strip (Owner Only) */}
      {isOwner && room && synergyColors.length > 0 && selection.locked === true && (
        <div className={styles.commanderStrip}>
          <div className={styles.stripLabel}>Team Command</div>
          <div className={styles.colorSelector}>
            {synergyColors.map((c) => (
              <button
                key={c.color}
                className={`${styles.colorOption} ${selectedSynergyColor === c.color ? styles.active : ""}`}
                style={{ "--opt-color": c.color } as React.CSSProperties}
                onClick={() => setSelectedSynergyColor(c.color)}
                title={`${c.combinationCount} combinations`}
              >
                <div className={styles.colorCount}>{c.combinationCount}</div>
              </button>
            ))}
          </div>
          <button 
            className={styles.syncButton} 
            onClick={handleGroupSync}
            disabled={!selectedSynergyColor}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>Sync Team to Color</span>
          </button>
        </div>
      )}
      {/* 2. Suggestion Strip (Member Only) */}
      {!isOwner && room && synergyColors.length > 0 && (
        <div className={styles.commanderStrip}>
          <div className={styles.stripLabel}>Suggestions</div>
          <div className={styles.suggestionStrip}>
            {synergyColors.map((c) => (
              <div
                key={c.color}
                className={styles.colorOption}
                style={{ "--opt-color": c.color, cursor: 'default' } as React.CSSProperties}
                title={`${c.combinationCount} combinations`}
              />
            ))}
          </div>
        </div>
      )}
      {/* 3. Main Controls */}
      <div className={styles.mainControls}>
        {!canInteract ? (
          <p className={styles.muted}>Lock in a champion to enable controls.</p>
        ) : (
          <>
            {/* Logic: If Smart Action is available, it takes prominence. 
                User requested: "Replaces the generic reroll actions or sits prominently beside them".
                We'll place it beside if there's room, or replace if high confidence. 
                Let's place it *instead* of Primary if active, OR keep Primary as well?
                "Replaces ... or sits beside". 
                Let's make it: [ Magic Match ] [ Random Skin ] [ Chroma ]
                If matched, maybe Magic becomes "Reshuffle Match".
            */}
            
            {showMagicButton && (
              <button 
                className={`${styles.button} ${styles.buttonMagic}`}
                onClick={handleSynergyReroll}
              >
                <FontAwesomeIcon icon={faWandMagicSparkles} className={styles.magicIcon} />
                <span>Match Team</span>
              </button>
            )}
            <button 
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => api.rerollSkin()}
              title="Random Skin"
            >
              <FontAwesomeIcon icon={faDice} size="lg" />
              <span>{showMagicButton ? "Random" : "Random Skin"}</span>
            </button>
            {hasChromas && (
              <button 
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => api.rerollChroma()}
                title="Shuffle Chroma"
              >
                <FontAwesomeIcon icon={faPalette} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
