// src/features/hooks/useInvitations.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { roomsClient } from "../roomsClient";
import { invitationStore } from "../invitations/invitationStore";
import type { InviteFailureReason } from "../types";

export type InviteStatus = "idle" | "pending" | "sent" | "failed";

export type InviteState = {
  status: InviteStatus;
  error?: InviteFailureReason;
};

/**
 * Hook to manage room invitations with client-side rate limiting.
 *
 * Story 4.10: This hook now CONSUMES the invitationStore instead of setting
 * callbacks. All callbacks are centralized in IdentityConnector.tsx to prevent
 * overwriting the onInviteReceived callback.
 */
export function useInvitations() {
  // Timer ref for updating UI when rate limits expire
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, forceUpdate] = useState(0);

  // Subscribe to store for lastResult changes
  const lastResult = useSyncExternalStore(
    (callback) => invitationStore.subscribe(callback),
    () => invitationStore.getLastResult()
  );

  const pendingTarget = useSyncExternalStore(
    (callback) => invitationStore.subscribe(callback),
    () => invitationStore.getPendingTarget()
  );

  // Timer to update UI when rate limits expire
  useEffect(() => {
    // Start timer to update UI periodically for rate limit countdown
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        forceUpdate((n) => n + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  /**
   * Send an invitation to a friend
   */
  const sendInvite = useCallback((targetPuuid: string, roomCode: string) => {
    invitationStore.setPendingTarget(targetPuuid);
    roomsClient.sendRoomInvite(targetPuuid, roomCode);
  }, []);

  /**
   * Check if we can invite a specific friend (not rate limited)
   */
  const canInvite = useCallback((targetPuuid: string): boolean => {
    return invitationStore.canInvite(targetPuuid);
  }, []);

  /**
   * Get seconds remaining until we can invite again
   */
  const getTimeUntilCanInvite = useCallback((targetPuuid: string): number => {
    return invitationStore.getTimeUntilCanInvite(targetPuuid);
  }, []);

  /**
   * Check if an invite is currently pending for a target
   */
  const isPending = useCallback(
    (targetPuuid: string): boolean => {
      return pendingTarget === targetPuuid;
    },
    [pendingTarget]
  );

  /**
   * Get the invite state for a specific friend
   */
  const getInviteState = useCallback(
    (targetPuuid: string): InviteState => {
      if (pendingTarget === targetPuuid) {
        return { status: "pending" };
      }
      if (lastResult?.targetPuuid === targetPuuid) {
        if (lastResult.success) {
          return { status: "sent" };
        }
        return { status: "failed", error: lastResult.error };
      }
      return { status: "idle" };
    },
    [pendingTarget, lastResult]
  );

  return {
    sendInvite,
    canInvite,
    getTimeUntilCanInvite,
    isPending,
    getInviteState,
    lastResult,
  };
}
