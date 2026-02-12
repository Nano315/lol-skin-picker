import type { RoomState } from "@/features/roomsClient";
import { SkinLineSynergyCard } from "./SkinLineSynergyCard";
import styles from "./SynergiesPanel.module.css";

interface SynergiesPanelProps {
  room: RoomState;
  isOwner: boolean;
  onApplySkinLine: (skinLineId: number) => void;
}

export function SynergiesPanel({
  room,
  isOwner,
  onApplySkinLine,
}: SynergiesPanelProps) {
  const skinLineSynergies = room.synergy?.skinLines ?? [];
  const members = room.members;

  if (skinLineSynergies.length === 0) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Skin Lines</span>
        <span className={styles.count}>{skinLineSynergies.length}</span>
      </div>
      <div className={styles.grid}>
        {skinLineSynergies.map((synergy, i) => (
          <SkinLineSynergyCard
            key={synergy.skinLineId}
            synergy={synergy}
            isOwner={isOwner}
            onClick={() => onApplySkinLine(synergy.skinLineId)}
            members={members}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
