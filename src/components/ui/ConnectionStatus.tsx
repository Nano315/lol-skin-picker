// src/components/ui/ConnectionStatus.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './ConnectionStatus.module.css';

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting';

type ConnectionStatusProps = {
  state: ConnectionState;
  roomCode?: string;
};

const config: Record<ConnectionState, { color: string; label: string; spinning: boolean }> = {
  connected: { color: '#4ade80', label: 'Connected', spinning: false },
  connecting: { color: '#fbbf24', label: 'Connecting...', spinning: true },
  disconnected: { color: '#f87171', label: 'Disconnected', spinning: false },
  reconnecting: { color: '#fbbf24', label: 'Reconnecting...', spinning: true },
};

export function ConnectionStatus({ state, roomCode }: ConnectionStatusProps) {
  const { color, label, spinning } = config[state];
  const tooltipText = roomCode ? `${label} - Room ${roomCode}` : label;

  return (
    <div
      className={`${styles.container} ${styles[state]}`}
      title={tooltipText}
      role="status"
      aria-live="polite"
    >
      <FontAwesomeIcon
        icon={spinning ? faSpinner : faCircle}
        className={styles.icon}
        style={{ color }}
        spin={spinning}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
