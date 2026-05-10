/**
 * onboardingState tests — focused on the contracts that gate the "vu une
 * seule fois" guarantee and the migration from the legacy `consentModalSeen`
 * flag in settings.json. The atomic write itself (tmp + rename) is delegated
 * to node:fs, so it's covered indirectly through write counting.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { join } from "node:path";

// `vi.mock` factories are hoisted above all `import`/`const` statements at
// transform time, so they cannot reference top-level variables. We use
// `vi.hoisted` to share the in-memory fs and counters between the factory
// and the assertions below.
const { fakeFs, writeCounts, fsPromisesMock } = vi.hoisted(() => {
  const fakeFs = new Map<string, string>();
  const writeCounts = { writeFile: 0, rename: 0, unlink: 0, mkdir: 0 };
  const fsPromisesMock = {
    readFile: async (path: string) => {
      if (!fakeFs.has(path)) {
        const err = new Error(`ENOENT: ${path}`) as NodeJS.ErrnoException;
        err.code = "ENOENT";
        throw err;
      }
      return fakeFs.get(path) as string;
    },
    writeFile: async (path: string, data: string) => {
      writeCounts.writeFile += 1;
      fakeFs.set(path, data);
    },
    rename: async (from: string, to: string) => {
      writeCounts.rename += 1;
      const data = fakeFs.get(from);
      fakeFs.delete(from);
      if (data !== undefined) fakeFs.set(to, data);
    },
    unlink: async (path: string) => {
      writeCounts.unlink += 1;
      fakeFs.delete(path);
    },
    mkdir: async () => {
      writeCounts.mkdir += 1;
      return undefined;
    },
  };
  return { fakeFs, writeCounts, fsPromisesMock };
});

vi.mock("node:fs", () => ({
  default: { promises: fsPromisesMock },
  promises: fsPromisesMock,
}));

vi.mock("electron", () => ({
  app: {
    getPath: () => "/fake-userdata",
  },
}));

vi.mock("../../logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

const loadSettingsMock = vi.fn();
vi.mock("../../main/settings", () => ({
  loadSettings: () => loadSettingsMock(),
}));

import {
  __resetOnboardingCacheForTests,
  getOnboardingState,
  markOnboardingCompleted,
  resetOnboardingState,
} from "../../main/onboardingState";

// Use platform-correct path joining so Windows (`\`) and POSIX (`/`) both
// match the path the source uses internally (it goes through `node:path.join`
// against the mocked userData root).
const ONBOARDING_PATH = join("/fake-userdata", "onboarding.json");

function clearFakeFs() {
  fakeFs.clear();
  writeCounts.writeFile = 0;
  writeCounts.rename = 0;
  writeCounts.unlink = 0;
  writeCounts.mkdir = 0;
}

describe("onboardingState", () => {
  beforeEach(() => {
    clearFakeFs();
    loadSettingsMock.mockReset();
    __resetOnboardingCacheForTests();
  });

  afterEach(() => {
    __resetOnboardingCacheForTests();
  });

  describe("getOnboardingState", () => {
    it("returns defaults when neither onboarding.json nor settings.consentModalSeen exist", async () => {
      loadSettingsMock.mockResolvedValue({});
      const state = await getOnboardingState();
      expect(state).toEqual({
        welcomeCompleted: false,
        consentRecorded: false,
        rerollCoachSeen: false,
        matchLockCoachSeen: false,
        synergyCoachSeen: false,
        exclusionToastSeen: false,
      });
    });

    it("migrates consentModalSeen=true from settings.json into consentRecorded", async () => {
      // Simulates an existing user who already responded to the legacy modal.
      // The new flag must NOT re-prompt them.
      loadSettingsMock.mockResolvedValue({ consentModalSeen: true });
      const state = await getOnboardingState();
      expect(state.consentRecorded).toBe(true);
      // Welcome flow IS shown to existing users — by design, since couche 1
      // introduces tabs they may not know about (e.g. Match Lock).
      expect(state.welcomeCompleted).toBe(false);
    });

    it("does NOT migrate when consentModalSeen is missing or false", async () => {
      loadSettingsMock.mockResolvedValue({ consentModalSeen: false });
      const state = await getOnboardingState();
      expect(state.consentRecorded).toBe(false);
    });

    it("treats every couche-3 coachmark flag as not-yet-seen by default", async () => {
      // New users — and existing users upgrading past the first couche-3
      // build — must see each coachmark exactly once. Defaulting all flags
      // to `false` is what makes that contract hold.
      loadSettingsMock.mockResolvedValue({});
      const state = await getOnboardingState();
      expect(state.rerollCoachSeen).toBe(false);
      expect(state.matchLockCoachSeen).toBe(false);
      expect(state.synergyCoachSeen).toBe(false);
      expect(state.exclusionToastSeen).toBe(false);
    });

    it("preserves only the keys present on disk and defaults the rest to false", async () => {
      // Simulates an `onboarding.json` written before couche 3 keys existed.
      // Critical for the rollout: an existing user must keep their
      // `welcomeCompleted=true` (no replay) but still see the new coachmarks.
      fakeFs.set(
        ONBOARDING_PATH,
        JSON.stringify({ welcomeCompleted: true, consentRecorded: true })
      );
      loadSettingsMock.mockResolvedValue({});
      const state = await getOnboardingState();
      expect(state).toEqual({
        welcomeCompleted: true,
        consentRecorded: true,
        rerollCoachSeen: false,
        matchLockCoachSeen: false,
        synergyCoachSeen: false,
        exclusionToastSeen: false,
      });
    });

    it("is idempotent: a pure read does not mutate the on-disk state", async () => {
      // This is the critical fix vs the legacy `isFirstLaunch` handler that
      // flipped `consentModalSeen=true` at read time and could lose the flag
      // if the disk write later silently failed.
      loadSettingsMock.mockResolvedValue({});
      await getOnboardingState();
      const writesAfterFirstRead = writeCounts.rename;
      await getOnboardingState();
      await getOnboardingState();
      expect(writeCounts.rename).toBe(writesAfterFirstRead);
    });

    it("reads the persisted state on subsequent process boots", async () => {
      // Seed the fake disk with a state that diverges from defaults.
      fakeFs.set(
        ONBOARDING_PATH,
        JSON.stringify({
          welcomeCompleted: true,
          consentRecorded: true,
          rerollCoachSeen: true,
          matchLockCoachSeen: true,
          synergyCoachSeen: true,
          exclusionToastSeen: true,
        })
      );
      loadSettingsMock.mockResolvedValue({});
      const state = await getOnboardingState();
      expect(state).toEqual({
        welcomeCompleted: true,
        consentRecorded: true,
        rerollCoachSeen: true,
        matchLockCoachSeen: true,
        synergyCoachSeen: true,
        exclusionToastSeen: true,
      });
    });

    it("falls back to defaults when the on-disk file is corrupted", async () => {
      fakeFs.set(ONBOARDING_PATH, "{ not valid json");
      loadSettingsMock.mockResolvedValue({});
      const state = await getOnboardingState();
      expect(state).toEqual({
        welcomeCompleted: false,
        consentRecorded: false,
        rerollCoachSeen: false,
        matchLockCoachSeen: false,
        synergyCoachSeen: false,
        exclusionToastSeen: false,
      });
    });
  });

  describe("markOnboardingCompleted", () => {
    it("flips the requested flag and persists it", async () => {
      loadSettingsMock.mockResolvedValue({});
      const next = await markOnboardingCompleted("welcomeCompleted");
      expect(next.welcomeCompleted).toBe(true);
      expect(next.consentRecorded).toBe(false);
      // Disk state mirrors the cache.
      const onDisk = JSON.parse(fakeFs.get(ONBOARDING_PATH) ?? "{}");
      expect(onDisk.welcomeCompleted).toBe(true);
    });

    it("is idempotent: marking an already-completed key does not write again", async () => {
      loadSettingsMock.mockResolvedValue({});
      await markOnboardingCompleted("welcomeCompleted");
      const writesAfterFirst = writeCounts.rename;
      await markOnboardingCompleted("welcomeCompleted");
      await markOnboardingCompleted("welcomeCompleted");
      expect(writeCounts.rename).toBe(writesAfterFirst);
    });

    it("preserves other flags when flipping one", async () => {
      loadSettingsMock.mockResolvedValue({ consentModalSeen: true });
      // First read triggers migration → consentRecorded=true
      await getOnboardingState();
      const next = await markOnboardingCompleted("welcomeCompleted");
      expect(next).toEqual({
        welcomeCompleted: true,
        consentRecorded: true,
        rerollCoachSeen: false,
        matchLockCoachSeen: false,
        synergyCoachSeen: false,
        exclusionToastSeen: false,
      });
    });
  });

  describe("resetOnboardingState", () => {
    it("clears welcomeCompleted but preserves consentRecorded", async () => {
      // User has fully onboarded.
      loadSettingsMock.mockResolvedValue({});
      await markOnboardingCompleted("consentRecorded");
      await markOnboardingCompleted("welcomeCompleted");

      const reset = await resetOnboardingState();
      expect(reset.welcomeCompleted).toBe(false);
      // ↓ Critical: replaying the tour MUST NOT silently invalidate the
      //   user's previous consent answer.
      expect(reset.consentRecorded).toBe(true);
    });

    it("works when consent was never given", async () => {
      loadSettingsMock.mockResolvedValue({});
      await markOnboardingCompleted("welcomeCompleted");
      const reset = await resetOnboardingState();
      expect(reset).toEqual({
        welcomeCompleted: false,
        consentRecorded: false,
        rerollCoachSeen: false,
        matchLockCoachSeen: false,
        synergyCoachSeen: false,
        exclusionToastSeen: false,
      });
    });

    it("clears couche-3 coachmark flags too so 'Replay tour' re-runs the discovery hints", async () => {
      // Reset is the right entrypoint to re-experience the full tour. The
      // coachmarks are an extension of that tour, so they should fire again
      // after a Replay — even if the user has seen them once.
      loadSettingsMock.mockResolvedValue({});
      await markOnboardingCompleted("rerollCoachSeen");
      await markOnboardingCompleted("matchLockCoachSeen");
      await markOnboardingCompleted("synergyCoachSeen");
      await markOnboardingCompleted("exclusionToastSeen");
      const reset = await resetOnboardingState();
      expect(reset.rerollCoachSeen).toBe(false);
      expect(reset.matchLockCoachSeen).toBe(false);
      expect(reset.synergyCoachSeen).toBe(false);
      expect(reset.exclusionToastSeen).toBe(false);
    });

    it("persists the reset state to disk", async () => {
      loadSettingsMock.mockResolvedValue({});
      await markOnboardingCompleted("welcomeCompleted");
      await resetOnboardingState();
      const onDisk = JSON.parse(fakeFs.get(ONBOARDING_PATH) ?? "{}");
      expect(onDisk.welcomeCompleted).toBe(false);
    });
  });
});
