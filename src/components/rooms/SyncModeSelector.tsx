import type { SyncMode } from "@/features/roomsClient";
import styles from "./SyncModeSelector.module.css";

const MODES: Array<{ value: SyncMode; label: string; description: string }> = [
  { value: "chromas", label: "Chromas", description: "Match by color" },
  { value: "skins", label: "Skins", description: "Match by skin line" },
  { value: "both", label: "Both", description: "Skin line + color" },
];

interface SyncModeSelectorProps {
  currentMode: SyncMode;
  isOwner: boolean;
  onChange: (mode: SyncMode) => void;
}

export function SyncModeSelector({ currentMode, isOwner, onChange }: SyncModeSelectorProps) {
  return (
    <div className={styles.selector}>
      <span className={styles.label}>Sync</span>
      {MODES.map((mode) => (
        <button
          key={mode.value}
          className={`${styles.btn} ${currentMode === mode.value ? styles.active : ""}`}
          onClick={() => isOwner && onChange(mode.value)}
          disabled={!isOwner}
          title={mode.description}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
