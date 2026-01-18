import { useEffect, useState, useCallback, useRef } from "react";
import { roomsClient, type RoomState, type GroupComboPayload } from "../roomsClient";
import { api } from "../api";
import type { AppError, Selection } from "../types";

export type GroupComboNotification = {
  color: string;
  timestamp: number;
};

// Error codes that are fatal and require leaving the room
const FATAL_ERROR_CODES = ["ROOM_NOT_FOUND", "MEMBER_NOT_FOUND"];

// Error codes that can be retried
const RETRYABLE_ERROR_CODES = ["NETWORK_ERROR", "INTERNAL_ERROR"];

export function useRooms(selection: Selection) {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Store last action for retry
  const lastActionRef = useRef<{ type: "create" | "join"; args: string[] } | null>(null);

  // Group combo notification state
  const [lastGroupCombo, setLastGroupCombo] = useState<GroupComboNotification | null>(null);

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
    const unsubCombo = roomsClient.onGroupCombo(async (payload: GroupComboPayload) => {
      if (payload.type === "sameColor") {
        // Notify about the group combo
        setLastGroupCombo({
          color: payload.color,
          timestamp: Date.now(),
        });

        // Clear suggested colors since a combo was applied
        setSuggestedColorsMap({});

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
          }
        }
      }
    });
    return () => unsubCombo();
  }, []);

  // Handle color suggestions - store both skinId and chromaId
  const [suggestedColorsMap, setSuggestedColorsMap] = useState<Record<string, { skinId: number; chromaId: number }>>({});
  useEffect(() => {
    const unsubscribe = roomsClient.onColorSuggestionReceived(({ memberId, skinId, chromaId }) => {
      setSuggestedColorsMap((prev) => ({
        ...prev,
        [memberId]: { skinId, chromaId },
      }));
    });
    return unsubscribe;
  }, []);

  // Actions
  const create = useCallback(async (name: string) => {
    setIsLoading(true);
    setError(null);
    lastActionRef.current = { type: "create", args: [name] };
    try {
      await roomsClient.createRoom(name);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
      lastActionRef.current = null; // Clear on success
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
    lastActionRef.current = { type: "join", args: [code, name] };
    try {
      await roomsClient.joinRoom(code, name);
      roomsClient.connect();
      roomsClient.sendSelection(selection);
      lastActionRef.current = null; // Clear on success
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
    lastActionRef.current = null;
  }, []);

  // Retry last failed action
  const retry = useCallback(async () => {
    const lastAction = lastActionRef.current;
    if (!lastAction) return;

    setIsRetrying(true);
    setError(null);

    try {
      if (lastAction.type === "create") {
        await roomsClient.createRoom(lastAction.args[0]);
        roomsClient.connect();
        roomsClient.sendSelection(selection);
        lastActionRef.current = null;
      } else if (lastAction.type === "join") {
        await roomsClient.joinRoom(lastAction.args[0], lastAction.args[1]);
        roomsClient.connect();
        roomsClient.sendSelection(selection);
        lastActionRef.current = null;
      }
    } catch (e) {
      // Error handled by listener
    } finally {
      setIsRetrying(false);
    }
  }, [selection]);

  // Check if current error is retryable
  const canRetry = error ? RETRYABLE_ERROR_CODES.includes(error.code) && lastActionRef.current !== null : false;

  // Check if current error is fatal (requires going back home)
  const isFatalError = error ? FATAL_ERROR_CODES.includes(error.code) : false;

  // Sync selection with server
  useEffect(() => {
    if (joined) {
      roomsClient.sendSelection(selection);
    }
  }, [joined, selection]);

  // Clear lastGroupCombo after a short delay (for notification display)
  const clearGroupCombo = useCallback(() => {
    setLastGroupCombo(null);
  }, []);

  return {
    room,
    joined,
    error,
    isLoading,
    isRetrying,
    canRetry,
    isFatalError,
    create,
    join,
    leave,
    retry,
    suggestColor: roomsClient.suggestColor.bind(roomsClient),
    suggestedColorsMap,
    lastGroupCombo,
    clearGroupCombo,
  };
}