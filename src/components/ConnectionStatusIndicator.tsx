// src/components/ConnectionStatusIndicator.tsx
import type { AppError } from "@/features/types";
import { errorMessages } from "@/features/utils/errorMessages";

type Props = {
  isConnected: boolean;
  error: AppError | null;
  isRetrying?: boolean;
  onRetry?: () => void;
};

export function ConnectionStatusIndicator({ isConnected, error, isRetrying, onRetry }: Props) {
  if (error && error.code === 'NETWORK_ERROR') {
    return (
      <div className="connection-indicator error">
        <i className="fa-solid fa-wifi-slash" aria-hidden="true" />
        <p>{errorMessages[error.code] || error.message}</p>
        {onRetry && (
          <button
            className="connection-indicator__retry-btn"
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                Reconnecting...
              </>
            ) : (
              <>
                <i className="fa-solid fa-rotate-right" aria-hidden="true" />
                Retry
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="connection-indicator warning">
        <i className="fa-solid fa-plug-circle-exclamation" aria-hidden="true" />
        <p>Disconnected from League Client. Waiting for connection...</p>
      </div>
    );
  }

  return null;
}
