// src/__tests__/colorCache.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before importing the module
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('ColorCache', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset the module to get a fresh cache instance
    vi.resetModules();
  });

  it('should store and retrieve color values', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    colorCache.set(123, 456, 789, 'rgba(255,0,0,0.5)');

    const result = colorCache.get(123, 456, 789);
    expect(result).toBe('rgba(255,0,0,0.5)');
  });

  it('should return null for non-existent entries', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    const result = colorCache.get(999, 999, 999);
    expect(result).toBeNull();
  });

  it('should check if entry exists with has()', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    expect(colorCache.has(123, 456, 789)).toBe(false);

    colorCache.set(123, 456, 789, 'rgba(0,255,0,0.5)');

    expect(colorCache.has(123, 456, 789)).toBe(true);
  });

  it('should persist to localStorage on set', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    colorCache.set(123, 456, 789, 'rgba(0,0,255,0.5)');

    expect(localStorageMock.setItem).toHaveBeenCalled();
    const savedData = localStorageMock.setItem.mock.calls[0][1];
    const parsed = JSON.parse(savedData);
    expect(parsed['123-456-789'].color).toBe('rgba(0,0,255,0.5)');
  });

  it('should load from localStorage on initialization', async () => {
    // Pre-populate localStorage
    const cacheData = {
      '100-200-300': { color: 'rgba(128,128,128,0.5)', timestamp: Date.now() }
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(cacheData));

    const { colorCache } = await import('../features/utils/colorCache');

    const result = colorCache.get(100, 200, 300);
    expect(result).toBe('rgba(128,128,128,0.5)');
  });

  it('should evict oldest entries when exceeding max size', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    // Add entries with staggered timestamps
    const MAX_SIZE = 500;
    for (let i = 0; i < MAX_SIZE + 10; i++) {
      colorCache.set(1, 1, i, `color-${i}`);
    }

    // Cache should not exceed MAX_SIZE
    expect(colorCache.size).toBeLessThanOrEqual(MAX_SIZE);

    // Oldest entries should be evicted
    expect(colorCache.get(1, 1, 0)).toBeNull();
    expect(colorCache.get(1, 1, 9)).toBeNull();

    // Newer entries should still exist
    expect(colorCache.get(1, 1, MAX_SIZE + 9)).toBe(`color-${MAX_SIZE + 9}`);
  });

  it('should clear cache and localStorage', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    colorCache.set(123, 456, 789, 'rgba(255,255,255,0.5)');
    expect(colorCache.size).toBeGreaterThan(0);

    colorCache.clear();

    expect(colorCache.size).toBe(0);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('skinpicker-color-cache');
  });

  it('should update timestamp on access (LRU behavior)', async () => {
    const { colorCache } = await import('../features/utils/colorCache');

    // Fill the cache almost to capacity
    const MAX_SIZE = 500;
    for (let i = 0; i < MAX_SIZE - 1; i++) {
      colorCache.set(1, 1, i, `color-${i}`);
    }

    // Access entry 0 to make it "recently used"
    const accessedValue = colorCache.get(1, 1, 0);
    expect(accessedValue).toBe('color-0');

    // Add more entries to trigger eviction
    for (let i = MAX_SIZE - 1; i < MAX_SIZE + 10; i++) {
      colorCache.set(1, 1, i, `color-${i}`);
    }

    // Entry 0 should still exist (was accessed recently, timestamp updated)
    expect(colorCache.get(1, 1, 0)).toBe('color-0');
    // Entry 1 should be evicted (was never accessed after initial set)
    expect(colorCache.get(1, 1, 1)).toBeNull();
  });

  it('should handle corrupted localStorage gracefully', async () => {
    localStorageMock.getItem.mockReturnValueOnce('invalid json {{{');

    // Should not throw, should start with empty cache
    const { colorCache } = await import('../features/utils/colorCache');
    expect(colorCache.size).toBe(0);
  });
});
