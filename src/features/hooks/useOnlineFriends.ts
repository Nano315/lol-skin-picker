// src/features/hooks/useOnlineFriends.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { roomsClient } from "../roomsClient";
import type { LcuFriend, OnlineFriend } from "../types";

/**
 * Hook to track which friends are currently online.
 * Integrates with the identity handshake system (Story 4.3).
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

  useEffect(() => {
    // Reset state when disconnected or no identity
    if (!isConnected || !puuid || !summonerName) {
      setOnlineFriends([]);
      setIsIdentified(false);
      roomsClient.disconnectIdentity();
      return;
    }

    // Set up callbacks
    roomsClient.setIdentityCallbacks({
      onIdentityConfirmed: handleIdentityConfirmed,
      onFriendOnline: handleFriendOnline,
      onFriendOffline: handleFriendOffline,
    });

    // Connect and identify
    roomsClient.connectIdentity();
    const friendPuuids = friends.map((f) => f.puuid);
    roomsClient.identify(puuid, summonerName, friendPuuids);

    // Cleanup on unmount or dependency change
    return () => {
      roomsClient.setIdentityCallbacks({});
    };
  }, [
    isConnected,
    puuid,
    summonerName,
    friends,
    handleIdentityConfirmed,
    handleFriendOnline,
    handleFriendOffline,
  ]);

  // Re-identify when friends list changes (to update server-side friends list)
  useEffect(() => {
    if (!isIdentified || !puuid || !summonerName || !isConnected) return;

    const friendPuuids = friends.map((f) => f.puuid);
    roomsClient.identify(puuid, summonerName, friendPuuids);
  }, [friends, isIdentified, puuid, summonerName, isConnected]);

  return {
    onlineFriends,
    isIdentified,
    getFriendDetails,
    onlineFriendCount: onlineFriends.length,
  };
}
