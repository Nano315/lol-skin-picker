/**
 * useCoachmark — gates a single one-shot coachmark on the persistent
 * onboarding state.
 *
 * Returns `{ visible, dismiss }`. The coachmark is visible iff:
 *   - the onboarding state has been hydrated from main (no flicker pre-IPC)
 *   - the welcome flow is completed (we don't compete with it)
 *   - the key has not yet been marked completed
 *   - the caller's `ready` flag is true (caller decides when context is right
 *     to show the coachmark — e.g. "champion is locked", "in a room", ...)
 *
 * Dismissing flips the persistent flag via the existing IPC, so the
 * coachmark never reappears across launches.
 */

import { useCallback, useMemo } from "react";
import { useOnboarding } from "./useOnboarding";
import type { OnboardingKey } from "./onboardingStore";

// Keys that drive a couche-3 coachmark (welcomeCompleted/consentRecorded are
// gated elsewhere — keeping the type narrow prevents a misuse like
// `useCoachmark("welcomeCompleted")`).
export type CoachmarkKey = Exclude<
  OnboardingKey,
  "welcomeCompleted" | "consentRecorded"
>;

export function useCoachmark(key: CoachmarkKey, ready: boolean) {
  const { state, hydrated, markCompleted } = useOnboarding();

  const visible = useMemo(
    () => hydrated && state.welcomeCompleted && !state[key] && ready,
    [hydrated, state, key, ready]
  );

  const dismiss = useCallback(async () => {
    await markCompleted(key);
  }, [markCompleted, key]);

  return { visible, dismiss };
}
