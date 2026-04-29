import { describe, it, expect, vi } from "vitest";

// Mock node:crypto for browser environment
vi.mock("node:crypto", () => ({
  default: {
    webcrypto: {
      getRandomValues: (arr: Uint32Array) => {
        arr[0] = 12345;
        return arr;
      },
    },
  },
  webcrypto: {
    getRandomValues: (arr: Uint32Array) => {
      arr[0] = 12345;
      return arr;
    },
  },
}));

import { RandomSelector } from "../../utils/RandomSelector";

describe("RandomSelector", () => {
  describe("randomInt", () => {
    it("returns 0 when max is 0", () => {
      expect(RandomSelector.randomInt(0)).toBe(0);
    });

    it("returns 0 when max is 1", () => {
      expect(RandomSelector.randomInt(1)).toBe(0);
    });

    it("returns a value strictly less than max", () => {
      const result = RandomSelector.randomInt(100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(100);
    });
  });

  describe("pickWithHistory", () => {
    it("returns null for empty choices", () => {
      expect(RandomSelector.pickWithHistory([], [], 3, null)).toBeNull();
    });

    it("returns the only choice when there is one option", () => {
      expect(RandomSelector.pickWithHistory([100], [], 3, null)).toBe(100);
    });

    it("avoids prevId when other options exist", () => {
      const choices = [100, 200, 300];
      for (let i = 0; i < 10; i++) {
        const result = RandomSelector.pickWithHistory(choices, [], 0, 100);
        expect(result).not.toBe(100);
      }
    });

    it("excludes recent history items based on historyWindow", () => {
      const result = RandomSelector.pickWithHistory(
        [100, 200, 300, 400, 500],
        [100, 200, 300],
        2,
        null
      );
      expect(result).not.toBe(200);
      expect(result).not.toBe(300);
    });

    it("prioritizes never-seen items", () => {
      const result = RandomSelector.pickWithHistory(
        [100, 200, 300, 400],
        [100, 200],
        1,
        null
      );
      expect([300, 400]).toContain(result);
    });

    it("falls back to all choices if every option is banned", () => {
      const result = RandomSelector.pickWithHistory([100, 200], [100, 200], 3, 100);
      expect([100, 200]).toContain(result);
    });

    it("does not exclude any history when historyWindow is 0", () => {
      const result = RandomSelector.pickWithHistory(
        [100, 200, 300],
        [100, 200, 300],
        0,
        null
      );
      expect([100, 200, 300]).toContain(result);
    });
  });

  describe("pickWithExclusionsAndHistory", () => {
    const empty = new Set<number>();

    it("returns null for empty choices", () => {
      expect(
        RandomSelector.pickWithExclusionsAndHistory([], empty, [], 3, null)
      ).toBeNull();
    });

    it("returns the only choice when there is one option", () => {
      expect(
        RandomSelector.pickWithExclusionsAndHistory([100], empty, [], 3, null)
      ).toBe(100);
    });

    it("excludes user-excluded ids from the pool", () => {
      const excluded = new Set([200, 300]);
      for (let i = 0; i < 20; i++) {
        const result = RandomSelector.pickWithExclusionsAndHistory(
          [100, 200, 300, 400],
          excluded,
          [],
          0,
          null
        );
        expect(result).not.toBe(200);
        expect(result).not.toBe(300);
      }
    });

    it("locks onto the only remaining choice when exclusions narrow the pool", () => {
      const excluded = new Set([100, 200, 300]);
      const result = RandomSelector.pickWithExclusionsAndHistory(
        [100, 200, 300, 400],
        excluded,
        [],
        0,
        null
      );
      expect(result).toBe(400);
    });

    it("falls back to all choices when every option is excluded (safety net)", () => {
      const excluded = new Set([100, 200]);
      const result = RandomSelector.pickWithExclusionsAndHistory(
        [100, 200],
        excluded,
        [],
        0,
        null
      );
      expect([100, 200]).toContain(result);
    });

    it("avoids prevId when other options exist", () => {
      for (let i = 0; i < 10; i++) {
        const result = RandomSelector.pickWithExclusionsAndHistory(
          [100, 200, 300],
          empty,
          [],
          0,
          100
        );
        expect(result).not.toBe(100);
      }
    });

    it("excludes recent history items based on historyWindow", () => {
      const result = RandomSelector.pickWithExclusionsAndHistory(
        [100, 200, 300, 400, 500],
        empty,
        [100, 200, 300],
        2,
        null
      );
      expect(result).not.toBe(200);
      expect(result).not.toBe(300);
    });

    it("prioritizes never-seen items", () => {
      const result = RandomSelector.pickWithExclusionsAndHistory(
        [100, 200, 300, 400],
        empty,
        [100, 200],
        1,
        null
      );
      expect([300, 400]).toContain(result);
    });

    it("falls back to all choices when prev + history bans everything", () => {
      const result = RandomSelector.pickWithExclusionsAndHistory(
        [100, 200],
        empty,
        [100, 200],
        3,
        100
      );
      expect([100, 200]).toContain(result);
    });

    it("combines exclusions with history exclusion", () => {
      const excluded = new Set([100]);
      const result = RandomSelector.pickWithExclusionsAndHistory(
        [100, 200, 300, 400],
        excluded,
        [200, 300],
        2,
        null
      );
      expect(result).toBe(400);
    });
  });
});
