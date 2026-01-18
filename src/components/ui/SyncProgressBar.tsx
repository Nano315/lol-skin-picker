// src/components/ui/SyncProgressBar.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './SyncProgressBar.module.css';

type SyncProgressBarProps = {
  progress: number; // 0-100
  label?: string;
};

export function SyncProgressBar({ progress, label }: SyncProgressBarProps) {
  const isComplete = progress >= 100;
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={styles.container} role="progressbar" aria-valuenow={displayProgress} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.label}>
        <span className={styles.labelText}>
          {isComplete ? (
            <FontAwesomeIcon icon={faCheck} style={{ color: '#22c55e' }} />
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin />
          )}
          {label || (isComplete ? 'Sync complete' : 'Syncing...')}
        </span>
        <span className={styles.percentage}>{displayProgress}%</span>
      </div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${isComplete ? styles.complete : ''}`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
