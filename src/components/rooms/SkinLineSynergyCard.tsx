import { useState } from "react";
import type { SkinLineSynergy, RoomMember } from "@/features/roomsClient";
import styles from "./SkinLineSynergyCard.module.css";

interface SkinLineSynergyCardProps {
  synergy: SkinLineSynergy;
  isOwner: boolean;
  onClick: () => void;
  members: RoomMember[];
  index: number;
}

export function SkinLineSynergyCard({
  synergy,
  isOwner,
  onClick,
  members,
  index,
}: SkinLineSynergyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const participantNames = synergy.members
    .map((id) => members.find((m) => m.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const handleClick = () => {
    if (!isOwner) return;
    setIsFlashing(true);
    onClick();
    setTimeout(() => setIsFlashing(false), 600);
  };

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.hovered : ""} ${isOwner ? styles.clickable : ""} ${isFlashing ? styles.flash : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className={styles.header}>
        <span className={styles.name}>{synergy.skinLineName}</span>
      </div>

      <div className={styles.stats}>
        <span className={styles.coverage}>
          {synergy.members.length}/{members.length}
        </span>
        <span className={styles.combos}>
          {synergy.combinationCount} {synergy.combinationCount === 1 ? "combo" : "combos"}
        </span>
      </div>

      {isOwner && (
        <div className={styles.applyHint}>Apply</div>
      )}

      {isHovered && (
        <div className={styles.tooltip}>
          <span className={styles.tooltipLabel}>Participants</span>
          <span>{participantNames}</span>
        </div>
      )}
    </div>
  );
}
