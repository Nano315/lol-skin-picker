import type { SkinLineSynergy } from "@/features/roomsClient";
import styles from "./Selectors.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

interface SkinLineageSelectorProps {
  synergies: SkinLineSynergy[];
  onApply: (skinLineId: number | null) => void;
  activeId: number | null;
  disabled?: boolean;
}

export function SkinLineageSelector({ synergies, onApply, activeId, disabled }: SkinLineageSelectorProps) {
  if (synergies.length === 0) return null;

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorLabel}>Skin Lines</div>
      <div className={styles.selectorList}>
        <button
          className={`${styles.selectorOption} ${activeId === null ? styles.active : ""}`}
          onClick={() => onApply(null)}
          title="Default (No Skin Line)"
          disabled={disabled}
        >
          <FontAwesomeIcon icon={faBan} />
          <span>Default</span>
        </button>
        {synergies.map((s) => (
          <button
            key={s.skinLineId}
            className={`${styles.selectorOption} ${activeId === s.skinLineId ? styles.active : ""}`}
            onClick={() => onApply(s.skinLineId)}
            title={`Sync on ${s.skinLineName}`}
            disabled={disabled}
          >
            <span className={styles.optionName}>{s.skinLineName}</span>
            <span className={styles.optionBadge}>{s.combinationCount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
