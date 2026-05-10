import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock lcuFetch and logger BEFORE importing the service
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

import { ReadyCheckService } from "../../services/readyCheck.service";

// `port` must be a string per `LockCreds` — the LCU lockfile stores it as
// such and the watcher passes it through verbatim. Earlier revisions of
// this fixture used a number, which vitest tolerated but `tsc --noEmit`
// (run by the release pipeline) rightly rejected.
const FAKE_CREDS = {
  protocol: "https" as const,
  port: "12345",
  password: "secret",
  pid: 0,
};

function buildResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function lastUrlContains(needle: string): boolean {
  const calls = lcuFetchMock.mock.calls;
  return calls.some(([url]) => String(url).includes(needle));
}

describe("ReadyCheckService", () => {
  let service: ReadyCheckService;

  beforeEach(() => {
    vi.useFakeTimers();
    lcuFetchMock.mockReset();
    service = new ReadyCheckService();
  });

  afterEach(() => {
    service.stop();
    vi.useRealTimers();
  });

  it("does not poll when auto-accept is disabled", async () => {
    service.setCreds(FAKE_CREDS);
    await vi.advanceTimersByTimeAsync(5000);
    expect(lcuFetchMock).not.toHaveBeenCalled();
  });

  it("does not poll without creds even if enabled", async () => {
    service.setAutoAccept(true);
    await vi.advanceTimersByTimeAsync(5000);
    expect(lcuFetchMock).not.toHaveBeenCalled();
  });

  it("accepts a ready-check when state=InProgress and playerResponse=None", async () => {
    lcuFetchMock.mockImplementation(async (url: string) => {
      if (url.endsWith("/lol-matchmaking/v1/ready-check")) {
        return buildResponse({ state: "InProgress", playerResponse: "None" });
      }
      if (url.endsWith("/lol-matchmaking/v1/ready-check/accept")) {
        return buildResponse({}, 204);
      }
      return buildResponse({}, 404);
    });

    service.setAutoAccept(true);
    service.setCreds(FAKE_CREDS);

    // Immediate first tick fires
    await vi.advanceTimersByTimeAsync(0);
    expect(lastUrlContains("/lol-matchmaking/v1/ready-check/accept")).toBe(true);
  });

  it("does not re-accept while the same session is still in progress", async () => {
    let playerResponse = "None";
    lcuFetchMock.mockImplementation(async (url: string) => {
      if (url.endsWith("/lol-matchmaking/v1/ready-check")) {
        return buildResponse({ state: "InProgress", playerResponse });
      }
      if (url.endsWith("/lol-matchmaking/v1/ready-check/accept")) {
        playerResponse = "Accepted";
        return buildResponse({}, 204);
      }
      return buildResponse({}, 404);
    });

    service.setAutoAccept(true);
    service.setCreds(FAKE_CREDS);
    await vi.advanceTimersByTimeAsync(0);

    const acceptCallsAfterFirst = lcuFetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/accept")
    ).length;
    expect(acceptCallsAfterFirst).toBe(1);

    // Tick again — state is still in progress but we already accepted
    await vi.advanceTimersByTimeAsync(1500);
    await vi.advanceTimersByTimeAsync(1500);

    const acceptCallsAfterMore = lcuFetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/accept")
    ).length;
    expect(acceptCallsAfterMore).toBe(1);
  });

  it("accepts a SECOND ready-check after the first one is invalidated", async () => {
    // Sequence simulé :
    //  tick 1 : InProgress / None  → accept (1er)
    //  tick 2 : Invalid             → latch reset
    //  tick 3 : InProgress / None  → accept (2nd)
    const stateSequence: ReadyCheckState[] = [
      { state: "InProgress", playerResponse: "None" },
      { state: "Invalid" },
      { state: "InProgress", playerResponse: "None" },
    ];
    let stateIdx = 0;

    lcuFetchMock.mockImplementation(async (url: string) => {
      if (url.endsWith("/lol-matchmaking/v1/ready-check")) {
        const s = stateSequence[Math.min(stateIdx, stateSequence.length - 1)];
        stateIdx += 1;
        return buildResponse(s);
      }
      if (url.endsWith("/lol-matchmaking/v1/ready-check/accept")) {
        return buildResponse({}, 204);
      }
      return buildResponse({}, 404);
    });

    service.setAutoAccept(true);
    service.setCreds(FAKE_CREDS);

    // tick 1 (immediate)
    await vi.advanceTimersByTimeAsync(0);
    // tick 2
    await vi.advanceTimersByTimeAsync(1500);
    // tick 3
    await vi.advanceTimersByTimeAsync(1500);

    const acceptCalls = lcuFetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/accept")
    ).length;
    expect(acceptCalls).toBe(2);
  });

  it("treats 404 (no active ready-check) as Invalid and releases the latch", async () => {
    let phase = 0;
    lcuFetchMock.mockImplementation(async (url: string) => {
      if (url.endsWith("/lol-matchmaking/v1/ready-check")) {
        phase += 1;
        if (phase === 1)
          return buildResponse({ state: "InProgress", playerResponse: "None" });
        if (phase === 2) return buildResponse({}, 404); // session ended
        return buildResponse({ state: "InProgress", playerResponse: "None" });
      }
      if (url.endsWith("/lol-matchmaking/v1/ready-check/accept")) {
        return buildResponse({}, 204);
      }
      return buildResponse({}, 404);
    });

    service.setAutoAccept(true);
    service.setCreds(FAKE_CREDS);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(1500);
    await vi.advanceTimersByTimeAsync(1500);

    const acceptCalls = lcuFetchMock.mock.calls.filter(([url]) =>
      String(url).endsWith("/accept")
    ).length;
    expect(acceptCalls).toBe(2);
  });

  it("stops polling when auto-accept is disabled", async () => {
    lcuFetchMock.mockResolvedValue(buildResponse({ state: "Invalid" }));

    service.setAutoAccept(true);
    service.setCreds(FAKE_CREDS);
    await vi.advanceTimersByTimeAsync(0);

    const callsBefore = lcuFetchMock.mock.calls.length;
    service.setAutoAccept(false);

    await vi.advanceTimersByTimeAsync(5000);
    expect(lcuFetchMock.mock.calls.length).toBe(callsBefore);
  });

  it("stops polling when creds are cleared", async () => {
    lcuFetchMock.mockResolvedValue(buildResponse({ state: "Invalid" }));

    service.setAutoAccept(true);
    service.setCreds(FAKE_CREDS);
    await vi.advanceTimersByTimeAsync(0);

    const callsBefore = lcuFetchMock.mock.calls.length;
    service.setCreds(null);

    await vi.advanceTimersByTimeAsync(5000);
    expect(lcuFetchMock.mock.calls.length).toBe(callsBefore);
  });
});

interface ReadyCheckState {
  state?: string;
  playerResponse?: string;
}
