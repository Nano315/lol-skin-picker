/**
 * Match Lock — session-only state controlling whether the local user's skin
 * can be changed for the current game.
 *
 * Persistence: in-memory only. Resets on app restart, and auto-resets when
 * the LCU phase transitions out of an in-game state (handled in MatchControls).
 *
 * The lock is enforced both locally (skin auto-apply respects it) and
 * remotely (broadcast to the room so the owner can't override). Wiring to
 * those systems lives in `useMatchLock` and the rooms client respectively.
 */

type Listener = (locked: boolean) => void;

const listeners = new Set<Listener>();
let locked = false;

export const matchLockStore = {
  getLocked(): boolean {
    return locked;
  },

  setLocked(next: boolean): void {
    if (next === locked) return;
    locked = next;
    for (const fn of listeners) fn(locked);
    // Push to main process so the auto-apply path and rerolls in
    // SkinsService also respect the lock. Fire-and-forget — local UI
    // shouldn't block on the IPC round trip.
    try {
      const lcu = window.lcu;
      if (lcu && typeof lcu.setMatchLock === "function") {
        void lcu.setMatchLock(locked).catch(() => {
          /* ignore — main process might be transiently busy */
        });
      }
    } catch {
      /* ignore — defensive against early-mount edge cases */
    }
  },

  toggle(): void {
    matchLockStore.setLocked(!locked);
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
