// src/features/hooks/useLcuIdentity.ts
import { useEffect, useState, useCallback, useRef } from "react";
import type { LcuFriend, LcuIdentity } from "../types";

const REFRESH_INTERVAL_MS = 60_000; // 60 seconds
const IDENTITY_RETRY_MS = 3_000; // 3 seconds retry when identity fetch fails

/**
 * Hook to get the current player's identity and friends list from LCU.
 * Automatically refreshes friends every 60 seconds when connected.
 * Retries identity fetch every 3 seconds if the LCU API isn't ready yet.
 *
 * @param status - Current LCU connection status ("connected" | "disconnected")
 */
export function useLcuIdentity(status: string): LcuIdentity {
  const [puuid, setPuuid] = useState<string | null>(null);
  const [summonerName, setSummonerName] = useState<string | null>(null);
  const [friends, setFriends] = useState<LcuFriend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const identityRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether identity has been resolved to avoid unnecessary retries
  const identityResolvedRef = useRef(false);

  const fetchIdentity = useCallback(async () => {
    try {
      const identity = await window.lcu.getIdentity();
      if (identity) {
        setPuuid(identity.puuid);
        setSummonerName(identity.summonerName);
        identityResolvedRef.current = true;
        return true;
      } else {
        setPuuid(null);
        setSummonerName(null);
        return false;
      }
    } catch (err) {
      setError("Failed to fetch identity");
      setPuuid(null);
      setSummonerName(null);
      return false;
    }
  }, []);

  const fetchFriends = useCallback(async () => {
    try {
      const friendsList = await window.lcu.getFriends();
      if (friendsList) {
        setFriends(friendsList);
      } else {
        setFriends([]);
      }
    } catch (err) {
      setError("Failed to fetch friends");
      setFriends([]);
    }
  }, []);

  // Retry identity fetch until it succeeds (LCU API may not be ready immediately)
  const scheduleIdentityRetry = useCallback(() => {
    if (identityRetryRef.current) return; // Already scheduled

    identityRetryRef.current = setTimeout(async () => {
      identityRetryRef.current = null;
      if (identityResolvedRef.current) return; // Already resolved

      const success = await fetchIdentity();
      if (!success) {
        // Keep retrying
        scheduleIdentityRetry();
      } else {
        // Identity resolved, also fetch friends now
        void fetchFriends();
      }
    }, IDENTITY_RETRY_MS);
  }, [fetchIdentity, fetchFriends]);

  useEffect(() => {
    // Clear previous timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (identityRetryRef.current) {
      clearTimeout(identityRetryRef.current);
      identityRetryRef.current = null;
    }

    // Reset state when disconnected
    if (status !== "connected") {
      setPuuid(null);
      setSummonerName(null);
      setFriends([]);
      setIsLoading(false);
      setError(null);
      identityResolvedRef.current = false;
      return;
    }

    // Initial fetch when connected
    identityResolvedRef.current = false;
    (async () => {
      setIsLoading(true);
      setError(null);

      const [identityOk] = await Promise.all([fetchIdentity(), fetchFriends()]);

      setIsLoading(false);

      // If identity fetch failed, schedule retries (LCU API not ready yet)
      if (!identityOk) {
        scheduleIdentityRetry();
      }
    })();

    // Set up interval for refreshing friends every 60 seconds
    intervalRef.current = setInterval(() => {
      void fetchFriends();
    }, REFRESH_INTERVAL_MS);

    // Cleanup on unmount or status change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (identityRetryRef.current) {
        clearTimeout(identityRetryRef.current);
        identityRetryRef.current = null;
      }
    };
  }, [status, fetchIdentity, fetchFriends, scheduleIdentityRetry]);

  return {
    puuid,
    summonerName,
    friends,
    isLoading,
    error,
  };
}
