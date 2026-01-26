// src/features/hooks/useInvitations.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { roomsClient } from "../roomsClient";
import type { InviteFailureReason } from "../types";

const RATE_LIMIT_MS = 30000; // 30 seconds

export type InviteStatus = "idle" | "pending" | "sent" | "failed";

export type InviteState = {
  status: InviteStatus;
  error?: InviteFailureReason;
};

/**
 * Hook to manage room invitations with client-side rate limiting
 */
export function useInvitations() {
  // Track sent invites: puuid -> timestamp
  const [sentInvites, setSentInvites] = useState<Map<string, number>>(new Map());
  // Track pending invite target
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);
  // Track last invite result for feedback
  const [lastResult, setLastResult] = useState<{
    targetPuuid: string;
    success: boolean;
    error?: InviteFailureReason;
  } | null>(null);

  // Timer ref for updating UI when rate limits expire
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, forceUpdate] = useState(0);

  // Set up callbacks for invite events
  useEffect(() => {
    roomsClient.setInviteCallbacks({
      onInviteSent: (targetPuuid) => {
        setSentInvites((prev) => new Map(prev).set(targetPuuid, Date.now()));
        setPendingTarget(null);
        setLastResult({ targetPuuid, success: true });
        // Clear result after 3 seconds
        setTimeout(() => setLastResult(null), 3000);
      },
      onInviteFailed: (reason) => {
        const target = pendingTarget;
        setPendingTarget(null);
        if (target) {
          setLastResult({ targetPuuid: target, success: false, error: reason });
          // Clear result after 3 seconds
          setTimeout(() => setLastResult(null), 3000);
        }
      },
    });

    return () => {
      roomsClient.setInviteCallbacks({});
    };
  }, [pendingTarget]);

  // Timer to update UI when rate limits expire
  useEffect(() => {
    // Check if any invites are in rate limit period
    const hasActiveRateLimits = Array.from(sentInvites.values()).some(
      (timestamp) => Date.now() - timestamp < RATE_LIMIT_MS
    );

    if (hasActiveRateLimits && !timerRef.current) {
      timerRef.current = setInterval(() => {
        forceUpdate((n) => n + 1);
      }, 1000);
    } else if (!hasActiveRateLimits && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sentInvites]);

  /**
   * Send an invitation to a friend
   */
  const sendInvite = useCallback((targetPuuid: string, roomCode: string) => {
    setPendingTarget(targetPuuid);
    setLastResult(null);
    roomsClient.sendRoomInvite(targetPuuid, roomCode);
  }, []);

  /**
   * Check if we can invite a specific friend (not rate limited)
   */
  const canInvite = useCallback(
    (targetPuuid: string): boolean => {
      const lastSent = sentInvites.get(targetPuuid);
      if (!lastSent) return true;
      return Date.now() - lastSent >= RATE_LIMIT_MS;
    },
    [sentInvites]
  );

  /**
   * Get seconds remaining until we can invite again
   */
  const getTimeUntilCanInvite = useCallback(
    (targetPuuid: string): number => {
      const lastSent = sentInvites.get(targetPuuid);
      if (!lastSent) return 0;
      const remaining = RATE_LIMIT_MS - (Date.now() - lastSent);
      return Math.max(0, Math.ceil(remaining / 1000));
    },
    [sentInvites]
  );

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
