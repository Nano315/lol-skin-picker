// src/app/IdentityConnector.tsx
import { useEffect, useRef, useCallback } from "react";
import { roomsClient } from "@/features/roomsClient";
import { useLcuIdentity } from "@/features/hooks/useLcuIdentity";
import { useConnection } from "@/features/hooks/useConnection";
import { invitationStore, type Invitation } from "@/features/invitations/invitationStore";
import { presenceStore } from "@/features/presence/presenceStore";

/**
 * Global component that manages identity connection to the rooms server.
 * Mounted at the app level to ensure the user is always identified
 * as long as the LCU client is connected.
 *
 * Handles:
 * - Identity socket connection lifecycle
 * - Presence events (friend-online/offline) -> presenceStore
 * - Invitation events -> invitationStore
 */
export function IdentityConnector() {
  const { status } = useConnection();
  const isConnected = status === "connected";
  const { puuid, summonerName, friends } = useLcuIdentity(status);

  // Track if we've set up callbacks to avoid re-setting them
  const callbacksSetRef = useRef(false);
  // Track previous connection state to detect reconnections
  const wasConnectedRef = useRef(false);
  // Keep friends ref updated for identity-confirmed lookup
  const friendsRef = useRef(friends);

  useEffect(() => {
    friendsRef.current = friends;
  }, [friends]);

  // Set up all callbacks once at the global level
  const setupCallbacks = useCallback(() => {
    if (callbacksSetRef.current) return;
    callbacksSetRef.current = true;

    // Identity/Presence callbacks -> presenceStore
    roomsClient.setIdentityCallbacks({
      onIdentityConfirmed: (onlinePuuids: string[]) => {
        presenceStore.setIdentified(true);
        // Resolve puuids to OnlineFriend objects using LCU friends list
        const onlineFriends = onlinePuuids
          .map((puuid) => {
            const friend = friendsRef.current.find((f) => f.puuid === puuid);
            return friend ? { puuid, summonerName: friend.name } : null;
          })
          .filter((f): f is { puuid: string; summonerName: string } => f !== null);
        presenceStore.setOnlineFriends(onlineFriends);
      },
      onFriendOnline: (puuid: string, summonerName: string) => {
        presenceStore.addFriend({ puuid, summonerName });
      },
      onFriendOffline: (puuid: string) => {
        presenceStore.removeFriend(puuid);
      },
    });

    // Invite callbacks -> invitationStore (Story 4.10: centralized ALL callbacks here)
    roomsClient.setInviteCallbacks({
      onInviteReceived: (fromPuuid: string, fromName: string, roomCode: string) => {
        const invitation: Invitation = {
          fromPuuid,
          fromName,
          roomCode,
          receivedAt: Date.now(),
        };

        invitationStore.addInvitation(invitation);

        // Play notification sound if enabled
        const soundEnabled = localStorage.getItem("pref-notificationSound");
        if (soundEnabled !== "false") {
          try {
            const sound = new Audio("/sounds/notification.mp3");
            sound.play().catch(() => {
              // Ignore autoplay restrictions
            });
          } catch {
            // Ignore errors
          }
        }
      },
      onInviteSent: (targetPuuid: string) => {
        invitationStore.recordSentInvite(targetPuuid);
      },
      onInviteFailed: (reason) => {
        invitationStore.recordFailedInvite(null, reason);
      },
    });
  }, []);

  // Connect and identify when LCU is connected and we have identity
  useEffect(() => {
    // Set up callbacks first (only once)
    setupCallbacks();

    // Check if we should connect
    if (!isConnected || !puuid || !summonerName) {
      // Disconnect and clear stores only if we were previously connected
      if (wasConnectedRef.current) {
        wasConnectedRef.current = false;
        roomsClient.disconnectIdentity();
        presenceStore.clear();
      }
      return;
    }

    // Connect and identify
    roomsClient.connectIdentity();
    const friendPuuids = friends.map((f) => f.puuid);
    roomsClient.identify(puuid, summonerName, friendPuuids);
    wasConnectedRef.current = true;

    // No cleanup - we want to stay connected as long as the app is running
    // The connection will only be dropped when LCU disconnects (handled above)
  }, [isConnected, puuid, summonerName, friends, setupCallbacks]);

  // Re-identify when friends list changes (to update server-side friends list)
  useEffect(() => {
    if (!isConnected || !puuid || !summonerName || !roomsClient.isIdentified()) {
      return;
    }

    const friendPuuids = friends.map((f) => f.puuid);
    roomsClient.identify(puuid, summonerName, friendPuuids);
  }, [friends, isConnected, puuid, summonerName]);

  return null; // This component does not render anything
}
