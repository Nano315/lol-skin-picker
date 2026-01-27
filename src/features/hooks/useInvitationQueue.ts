// src/features/hooks/useInvitationQueue.ts
import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { roomsClient } from "../roomsClient";
import { invitationStore, type Invitation } from "../invitations/invitationStore";

const AUTO_EXPIRE_MS = 30000; // 30 seconds

export type { Invitation } from "../invitations/invitationStore";

// Notification sound instance (lazy-loaded)
let notificationSound: HTMLAudioElement | null = null;

function getNotificationSound(): HTMLAudioElement {
  if (!notificationSound) {
    notificationSound = new Audio("/sounds/notification.mp3");
  }
  return notificationSound;
}

function playNotificationSound(enabled: boolean) {
  if (!enabled) return;

  try {
    const sound = getNotificationSound();
    sound.currentTime = 0;
    sound.play().catch(() => {
      // Ignore autoplay restrictions
    });
  } catch {
    // Ignore errors
  }
}

// Flag to track if callbacks are already set up
let callbacksInitialized = false;

/**
 * Hook to manage a queue of received room invitations.
 * Uses a shared store so multiple components can access invitation state.
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

  // Set up roomsClient callbacks once
  useEffect(() => {
    if (callbacksInitialized) return;
    callbacksInitialized = true;

    const handleInviteReceived = (
      fromPuuid: string,
      fromName: string,
      roomCode: string
    ) => {
      const invitation: Invitation = {
        fromPuuid,
        fromName,
        roomCode,
        receivedAt: Date.now(),
      };

      invitationStore.addInvitation(invitation);

      // Play notification sound if enabled
      const soundEnabled = localStorage.getItem("pref-notificationSound");
      playNotificationSound(soundEnabled !== "false"); // Default to true
    };

    // Set callback on roomsClient
    roomsClient.setInviteCallbacks({
      onInviteReceived: handleInviteReceived,
    });

    return () => {
      // Don't clear - keep callbacks active
    };
  }, []);

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
