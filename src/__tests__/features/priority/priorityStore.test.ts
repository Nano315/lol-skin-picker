import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock window.lcu before importing the module
const mockLcu = {
  setPriority: vi.fn(),
  getPriority: vi.fn(),
  getAllPriorities: vi.fn(),
  clearPriorities: vi.fn(),
  bulkSetPriority: vi.fn(),
};

vi.stubGlobal("window", { lcu: mockLcu });

describe("priorityStore", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("setPriority", () => {
    it("should call lcu.setPriority with correct parameters", async () => {
      mockLcu.setPriority.mockResolvedValue(undefined);

      const { setPriority } = await import("../../../features/priority/priorityStore");

      await setPriority(1, 1001, "favorite");

      expect(mockLcu.setPriority).toHaveBeenCalledWith(1, 1001, "favorite");
    });

    it("should handle deprioritized priority", async () => {
      mockLcu.setPriority.mockResolvedValue(undefined);

      const { setPriority } = await import("../../../features/priority/priorityStore");

      await setPriority(1, 1001, "deprioritized");

      expect(mockLcu.setPriority).toHaveBeenCalledWith(1, 1001, "deprioritized");
    });

    it("should handle null priority (reset)", async () => {
      mockLcu.setPriority.mockResolvedValue(undefined);

      const { setPriority } = await import("../../../features/priority/priorityStore");

      await setPriority(1, 1001, null);

      expect(mockLcu.setPriority).toHaveBeenCalledWith(1, 1001, null);
    });
  });

  describe("getPriority", () => {
    it("should return priority from lcu", async () => {
      mockLcu.getPriority.mockResolvedValue("favorite");

      const { getPriority } = await import("../../../features/priority/priorityStore");

      const result = await getPriority(1, 1001);

      expect(result).toBe("favorite");
      expect(mockLcu.getPriority).toHaveBeenCalledWith(1, 1001);
    });

    it("should return null for skins without priority", async () => {
      mockLcu.getPriority.mockResolvedValue(null);

      const { getPriority } = await import("../../../features/priority/priorityStore");

      const result = await getPriority(1, 1001);

      expect(result).toBeNull();
    });
  });

  describe("getAllPriorities", () => {
    it("should return all priorities for a champion", async () => {
      const mockPriorities = { 1001: "favorite", 1002: "deprioritized" };
      mockLcu.getAllPriorities.mockResolvedValue(mockPriorities);

      const { getAllPriorities } = await import("../../../features/priority/priorityStore");

      const result = await getAllPriorities(1);

      expect(result).toEqual(mockPriorities);
      expect(mockLcu.getAllPriorities).toHaveBeenCalledWith(1);
    });

    it("should return empty object for champion with no priorities", async () => {
      mockLcu.getAllPriorities.mockResolvedValue({});

      const { getAllPriorities } = await import("../../../features/priority/priorityStore");

      const result = await getAllPriorities(999);

      expect(result).toEqual({});
    });
  });

  describe("clearPriorities", () => {
    it("should clear priorities for specific champion", async () => {
      mockLcu.clearPriorities.mockResolvedValue(undefined);

      const { clearPriorities } = await import("../../../features/priority/priorityStore");

      await clearPriorities(1);

      expect(mockLcu.clearPriorities).toHaveBeenCalledWith(1);
    });

    it("should clear all priorities when no championId provided", async () => {
      mockLcu.clearPriorities.mockResolvedValue(undefined);

      const { clearPriorities } = await import("../../../features/priority/priorityStore");

      await clearPriorities();

      expect(mockLcu.clearPriorities).toHaveBeenCalledWith(undefined);
    });
  });

  describe("favoriteAll", () => {
    it("should call bulkSetPriority with favorite for all skin ids", async () => {
      mockLcu.bulkSetPriority.mockResolvedValue(undefined);

      const { favoriteAll } = await import("../../../features/priority/priorityStore");

      await favoriteAll(1, [1001, 1002, 1003]);

      expect(mockLcu.bulkSetPriority).toHaveBeenCalledWith(1, [1001, 1002, 1003], "favorite");
    });

    it("should handle empty skin ids array", async () => {
      mockLcu.bulkSetPriority.mockResolvedValue(undefined);

      const { favoriteAll } = await import("../../../features/priority/priorityStore");

      await favoriteAll(1, []);

      expect(mockLcu.bulkSetPriority).toHaveBeenCalledWith(1, [], "favorite");
    });
  });

  describe("resetAllPriorities", () => {
    it("should call clearPriorities for the champion", async () => {
      mockLcu.clearPriorities.mockResolvedValue(undefined);

      const { resetAllPriorities } = await import("../../../features/priority/priorityStore");

      await resetAllPriorities(1);

      expect(mockLcu.clearPriorities).toHaveBeenCalledWith(1);
    });
  });
});
