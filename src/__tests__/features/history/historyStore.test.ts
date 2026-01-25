import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for historyStore - the renderer-side IPC wrapper
 * Since the actual functions just delegate to window.lcu IPC,
 * we test the IPC integration pattern rather than implementation details.
 *
 * The main logic is tested in the electron main process tests.
 */
describe("historyStore types and exports", () => {
  it("should export all required functions", async () => {
    // Temporarily mock window.lcu
    const originalWindow = global.window;
    const mockLcu = {
      addToHistory: vi.fn().mockResolvedValue(undefined),
      getRecentHistory: vi.fn().mockResolvedValue([]),
      clearHistory: vi.fn().mockResolvedValue(undefined),
      getHistorySettings: vi.fn().mockResolvedValue({ historySize: 5, historyEnabled: true }),
      setHistorySettings: vi.fn().mockResolvedValue(undefined),
    };

    // @ts-expect-error - mocking window
    global.window = { lcu: mockLcu };

    // Dynamic import to get fresh module with mocked window
    const historyStore = await import("../../../features/history/historyStore");

    expect(typeof historyStore.addToHistory).toBe("function");
    expect(typeof historyStore.getRecentHistory).toBe("function");
    expect(typeof historyStore.clearHistory).toBe("function");
    expect(typeof historyStore.getHistorySettings).toBe("function");
    expect(typeof historyStore.setHistorySettings).toBe("function");

    // Restore
    global.window = originalWindow;
  });

  it("should define HistoryEntry interface correctly", async () => {
    // Type check - this will fail at compile time if types are wrong
    const entry: import("../../../features/history/historyStore").HistoryEntry = {
      skinId: 123,
      chromaId: 456,
      timestamp: Date.now(),
    };

    expect(entry.skinId).toBe(123);
    expect(entry.chromaId).toBe(456);
    expect(typeof entry.timestamp).toBe("number");
  });

  it("should define HistorySettings interface correctly", async () => {
    const settings: import("../../../features/history/historyStore").HistorySettings = {
      historySize: 5,
      historyEnabled: true,
    };

    expect(settings.historySize).toBe(5);
    expect(settings.historyEnabled).toBe(true);
  });

  it("should define HistoryStore interface correctly", async () => {
    const store: import("../../../features/history/historyStore").HistoryStore = {
      123: [
        { skinId: 100, chromaId: 0, timestamp: 1000 },
        { skinId: 200, chromaId: 201, timestamp: 2000 },
      ],
    };

    expect(store[123]).toHaveLength(2);
    expect(store[123][0].skinId).toBe(100);
  });
});

describe("historyStore IPC contracts", () => {
  let mockLcu: Record<string, ReturnType<typeof vi.fn>>;
  let originalWindow: typeof global.window;

  beforeEach(() => {
    // Reset modules BEFORE setting up mocks to ensure fresh imports
    vi.resetModules();

    originalWindow = global.window;
    mockLcu = {
      addToHistory: vi.fn().mockResolvedValue(undefined),
      getRecentHistory: vi.fn().mockResolvedValue([]),
      clearHistory: vi.fn().mockResolvedValue(undefined),
      getHistorySettings: vi.fn().mockResolvedValue({ historySize: 5, historyEnabled: true }),
      setHistorySettings: vi.fn().mockResolvedValue(undefined),
    };
    // @ts-expect-error - mocking window
    global.window = { lcu: mockLcu };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("addToHistory should call lcu.addToHistory with correct params", async () => {
    const { addToHistory } = await import("../../../features/history/historyStore");
    await addToHistory(1, 100, 200);
    expect(mockLcu.addToHistory).toHaveBeenCalledWith(1, 100, 200);
  });

  it("getRecentHistory should call lcu.getRecentHistory with championId", async () => {
    const mockHistory = [{ skinId: 100, chromaId: 0, timestamp: 1000 }];
    mockLcu.getRecentHistory.mockResolvedValueOnce(mockHistory);

    const { getRecentHistory } = await import("../../../features/history/historyStore");
    const result = await getRecentHistory(123);

    expect(mockLcu.getRecentHistory).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockHistory);
  });

  it("clearHistory should call lcu.clearHistory", async () => {
    const { clearHistory } = await import("../../../features/history/historyStore");
    await clearHistory(123);
    expect(mockLcu.clearHistory).toHaveBeenCalledWith(123);
  });

  it("clearHistory without championId should clear all", async () => {
    const { clearHistory } = await import("../../../features/history/historyStore");
    await clearHistory();
    expect(mockLcu.clearHistory).toHaveBeenCalledWith(undefined);
  });

  it("getHistorySettings should return settings from lcu", async () => {
    const mockSettings = { historySize: 7, historyEnabled: false };
    mockLcu.getHistorySettings.mockResolvedValueOnce(mockSettings);

    const { getHistorySettings } = await import("../../../features/history/historyStore");
    const result = await getHistorySettings();

    expect(result).toEqual(mockSettings);
  });

  it("setHistorySettings should call lcu.setHistorySettings", async () => {
    const { setHistorySettings } = await import("../../../features/history/historyStore");
    await setHistorySettings({ historySize: 10 });
    expect(mockLcu.setHistorySettings).toHaveBeenCalledWith({ historySize: 10 });
  });
});
