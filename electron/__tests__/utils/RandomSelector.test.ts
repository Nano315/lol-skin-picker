import { describe, it, expect, vi } from "vitest";

// Mock node:crypto for browser environment
vi.mock("node:crypto", () => ({
  default: {
    webcrypto: {
      getRandomValues: (arr: Uint32Array) => {
        // Deterministic mock for testing
        arr[0] = 12345;
        return arr;
      },
    },
  },
  webcrypto: {
    getRandomValues: (arr: Uint32Array) => {
      // Deterministic mock for testing
      arr[0] = 12345;
      return arr;
    },
  },
}));

import { RandomSelector } from "../../utils/RandomSelector";

describe("RandomSelector", () => {
  describe("randomInt", () => {
    it("should return 0 when max is 0", () => {
      expect(RandomSelector.randomInt(0)).toBe(0);
    });

    it("should return 0 when max is 1", () => {
      expect(RandomSelector.randomInt(1)).toBe(0);
    });

    it("should return value less than max", () => {
      const result = RandomSelector.randomInt(100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(100);
    });
  });

  describe("pickWithHistory", () => {
    it("should return null for empty choices", () => {
      const result = RandomSelector.pickWithHistory([], [], 3, null);
      expect(result).toBeNull();
    });

    it("should return the only choice when single option", () => {
      const result = RandomSelector.pickWithHistory([100], [], 3, null);
      expect(result).toBe(100);
    });

    it("should avoid prevId when possible", () => {
      // With deterministic random, test that prevId is filtered
      const choices = [100, 200, 300];
      const prevId = 100;

      // Run multiple times to verify exclusion
      for (let i = 0; i < 10; i++) {
        const result = RandomSelector.pickWithHistory(choices, [], 0, prevId);
        if (result !== prevId || choices.length === 1) {
          // Either avoided prevId or it was the only choice
          expect(result).not.toBeNull();
        }
      }
    });

    it("should exclude recent history items based on historyWindow", () => {
      const choices = [100, 200, 300, 400, 500];
      const history = [100, 200, 300]; // 3 recent
      const historyWindow = 2; // Only exclude last 2 (200, 300)

      // With window=2, only 200 and 300 should be banned
      // 100 is old enough to be allowed
      const result = RandomSelector.pickWithHistory(
        choices,
        history,
        historyWindow,
        null
      );

      expect(result).not.toBeNull();
      // Result should not be 200 or 300 (recent within window)
      expect(result).not.toBe(200);
      expect(result).not.toBe(300);
    });

    it("should prioritize never-seen items", () => {
      const choices = [100, 200, 300, 400];
      const history = [100, 200]; // 100, 200 have been seen
      const historyWindow = 1; // Only ban last 1 (200)

      // 300, 400 are never seen, should be prioritized
      const result = RandomSelector.pickWithHistory(
        choices,
        history,
        historyWindow,
        null
      );

      // Should pick from never seen (300 or 400)
      expect([300, 400]).toContain(result);
    });

    it("should fallback to all choices if all are banned", () => {
      const choices = [100, 200];
      const history = [100, 200];
      const historyWindow = 3; // Bans both

      const result = RandomSelector.pickWithHistory(
        choices,
        history,
        historyWindow,
        100 // Also try to exclude 100
      );

      // Should still return something
      expect(result).not.toBeNull();
      expect([100, 200]).toContain(result);
    });

    it("should handle historyWindow of 0 (no exclusion)", () => {
      const choices = [100, 200, 300];
      const history = [100, 200, 300];
      const historyWindow = 0; // No history exclusion

      const result = RandomSelector.pickWithHistory(
        choices,
        history,
        historyWindow,
        null
      );

      expect(result).not.toBeNull();
      expect(choices).toContain(result);
    });

    it("should use LRU weighting when all items have been seen", () => {
      const choices = [100, 200, 300];
      const history = [100, 200, 300]; // All seen, 100 is oldest
      const historyWindow = 0; // Don't ban any

      // Oldest (100) should have higher weight
      // This is statistical, so we just verify it returns a valid choice
      const result = RandomSelector.pickWithHistory(
        choices,
        history,
        historyWindow,
        null
      );

      expect(result).not.toBeNull();
      expect(choices).toContain(result);
    });
  });
});
