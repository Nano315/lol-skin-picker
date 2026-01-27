// src/features/hooks/useSocketConnectionStatus.ts
import { useSyncExternalStore } from "react";
import { presenceStore, type SocketConnectionStatus } from "../presence/presenceStore";

/**
 * Hook to access the socket connection status from presenceStore.
 * Uses useSyncExternalStore for optimal React integration.
 *
 * @returns The current socket connection status
 */
export function useSocketConnectionStatus(): SocketConnectionStatus {
  return useSyncExternalStore(
    (callback) => presenceStore.subscribe(callback),
    () => presenceStore.getConnectionStatus()
  );
}
