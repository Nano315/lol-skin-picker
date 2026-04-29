import { useCallback, useEffect, useState } from "react";
import { matchLockStore } from "./matchLockStore";

export function useMatchLock() {
  const [locked, setLockedState] = useState<boolean>(matchLockStore.getLocked());

  useEffect(() => {
    const unsub = matchLockStore.subscribe(setLockedState);
    return () => {
      unsub();
    };
  }, []);

  const setLocked = useCallback((next: boolean) => {
    matchLockStore.setLocked(next);
  }, []);

  const toggle = useCallback(() => {
    matchLockStore.toggle();
  }, []);

  return { locked, setLocked, toggle };
}
