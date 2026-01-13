import { useEffect, useState, useCallback } from "react";
import { roomsClient, type RoomState } from "../roomsClient";
import { api } from "../api";
import type { AppError, Selection } from "../types";

export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to room updates & errors
  useEffect(() => {
    const onRoomUpdate = (nextRoom: RoomState | null) => {
      setRoom(nextRoom);
      setJoined(roomsClient.isJoined());
      if (nextRoom) setError(null); // Clear error on successful update
    };

    const onErrorUpdate = (newError: AppError) => {
      setError(newError);
      setIsLoading(false); // Stop loading on error
    };

    const unsubscribeRoom = roomsClient.subscribe(onRoomUpdate);
    const unsubscribeError = roomsClient.onError(onErrorUpdate);

    if (roomsClient.isJoined()) {
      roomsClient.connect();
    }

    return () => {
      unsubscribeRoom();
      unsubscribeError();
    };
  }, []);

  // Handle combos from the server
  useEffect(() => {
    const unsubCombo = roomsClient.onGroupCombo(async (payload) => {
      if (payload.type === "sameColor") {
        const myPick = payload.picks.find(
          (p) => p.memberId === roomsClient.getMemberId()
        );

        if (myPick) {
          const idToApply = myPick.chromaId > 0 ? myPick.chromaId : myPick.skinId;
          try {
            await api.applySkinId(idToApply);
            console.log(`[Sync] Applied skin/chroma ID: ${idToApply}`);
          } catch (err) {
            console.error("[Sync] Failed to apply skin", err);
             // Optionally show a toast here for failure
          }
        }
      }
    });
    return () => unsubCombo();
  }, []);

  // Handle color suggestions
  const [suggestedColorsMap, setSuggestedColorsMap] = useState<Record<string, number>>({});
  useEffect(() => {
    const unsubscribe = roomsClient.onColorSuggestionReceived(({ memberId, chromaId }) => {
      setSuggestedColorsMap((prev) => ({
        ...prev,
        [memberId]: chromaId,
      }));
    });
    return unsubscribe;
  }, []);

  // Actions
  const create = useCallback(async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await roomsClient.createRoom(name);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
    } catch (e) {
      // Error is already handled by the onError listener & toast callback
      // We just need to stop the loading state
    } finally {
      setIsLoading(false);
    }
  }, [selection]);

  const join = useCallback(async (code: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await roomsClient.joinRoom(code, name);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
    } catch (e) {
       // Error is already handled by the onError listener & toast callback
    } finally {
      setIsLoading(false);
    }
  }, [selection]);

  const leave = useCallback(() => {
    roomsClient.leaveRoom();
    setJoined(false);
    setRoom(null);
    setError(null);
  }, []);

  // Sync selection with server
  useEffect(() => {
    if (joined) {
      roomsClient.sendSelection(selection);
    }
  }, [joined, selection]);

  return { 
    room, 
    joined, 
    error, 
    isLoading,
    create, 
    join, 
    leave,
    suggestColor: roomsClient.suggestColor.bind(roomsClient),
    suggestedColorsMap 
  };
}