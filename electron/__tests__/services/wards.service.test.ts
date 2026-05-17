import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock lcuFetch + logger + settings BEFORE importing the service (same pattern
// as readyCheck.service.test.ts).
const lcuFetchMock = vi.fn();
vi.mock("../../utils/lcuFetch", () => ({
  lcuFetch: (...args: unknown[]) => lcuFetchMock(...args),
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
const saveSettingsMock = vi.fn();
vi.mock("../../main/settings", () => ({
  loadSettings: (...args: unknown[]) => loadSettingsMock(...args),
  saveSettings: (...args: unknown[]) => saveSettingsMock(...args),
}));

// RandomSelector uses webcrypto, which is fine in node but we want a
// deterministic pick in the tests. Stub randomInt to always return 0.
vi.mock("../../utils/RandomSelector", () => ({
  RandomSelector: {
    randomInt: vi.fn(() => 0),
  },
}));

import { WardsService } from "../../services/wards.service";

const FAKE_CREDS = {
  protocol: "https" as const,
  port: "12345",
  password: "secret",
  pid: 0,
};

const LOADOUT_ID = "03036710-4487-46bb-a095-c85765e3dc23";

function buildResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function inventoryFixture(ownedItemIds: number[]) {
  return [
    // ward par defaut, jamais owned
    { itemId: 0, owned: false, ownershipType: "F2P", inventoryType: "WARD_SKIN" },
    ...ownedItemIds.map((id) => ({
      itemId: id,
      owned: true,
      ownershipType: "OWNED",
      inventoryType: "WARD_SKIN",
    })),
  ];
}

function loadoutFixture(currentWardItemId: number) {
  return [
    {
      id: LOADOUT_ID,
      name: "migrated",
      loadout: {
        WARD_SKIN_SLOT: {
          contentId: "",
          data: {},
          inventoryType: "WARD_SKIN",
          itemId: currentWardItemId,
        },
      },
    },
  ];
}

/**
 * Helper: wires lcuFetchMock to a router-style handler that dispatches by URL
 * substring. Unknown URLs return 404.
 */
function routeFetch(routes: Record<string, () => unknown>) {
  lcuFetchMock.mockImplementation(async (url: string) => {
    for (const [needle, handler] of Object.entries(routes)) {
      if (String(url).includes(needle)) {
        return handler();
      }
    }
    return buildResponse({}, 404);
  });
}

describe("WardsService", () => {
  let service: WardsService;

  beforeEach(() => {
    lcuFetchMock.mockReset();
    loadSettingsMock.mockReset();
    saveSettingsMock.mockReset();
    service = new WardsService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("setEnabled / getEnabled", () => {
    it("defaults to disabled", () => {
      expect(service.getEnabled()).toBe(false);
    });

    it("persists via saveSettings when toggled", async () => {
      await service.setEnabled(true);
      expect(service.getEnabled()).toBe(true);
      expect(saveSettingsMock).toHaveBeenCalledWith({
        wardAutoRollEnabled: true,
      });
    });

    it("is idempotent — re-setting the same value does NOT persist again", async () => {
      await service.setEnabled(true);
      saveSettingsMock.mockClear();
      await service.setEnabled(true);
      expect(saveSettingsMock).not.toHaveBeenCalled();
    });
  });

  describe("initFromSettings", () => {
    it("loads `wardAutoRollEnabled` from settings.json", async () => {
      loadSettingsMock.mockResolvedValue({ wardAutoRollEnabled: true });
      const result = await service.initFromSettings();
      expect(result).toBe(true);
      expect(service.getEnabled()).toBe(true);
    });

    it("defaults to true when the key is missing", async () => {
      loadSettingsMock.mockResolvedValue({});
      await service.initFromSettings();
      expect(service.getEnabled()).toBe(true);
    });

    it("defaults to true when loadSettings throws", async () => {
      loadSettingsMock.mockRejectedValue(new Error("io"));
      await service.initFromSettings();
      expect(service.getEnabled()).toBe(true);
    });
  });

  describe("rollAndApply — guard rails", () => {
    it("no-ops silently when disabled", async () => {
      service.setCreds(FAKE_CREDS);
      const ok = await service.rollAndApply();
      expect(ok).toBe(false);
      expect(lcuFetchMock).not.toHaveBeenCalled();
    });

    it("no-ops when enabled but no creds", async () => {
      await service.setEnabled(true);
      const ok = await service.rollAndApply();
      expect(ok).toBe(false);
      expect(lcuFetchMock).not.toHaveBeenCalled();
    });

    it("no-ops when the user owns no ward skins (only the F2P default)", async () => {
      await service.setEnabled(true);
      service.setCreds(FAKE_CREDS);
      routeFetch({
        "/lol-inventory/v2/inventory/WARD_SKIN": () =>
          buildResponse(inventoryFixture([])),
        "/lol-loadouts/v4/loadouts/scope/account": () =>
          buildResponse(loadoutFixture(0)),
      });
      const ok = await service.rollAndApply();
      expect(ok).toBe(false);
      // Inventaire est touche, mais aucun PATCH ne doit avoir lieu.
      const patchCalls = lcuFetchMock.mock.calls.filter(
        ([, init]) => (init as { method?: string } | undefined)?.method === "PATCH"
      );
      expect(patchCalls.length).toBe(0);
    });

    it("no-ops when the only owned ward is the current one (pool empty after exclusion)", async () => {
      await service.setEnabled(true);
      service.setCreds(FAKE_CREDS);
      routeFetch({
        "/lol-inventory/v2/inventory/WARD_SKIN": () =>
          buildResponse(inventoryFixture([42])),
        "/lol-loadouts/v4/loadouts/scope/account": () =>
          buildResponse(loadoutFixture(42)),
      });
      const ok = await service.rollAndApply();
      expect(ok).toBe(false);
      const patchCalls = lcuFetchMock.mock.calls.filter(
        ([, init]) => (init as { method?: string } | undefined)?.method === "PATCH"
      );
      expect(patchCalls.length).toBe(0);
    });

    it("no-ops gracefully when the loadout has no WARD_SKIN_SLOT", async () => {
      await service.setEnabled(true);
      service.setCreds(FAKE_CREDS);
      routeFetch({
        "/lol-inventory/v2/inventory/WARD_SKIN": () =>
          buildResponse(inventoryFixture([1, 2])),
        "/lol-loadouts/v4/loadouts/scope/account": () =>
          buildResponse([{ id: LOADOUT_ID, loadout: {} }]),
      });
      const ok = await service.rollAndApply();
      expect(ok).toBe(false);
    });
  });

  describe("rollAndApply — happy path", () => {
    it("PATCHes the loadout with a ward different from the current one", async () => {
      await service.setEnabled(true);
      service.setCreds(FAKE_CREDS);
      routeFetch({
        "/lol-inventory/v2/inventory/WARD_SKIN": () =>
          buildResponse(inventoryFixture([1, 18, 256])),
        "/lol-loadouts/v4/loadouts/scope/account": () =>
          buildResponse(loadoutFixture(18)),
        // PATCH route — match by loadoutId path segment
        [LOADOUT_ID]: () => buildResponse({}, 200),
      });

      const ok = await service.rollAndApply();
      expect(ok).toBe(true);

      const patchCall = lcuFetchMock.mock.calls.find(
        ([, init]) => (init as { method?: string } | undefined)?.method === "PATCH"
      );
      expect(patchCall).toBeDefined();

      const [url, init] = patchCall as [string, { body?: string }];
      expect(url).toContain(`/lol-loadouts/v4/loadouts/${LOADOUT_ID}`);
      const body = JSON.parse(init.body ?? "{}");
      // L'itemId pioche doit etre present dans le pool (1 ou 256) et != 18.
      expect(body).toEqual({
        loadout: {
          WARD_SKIN_SLOT: {
            contentId: "",
            data: {},
            inventoryType: "WARD_SKIN",
            itemId: expect.any(Number),
          },
        },
      });
      expect(body.loadout.WARD_SKIN_SLOT.itemId).not.toBe(18);
      expect([1, 256]).toContain(body.loadout.WARD_SKIN_SLOT.itemId);
    });

    it("returns false when the PATCH fails with a non-2xx", async () => {
      await service.setEnabled(true);
      service.setCreds(FAKE_CREDS);
      routeFetch({
        "/lol-inventory/v2/inventory/WARD_SKIN": () =>
          buildResponse(inventoryFixture([1, 18])),
        "/lol-loadouts/v4/loadouts/scope/account": () =>
          buildResponse(loadoutFixture(18)),
        [LOADOUT_ID]: () => buildResponse({ error: "bad" }, 500),
      });
      const ok = await service.rollAndApply();
      expect(ok).toBe(false);
    });
  });

  describe("rollAndApply — concurrency guard", () => {
    it("skips re-entrant calls while a roll is in flight", async () => {
      await service.setEnabled(true);
      service.setCreds(FAKE_CREDS);

      // Deferred GET to keep the first roll pending until we resolve it.
      // `!` is a definite-assignment assertion: `release` is set synchronously
      // inside the Promise constructor below before any await can run.
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });

      routeFetch({
        "/lol-inventory/v2/inventory/WARD_SKIN": async () => {
          await gate;
          return buildResponse(inventoryFixture([1, 18]));
        },
        "/lol-loadouts/v4/loadouts/scope/account": () =>
          buildResponse(loadoutFixture(18)),
        [LOADOUT_ID]: () => buildResponse({}, 200),
      });

      const first = service.rollAndApply();
      // Tant que `first` n'est pas resolu, un 2eme appel doit court-circuiter
      // sans toucher au LCU.
      const second = await service.rollAndApply();
      expect(second).toBe(false);

      release();
      const firstResult = await first;
      expect(firstResult).toBe(true);
    });
  });
});
