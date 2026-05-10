/**
 * Onboarding flags persisted across launches.
 *
 * Each key is a boolean that flips to `true` ONLY when the user has explicitly
 * completed the corresponding step. Reads are idempotent (no side-effect on
 * disk), so a launch where the persist fails (disk full, antivirus, ...) still
 * sees the user as not-yet-onboarded on the next start instead of silently
 * swallowing the consent. This is the explicit fix for the existing
 * `isFirstLaunch` bug where the flag could be flipped to `true` without the
 * user ever responding to the prompt.
 *
 * Storage lives in its own file (`onboarding.json` in `userData`) rather than
 * sharing `settings.json` to:
 *   - isolate it from other prefs serialization bugs,
 *   - make the "Replay onboarding" flow trivial (overwrite the file),
 *   - keep the migration path one-way and simple.
 *
 * Writes go through `atomicWrite` (tmp + rename) and a sequential write queue
 * to prevent torn files and concurrent-write races.
 */

import { app } from "electron";
import { join, dirname } from "node:path";
import { promises as fs } from "node:fs";
import { logger as log } from "../logger";
import { isPlainObject } from "../utils/jsonGuards";
import { loadSettings } from "./settings";

export type OnboardingKey =
  // Couche 1 — welcome flow shown at first launch
  | "welcomeCompleted"
  // Telemetry consent — has the user given an explicit accept/decline?
  | "consentRecorded"
  // Couche 3 — one-shot coachmarks. Each fires when its trigger condition
  // first becomes true (post welcome flow), then is dismissed permanently.
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

const DEFAULT_STATE: OnboardingState = {
  welcomeCompleted: false,
  consentRecorded: false,
  rerollCoachSeen: false,
  matchLockCoachSeen: false,
  synergyCoachSeen: false,
  exclusionToastSeen: false,
};

/**
 * Resolved lazily, NOT at module load time. In dev, `app.setPath("userData",
 * ...lol-skin-picker-dev)` runs in `electron/main/app.ts` AFTER all imports
 * — so capturing the path into a `const` at import time would freeze the
 * production path before the dev override is applied. By calling
 * `app.getPath("userData")` inside each function we always read the latest
 * value, including the dev redirection.
 *
 * (The same gotcha exists in `electron/main/settings.ts` and
 * `electron/main/exclusions.ts`; consider migrating them to the same lazy
 * pattern in a follow-up.)
 */
function getOnboardingFilePath(): string {
  return join(app.getPath("userData"), "onboarding.json");
}

let cache: OnboardingState | null = null;
let migrationDone = false;
// Sequential write queue: each persist waits for the previous one to settle.
let writeChain: Promise<void> = Promise.resolve();

function normalize(raw: unknown): OnboardingState {
  if (!isPlainObject(raw)) return { ...DEFAULT_STATE };
  // Each key defaults to false — older `onboarding.json` files written before
  // couche 3 keys existed simply read missing fields as `false`, which is
  // exactly the "show the coachmark once" semantics we want for users
  // already past the welcome flow when this update lands.
  return {
    welcomeCompleted: raw.welcomeCompleted === true,
    consentRecorded: raw.consentRecorded === true,
    rerollCoachSeen: raw.rerollCoachSeen === true,
    matchLockCoachSeen: raw.matchLockCoachSeen === true,
    synergyCoachSeen: raw.synergyCoachSeen === true,
    exclusionToastSeen: raw.exclusionToastSeen === true,
  };
}

async function readFromDisk(): Promise<OnboardingState | null> {
  try {
    const data = await fs.readFile(getOnboardingFilePath(), "utf-8");
    return normalize(JSON.parse(data) as unknown);
  } catch {
    return null;
  }
}

async function atomicWrite(state: OnboardingState): Promise<void> {
  const target = getOnboardingFilePath();
  await fs.mkdir(dirname(target), { recursive: true });
  // Suffix with pid + timestamp so two concurrent processes (rare in Electron
  // single-instance, but possible during dev) never clash on the same tmp.
  const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
  await fs.writeFile(tmp, JSON.stringify(state, null, 2), "utf-8");
  try {
    await fs.rename(tmp, target);
  } catch (err) {
    await fs.unlink(tmp).catch(() => {});
    throw err;
  }
}

function persist(state: OnboardingState): Promise<void> {
  // Chain on the previous write (regardless of outcome) so two rapid mutations
  // don't race — disk operations stay strictly sequential.
  const next = writeChain.catch(() => undefined).then(() => atomicWrite(state));
  writeChain = next.catch(() => undefined);
  return next;
}

/**
 * Migration : an existing user with `consentModalSeen=true` in settings.json
 * has already been asked about telemetry. Don't re-ask them just because the
 * onboarding system moved files. Welcome flow is still shown to existing
 * users on first launch with the new build (one-time only) — by design, since
 * it introduces tabs they may not know about (e.g. Match Lock).
 *
 * Runs at most once per process lifetime, only when the on-disk
 * `onboarding.json` does not exist yet.
 */
async function migrateFromSettings(): Promise<OnboardingState> {
  const settings = await loadSettings();
  const state: OnboardingState = {
    ...DEFAULT_STATE,
    consentRecorded: settings.consentModalSeen === true,
  };
  try {
    await persist(state);
    log.info("[onboarding] Initialized state file (migrated from settings)", state);
  } catch (err) {
    // Non-fatal: we'll retry on the next mutation. State stays in-memory until then.
    log.warn("[onboarding] Initial persist failed, will retry on next mutation", err);
  }
  return state;
}

export async function getOnboardingState(): Promise<OnboardingState> {
  if (cache) return { ...cache };

  const fromDisk = await readFromDisk();
  if (fromDisk) {
    cache = fromDisk;
    return { ...cache };
  }

  if (!migrationDone) {
    migrationDone = true;
    cache = await migrateFromSettings();
    return { ...cache };
  }

  cache = { ...DEFAULT_STATE };
  return { ...cache };
}

/**
 * Mark a single onboarding key as completed. Returns the new state.
 *
 * Idempotent: calling it on an already-completed key is a no-op (no disk
 * write). Caller can safely retry without worrying about duplicates.
 */
export async function markOnboardingCompleted(
  key: OnboardingKey
): Promise<OnboardingState> {
  const current = await getOnboardingState();
  if (current[key]) return current;
  const next: OnboardingState = { ...current, [key]: true };
  await persist(next);
  cache = next;
  return { ...next };
}

/**
 * Reset the onboarding flow flags so the user re-sees the welcome tour.
 *
 * Intentionally preserves `consentRecorded` — replaying the tour is a
 * navigation choice, not a regulatory event. Wiping the consent answer would
 * either re-prompt a user who already decided (annoying) or, worse, let
 * step 3 of a replayed tour silently overwrite their previous choice if they
 * picked "Continuer sans" out of habit.
 *
 * If a user wants to revisit consent, the dedicated toggle in the Privacy
 * section of Settings is the right entrypoint.
 */
export async function resetOnboardingState(): Promise<OnboardingState> {
  const current = await getOnboardingState();
  // Reset everything *except* the consent answer — that's a regulatory
  // record we never want to silently invalidate (the dedicated toggle in
  // Settings → Privacy is the right entrypoint to revisit it).
  const next: OnboardingState = {
    ...DEFAULT_STATE,
    consentRecorded: current.consentRecorded,
  };
  await persist(next);
  cache = next;
  return { ...next };
}

/** Test-only: reset in-memory caches between unit tests. */
export function __resetOnboardingCacheForTests(): void {
  cache = null;
  migrationDone = false;
  writeChain = Promise.resolve();
}
