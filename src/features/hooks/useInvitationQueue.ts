// src/features/hooks/useInvitationQueue.ts
import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { invitationStore, type Invitation } from "../invitations/invitationStore";

const AUTO_EXPIRE_MS = 30000; // 30 seconds

export type { Invitation } from "../invitations/invitationStore";

/**
 * Hook to manage a queue of received room invitations.
 * Uses a shared store so multiple components can access invitation state.
 *
 * NOTE: The actual reception of invitations is handled by IdentityConnector
 * at the app level. This hook only manages the UI state and auto-expiration.
 */
export function useInvitationQueue() {
  // Subscribe to store changes
  const invitations = useSyncExternalStore(
    invitationStore.subscribe.bind(invitationStore),
    () => invitationStore.getInvitations()
  );

  const currentInvitation = invitations[0] ?? null;

  // Track time remaining for current invitation
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-expire timer for current invitation
  useEffect(() => {
    if (!currentInvitation) {
      setTimeRemaining(30);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Calculate initial time remaining
    const timeElapsed = Date.now() - currentInvitation.receivedAt;
    const initialRemaining = Math.max(0, AUTO_EXPIRE_MS - timeElapsed);
    setTimeRemaining(Math.ceil(initialRemaining / 1000));

    // Set up interval to update time remaining
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - currentInvitation.receivedAt;
      const remaining = Math.max(0, AUTO_EXPIRE_MS - elapsed);
      setTimeRemaining(Math.ceil(remaining / 1000));

      // Auto-dismiss when expired
      if (remaining <= 0) {
        invitationStore.removeInvitation(currentInvitation.fromPuuid);
      }
    }, 100); // Update frequently for smooth timer bar

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentInvitation]);

  const removeInvitation = useCallback((fromPuuid: string) => {
    invitationStore.removeInvitation(fromPuuid);
  }, []);

  const addInvitation = useCallback((invitation: Invitation) => {
    invitationStore.addInvitation(invitation);
  }, []);

  return {
    currentInvitation,
    invitations,
    addInvitation,
    removeInvitation,
    queueLength: invitations.length,
    timeRemaining,
  };
}

/**
 * Lightweight hook just for getting the badge count.
 * Use this in Header to avoid unnecessary re-renders.
 */
export function useInvitationBadgeCount(): number {
  return useSyncExternalStore(
    invitationStore.subscribe.bind(invitationStore),
    () => invitationStore.getQueueLength()
  );
}
