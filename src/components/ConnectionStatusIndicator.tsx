// src/components/ConnectionStatusIndicator.tsx
import type { AppError } from "@/features/types";

type Props = {
  isConnected: boolean;
  error: AppError | null;
};

export function ConnectionStatusIndicator({ isConnected, error }: Props) {
  if (error && error.code === 'NETWORK_ERROR') {
    return (
      <div className="connection-indicator error">
        <p>{error.message}</p>
      </div>
    );
  }

  if (!isConnected) {
     return (
      <div className="connection-indicator warning">
        <p>Disconnected from League Client. Waiting for connection...</p>
      </div>
    );
  }

  return null;
}
