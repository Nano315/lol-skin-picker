import type { ColorSynergy } from "@/features/roomsClient";
import styles from "./Selectors.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

interface ChromaSelectorProps {
  synergies: ColorSynergy[];
  onApply: (color: string | null) => void;
  activeColor: string | null;
  disabled?: boolean;
}

export function ChromaSelector({ synergies, onApply, activeColor, disabled }: ChromaSelectorProps) {
  if (synergies.length === 0) return null;

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorLabel}>Chromas</div>
      <div className={styles.selectorList}>
        <button
          className={`${styles.selectorOption} ${activeColor === null ? styles.active : ""}`}
          onClick={() => onApply(null)}
          title="Default (No Chroma)"
          disabled={disabled}
        >
          <FontAwesomeIcon icon={faBan} />
          <span>Default</span>
        </button>
        {synergies.map((s) => (
          <button
             key={s.color}
             style={{ "--opt-color": s.color } as React.CSSProperties}
             className={`${styles.selectorOption} ${styles.colorOption} ${activeColor === s.color ? styles.active : ""}`}
             onClick={() => onApply(s.color)}
             title={`Sync on ${s.color}`}
             disabled={disabled}
          >
            <div className={styles.colorIndicator} />
            <span className={styles.optionBadge}>{s.combinationCount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
