// src/features/hooks/useOnlineFriends.ts
import { useSyncExternalStore, useCallback, useRef, useEffect } from "react";
import { presenceStore } from "../presence/presenceStore";
import type { LcuFriend } from "../types";

/**
 * Hook to access the global online friends state.
 * Consumes the presenceStore via useSyncExternalStore for optimal React integration.
 *
 * NOTE: The actual connection, identification, and event handling is managed by
 * IdentityConnector at the app level. This hook only provides read access to the
 * global presence state.
 *
 * @param friends - List of friends from LCU (for getFriendDetails lookup)
 */
export function useOnlineFriends(friends: LcuFriend[] = []) {
  const friendsRef = useRef<LcuFriend[]>(friends);

  // Keep friends ref updated for lookup
  useEffect(() => {
    friendsRef.current = friends;
  }, [friends]);

  // Subscribe to presenceStore using useSyncExternalStore
  const onlineFriends = useSyncExternalStore(
    (callback) => presenceStore.subscribe(callback),
    () => presenceStore.getOnlineFriends()
  );

  const isIdentified = useSyncExternalStore(
    (callback) => presenceStore.subscribe(callback),
    () => presenceStore.isIdentified()
  );

  // Get friend details by PUUID from the LCU friends list
  const getFriendDetails = useCallback(
    (friendPuuid: string): LcuFriend | undefined => {
      return friendsRef.current.find((f) => f.puuid === friendPuuid);
    },
    []
  );

  return {
    onlineFriends,
    isIdentified,
    getFriendDetails,
    onlineFriendCount: onlineFriends.length,
  };
}
