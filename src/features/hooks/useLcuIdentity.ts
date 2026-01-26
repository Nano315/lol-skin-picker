// src/features/hooks/useLcuIdentity.ts
import { useEffect, useState, useCallback, useRef } from "react";
import type { LcuFriend, LcuIdentity } from "../types";

const REFRESH_INTERVAL_MS = 60_000; // 60 seconds

/**
 * Hook to get the current player's identity and friends list from LCU.
 * Automatically refreshes friends every 60 seconds when connected.
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

  const fetchIdentity = useCallback(async () => {
    try {
      const identity = await window.lcu.getIdentity();
      if (identity) {
        setPuuid(identity.puuid);
        setSummonerName(identity.summonerName);
      } else {
        setPuuid(null);
        setSummonerName(null);
      }
    } catch (err) {
      setError("Failed to fetch identity");
      setPuuid(null);
      setSummonerName(null);
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

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    await Promise.all([fetchIdentity(), fetchFriends()]);

    setIsLoading(false);
  }, [fetchIdentity, fetchFriends]);

  useEffect(() => {
    // Clear previous interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset state when disconnected
    if (status !== "connected") {
      setPuuid(null);
      setSummonerName(null);
      setFriends([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Initial fetch when connected
    void fetchAll();

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
    };
  }, [status, fetchAll, fetchFriends]);

  return {
    puuid,
    summonerName,
    friends,
    isLoading,
    error,
  };
}
