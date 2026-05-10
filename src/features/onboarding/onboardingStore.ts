/**
 * Onboarding store — renderer mirror of the persistent `onboarding.json`
 * managed by the main process. Same plain-TS pattern as `matchLockStore` /
 * `presenceStore` so we don't introduce a new dependency just for this.
 *
 * Hydration flow:
 *   1. AppShell mounts → useOnboarding() runs → onboardingApi.getState()
 *   2. The returned state is pushed via `setState(...)`, hydrated flips true.
 *   3. Subsequent mutations (markCompleted, reset) fire IPC → server returns
 *      the new full state → store mirrors it via `setState(...)`.
 *
 * The default state ("nothing completed") is intentional even before
 * hydration: it lets first-time users see the welcome ASAP without a wait,
 * while returning users get a single ~5ms flash before their persisted state
 * hides the flow. Acceptable trade-off vs blocking the whole app on the IPC
 * round-trip.
 */

export type OnboardingKey =
  | "welcomeCompleted"
  | "consentRecorded"
  | "rerollCoachSeen"
  | "matchLockCoachSeen"
  | "synergyCoachSeen"
  | "exclusionToastSeen";

export type OnboardingState = {
  welcomeCompleted: boolean;
  consentRecorded: boolean;
  rerollCoachSeen: boolean;
  matchLockCoachSeen: boolean;
  synergyCoachSeen: boolean;
  exclusionToastSeen: boolean;
};

type Listener = (state: OnboardingState) => void;

const DEFAULT_STATE: OnboardingState = {
  welcomeCompleted: false,
  consentRecorded: false,
  rerollCoachSeen: false,
  matchLockCoachSeen: false,
  synergyCoachSeen: false,
  exclusionToastSeen: false,
};

const listeners = new Set<Listener>();
let state: OnboardingState = { ...DEFAULT_STATE };
let hydrated = false;

function emit() {
  for (const fn of listeners) fn(state);
}

export const onboardingStore = {
  getState(): OnboardingState {
    return state;
  },

  isHydrated(): boolean {
    return hydrated;
  },

  /**
   * Replace the local state with a fresh snapshot from the main process.
   * Always flips `hydrated` to true on first call so AppShell knows it can
   * stop guessing.
   */
  setState(next: OnboardingState): void {
    const same =
      next.welcomeCompleted === state.welcomeCompleted &&
      next.consentRecorded === state.consentRecorded &&
      next.rerollCoachSeen === state.rerollCoachSeen &&
      next.matchLockCoachSeen === state.matchLockCoachSeen &&
      next.synergyCoachSeen === state.synergyCoachSeen &&
      next.exclusionToastSeen === state.exclusionToastSeen;
    const wasHydrated = hydrated;
    hydrated = true;
    if (same) {
      // First hydration with same defaults still needs a notification so
      // subscribers waiting on `hydrated=true` can react.
      if (!wasHydrated) emit();
      return;
    }
    state = next;
    emit();
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
