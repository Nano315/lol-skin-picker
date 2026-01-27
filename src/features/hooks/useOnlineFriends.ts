// src/features/hooks/useOnlineFriends.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { roomsClient } from "../roomsClient";
import type { LcuFriend, OnlineFriend } from "../types";

/**
 * Hook to track which friends are currently online.
 * Listens to identity events from roomsClient.
 *
 * NOTE: The actual connection and identification is now handled by
 * IdentityConnector at the app level. This hook only manages the
 * UI state for displaying online friends.
 *
 * @param puuid - Current user's PUUID (from useLcuIdentity)
 * @param summonerName - Current user's summoner name
 * @param friends - List of friends from LCU (from useLcuIdentity)
 * @param isConnected - Whether LCU is connected
 */
export function useOnlineFriends(
  puuid: string | null,
  summonerName: string | null,
  friends: LcuFriend[],
  isConnected: boolean
) {
  const [onlineFriends, setOnlineFriends] = useState<OnlineFriend[]>([]);
  const [isIdentified, setIsIdentified] = useState(false);
  const friendsRef = useRef<LcuFriend[]>(friends);

  // Keep friends ref updated
  useEffect(() => {
    friendsRef.current = friends;
  }, [friends]);

  // Get friend details by PUUID
  const getFriendDetails = useCallback(
    (friendPuuid: string): LcuFriend | undefined => {
      return friendsRef.current.find((f) => f.puuid === friendPuuid);
    },
    []
  );

  // Handle identity confirmation
  const handleIdentityConfirmed = useCallback((onlinePuuids: string[]) => {
    setIsIdentified(true);
    const onlineDetails: OnlineFriend[] = onlinePuuids
      .map((p) => {
        const friend = friendsRef.current.find((f) => f.puuid === p);
        return friend ? { puuid: p, summonerName: friend.name } : null;
      })
      .filter((f): f is OnlineFriend => f !== null);
    setOnlineFriends(onlineDetails);
  }, []);

  // Handle friend coming online
  const handleFriendOnline = useCallback((friendPuuid: string, friendSummonerName: string) => {
    setOnlineFriends((prev) => {
      // Avoid duplicates
      if (prev.some((f) => f.puuid === friendPuuid)) {
        return prev;
      }
      return [...prev, { puuid: friendPuuid, summonerName: friendSummonerName }];
    });
  }, []);

  // Handle friend going offline
  const handleFriendOffline = useCallback((friendPuuid: string) => {
    setOnlineFriends((prev) => prev.filter((f) => f.puuid !== friendPuuid));
  }, []);

  // Set up callbacks to listen for identity events
  // NOTE: We don't manage connection here anymore - IdentityConnector does that
  useEffect(() => {
    // Reset state when disconnected or no identity
    if (!isConnected || !puuid || !summonerName) {
      setOnlineFriends([]);
      setIsIdentified(false);
      return;
    }

    // Set up callbacks to receive identity events
    roomsClient.setIdentityCallbacks({
      onIdentityConfirmed: handleIdentityConfirmed,
      onFriendOnline: handleFriendOnline,
      onFriendOffline: handleFriendOffline,
    });

    // Check if already identified (connection managed by IdentityConnector)
    if (roomsClient.isIdentified()) {
      setIsIdentified(true);
    }

    // NO cleanup that disconnects - IdentityConnector manages the connection lifecycle
    // We only clean up the callbacks to prevent stale references
    return () => {
      // Don't clear callbacks on unmount - let IdentityConnector manage the lifecycle
      // This prevents the flickering when navigating between pages
    };
  }, [
    isConnected,
    puuid,
    summonerName,
    handleIdentityConfirmed,
    handleFriendOnline,
    handleFriendOffline,
  ]);

  return {
    onlineFriends,
    isIdentified,
    getFriendDetails,
    onlineFriendCount: onlineFriends.length,
  };
}
