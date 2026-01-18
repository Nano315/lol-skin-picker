// src/features/utils/colorCache.ts
// LRU Cache for computed chroma colors with localStorage persistence

const CACHE_KEY = 'skinpicker-color-cache';
const MAX_CACHE_SIZE = 500;

interface CacheEntry {
  color: string;
  timestamp: number;
}

type CacheData = Record<string, CacheEntry>;

class ColorCache {
  private cache: Map<string, CacheEntry>;

  constructor() {
    this.cache = this.loadFromStorage();
  }

  private getKey(championId: number, skinId: number, chromaId: number): string {
    return `${championId}-${skinId}-${chromaId}`;
  }

  get(championId: number, skinId: number, chromaId: number): string | null {
    const key = this.getKey(championId, skinId, chromaId);
    const entry = this.cache.get(key);
    if (entry) {
      // Update timestamp on access (LRU behavior)
      entry.timestamp = Date.now();
      return entry.color;
    }
    return null;
  }

  set(championId: number, skinId: number, chromaId: number, color: string): void {
    const key = this.getKey(championId, skinId, chromaId);
    this.cache.set(key, { color, timestamp: Date.now() });
    this.evictIfNeeded();
    this.saveToStorage();
  }

  has(championId: number, skinId: number, chromaId: number): boolean {
    const key = this.getKey(championId, skinId, chromaId);
    return this.cache.has(key);
  }

  private evictIfNeeded(): void {
    if (this.cache.size > MAX_CACHE_SIZE) {
      // Remove oldest entries (LRU eviction)
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, this.cache.size - MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  private loadFromStorage(): Map<string, CacheEntry> {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const data: CacheData = JSON.parse(stored);
        return new Map(Object.entries(data));
      }
    } catch {
      // Invalid cache data, start fresh
      console.warn('[colorCache] Failed to load cache from localStorage');
    }
    return new Map();
  }

  private saveToStorage(): void {
    try {
      const data: CacheData = Object.fromEntries(this.cache.entries());
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // localStorage full or unavailable
      console.warn('[colorCache] Failed to save cache to localStorage');
    }
  }

  clear(): void {
    this.cache.clear();
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // Ignore
    }
  }

  get size(): number {
    return this.cache.size;
  }
}

export const colorCache = new ColorCache();
