/**
 * Bridges the local Match Lock state to the rooms server.
 *
 * Subscribes to:
 *  - `matchLockStore` for local lock toggles (and the auto-reset when the
 *    LCU phase exits a played game)
 *  - `roomsClient` for room joins (via its room-state subscription) so we can
 *    push the current lock value once we land in a room
 *
 * Emits `set-skin-lock` over the rooms socket whenever either side changes
 * the effective state. Idempotent — the backend short-circuits no-op writes.
 */

import { useEffect, useRef } from "react";
import { matchLockStore } from "@/features/matchLock/matchLockStore";
import { roomsClient } from "@/features/roomsClient";

export function MatchLockSyncConnector() {
  // Track the (roomId, locked) pair we last broadcast so we don't spam the
  // server with identical state on every re-render or unrelated room update.
  const lastSyncedRef = useRef<{ roomId: string | null; locked: boolean }>({
    roomId: null,
    locked: false,
  });

  useEffect(() => {
    const sync = () => {
      const room = roomsClient.getCurrentRoom();
      const roomId = room?.id ?? null;
      const locked = matchLockStore.getLocked();
      const last = lastSyncedRef.current;

      // Room left → forget the previous sync so a future re-join re-pushes.
      if (!roomId) {
        lastSyncedRef.current = { roomId: null, locked };
        return;
      }

      // Room entered or lock changed → push.
      if (last.roomId !== roomId || last.locked !== locked) {
        roomsClient.setSkinLock(locked);
        lastSyncedRef.current = { roomId, locked };
      }
    };

    const unsubLock = matchLockStore.subscribe(sync);
    const unsubRoom = roomsClient.subscribe(sync);

    // subscribe() fires immediately with current state, so an initial push
    // will land if we already have both pieces.

    return () => {
      unsubLock();
      unsubRoom();
    };
  }, []);

  return null;
}
