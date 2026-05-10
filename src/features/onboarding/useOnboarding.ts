import { useCallback, useEffect, useState } from "react";
import {
  onboardingStore,
  type OnboardingKey,
  type OnboardingState,
} from "./onboardingStore";
import { onboardingApi } from "@/features/api";

/**
 * Single hydration promise shared by every consumer of the hook so multiple
 * `useOnboarding()` calls (AppShell + Settings + future coachmark hooks)
 * don't trigger N IPC round-trips.
 */
let inflightHydrate: Promise<void> | null = null;

function hydrateOnce(): Promise<void> {
  if (inflightHydrate) return inflightHydrate;
  inflightHydrate = onboardingApi
    .getState()
    .then((state) => {
      onboardingStore.setState(state);
    })
    .catch((err) => {
      // Defensive: don't block app boot on missing IPC. Default state already
      // means "show welcome flow" — fine for first-time users; returning
      // users will see a one-shot welcome on the next launch where IPC works.
      console.warn("[onboarding] failed to hydrate state from main", err);
      // Still flip hydrated=true so the rest of the UI can proceed.
      onboardingStore.setState(onboardingStore.getState());
    });
  return inflightHydrate;
}

export function useOnboarding() {
  const [state, setLocalState] = useState<OnboardingState>(() =>
    onboardingStore.getState()
  );
  const [hydrated, setHydrated] = useState<boolean>(() =>
    onboardingStore.isHydrated()
  );

  useEffect(() => {
    const unsub = onboardingStore.subscribe((next) => {
      setLocalState(next);
      setHydrated(onboardingStore.isHydrated());
    });
    void hydrateOnce();
    return unsub;
  }, []);

  /**
   * Mark a step as completed. Idempotent server-side; updates the store with
   * the authoritative state returned by main. On IPC failure, falls back to
   * an optimistic local update so the user is never stuck on a step (worst
   * case: the step is shown again next launch).
   */
  const markCompleted = useCallback(async (key: OnboardingKey) => {
    try {
      const next = await onboardingApi.markCompleted(key);
      onboardingStore.setState(next);
      return next;
    } catch (err) {
      console.warn(`[onboarding] markCompleted(${key}) failed`, err);
      const optimistic: OnboardingState = {
        ...onboardingStore.getState(),
        [key]: true,
      };
      onboardingStore.setState(optimistic);
      return optimistic;
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const next = await onboardingApi.reset();
      onboardingStore.setState(next);
      return next;
    } catch (err) {
      console.warn("[onboarding] reset failed", err);
      throw err;
    }
  }, []);

  return { state, hydrated, markCompleted, reset };
}
