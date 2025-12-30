import { useState, useEffect } from "react";
import styles from "./ControlBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDice, 
  faPalette, 
  faUsers,
  faWandMagicSparkles,
  faSpinner,
  faCircleNotch
} from "@fortawesome/free-solid-svg-icons";
import { api } from "@/features/api";
import { roomsClient } from "@/features/roomsClient";
import type { OwnedSkin, Selection, ConnectionStatus } from "@/features/types";
import type { RoomState, GroupSkinOption } from "@/features/roomsClient";

type ControlBarProps = {
  // Application State
  phase: string;
  status?: ConnectionStatus; // Made optional to support legacy calls if any, but properly passed now
  selection: Selection;
  skins: OwnedSkin[];
  onChanged: () => void;
  // Room Context (Optional)
  room?: RoomState;
  isOwner?: boolean;
  activeRoomColor?: string; // The color currently "suggested" or active for the room
  skinOptions?: GroupSkinOption[]; // The current user's skin options that match colors
  isSyncing?: boolean;
};

export default function ControlBar({
  phase,
  status = "disconnected",
  selection,
  skins,
  onChanged,
  room,
  isOwner = false,
  activeRoomColor,
  skinOptions,
  isSyncing = false
}: ControlBarProps) {
  // --- Derived State ---
  const notInChampSelect = phase !== "ChampSelect";
  const noChampion = selection.championId === 0;
  const notLocked = !selection.locked;
  const isConnected = status === "connected";
  
  // Can we operate at all?
  // We disable interaction if we are not in champ select, or if we are currently syncing
  const canInteract = isConnected && !notInChampSelect && !noChampion && !notLocked && !isSyncing;

  // Do we have chromas for the *current* skin?
  const currentSkinId = selection.skinId;
  const currentSkin = skins.find((s) => s.id === currentSkinId);
  const hasChromas = (currentSkin?.chromas?.length ?? 0) > 0;

  // --- Local Loading States for Buttons ---
  const [isRerollLoading, setIsRerollLoading] = useState(false);
  const [isChromaLoading, setIsChromaLoading] = useState(false);
  const [isMagicLoading, setIsMagicLoading] = useState(false);

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
    }
    return candidates;
  };

  const synergyCandidates = getSynergyCandidates();
  const canSynergyReroll = canInteract && synergyCandidates.length > 0;
  
  const handleSynergyReroll = async () => {
    if (synergyCandidates.length === 0 || isMagicLoading) return;
    setIsMagicLoading(true);
    
    try {
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
        await api.setChroma(pick.chromaId);
      }
      onChanged();
      // Minimum visual delay
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setIsMagicLoading(false);
    }
  };

  const handleRerollSkin = async () => {
    if (isRerollLoading) return;
    setIsRerollLoading(true);
    try {
      await api.rerollSkin();
      // Wait a bit for feedback
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setIsRerollLoading(false);
    }
  };

  const handleRerollChroma = async () => {
    if (isChromaLoading) return;
    setIsChromaLoading(true);
    try {
      await api.rerollChroma();
      await new Promise(r => setTimeout(r, 500));
    } finally {
      setIsChromaLoading(false);
    }
  };

  // --- Status Message Logic ---
  let statusMessage = "Ready";
  let statusIcon = null;

  if (!isConnected) {
    statusMessage = "Waiting for League Client...";
    statusIcon = <FontAwesomeIcon icon={faCircleNotch} spin />;
  } else if (notInChampSelect) {
    statusMessage = "Waiting for Champion Select...";
  } else if (noChampion) {
    statusMessage = "Select a champion...";
  } else if (notLocked) {
     // If we want to enforce locking for syncing, we can say so.
     // The prompt says: Si !selection.locked => "Lock in your champion to sync"
    statusMessage = "Lock in your champion to sync";
  } else if (isSyncing) {
    statusMessage = "Computing synergies...";
    statusIcon = <FontAwesomeIcon icon={faSpinner} spin />;
  }

  // Visuals
  const showMagicButton = !!activeRoomColor && canSynergyReroll;
  
  // Dynamic styles for synergy strip (pulse/opacity if syncing)
  const stripStyle = isSyncing ? { opacity: 0.6, pointerEvents: 'none' as const } : {};

  return (
    <div className={styles.container}>
      {/* 1. Commander Strip (Owner Only) */}
      {isOwner && room && synergyColors.length > 0 && selection.locked === true && (
        <div className={styles.commanderStrip} style={stripStyle}>
          <div className={styles.stripLabel}>Team Command</div>
          <div className={styles.colorSelector}>
            {synergyColors.map((c) => (
              <button
                key={c.color}
                className={`${styles.colorOption} ${selectedSynergyColor === c.color ? styles.active : ""} ${isSyncing ? styles.pulse : ""}`}
                style={{ "--opt-color": c.color } as React.CSSProperties}
                onClick={() => setSelectedSynergyColor(c.color)}
                title={`${c.combinationCount} combinations`}
                disabled={isSyncing}
              >
                <div className={styles.colorCount}>{c.combinationCount}</div>
              </button>
            ))}
          </div>
          <button 
            className={styles.syncButton} 
            onClick={handleGroupSync}
            disabled={!selectedSynergyColor || isSyncing}
          >
            <FontAwesomeIcon icon={faUsers} />
            <span>Sync Team to Color</span>
          </button>
        </div>
      )}
      
      {/* 2. Suggestion Strip (Member Only) */}
      {!isOwner && room && synergyColors.length > 0 && (
        <div className={styles.commanderStrip} style={stripStyle}>
          <div className={styles.stripLabel}>Suggestions</div>
          <div className={styles.suggestionStrip}>
            {synergyColors.map((c) => (
              <div
                key={c.color}
                className={`${styles.colorOption} ${isSyncing ? styles.pulse : ""}`}
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
          <div className={styles.muted}>
             {statusIcon} <span style={{ marginLeft: statusIcon ? 8 : 0 }}>{statusMessage}</span>
          </div>
        ) : (
          <>
            {showMagicButton && (
              <button 
                className={`${styles.button} ${styles.buttonMagic}`}
                onClick={handleSynergyReroll}
                disabled={isMagicLoading}
              >
                {isMagicLoading ? (
                   <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                   <FontAwesomeIcon icon={faWandMagicSparkles} className={styles.magicIcon} />
                )}
                <span>Match Team</span>
              </button>
            )}
            <button 
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleRerollSkin}
              title="Random Skin"
              disabled={isRerollLoading}
            >
              {isRerollLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin size="lg"/>
              ) : (
                <FontAwesomeIcon icon={faDice} size="lg" />
              )}
              <span>{showMagicButton && !isRerollLoading ? "Random" : (isRerollLoading ? "" : "Random Skin")}</span>
            </button>
            {hasChromas && (
              <button 
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleRerollChroma}
                title="Shuffle Chroma"
                disabled={isChromaLoading}
              >
                {isChromaLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPalette} />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
