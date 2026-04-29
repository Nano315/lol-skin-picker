import { webcrypto } from "node:crypto";

export class RandomSelector {
  /** Crypto-backed random integer in [0, max). */
  static randomInt(max: number): number {
    if (max <= 1) return 0;
    const buf = new Uint32Array(1);
    webcrypto.getRandomValues(buf);
    return buf[0] % max;
  }

  /** Crypto-backed random float in [0, max). */
  static randomFloat(max: number): number {
    const buf = new Uint32Array(1);
    webcrypto.getRandomValues(buf);
    return (buf[0] / 0xffffffff) * max;
  }

  /**
   * Selection in `allChoices`:
   * - skips `prevId`
   * - skips the last `historyWindow` entries of `history`
   * - prefers never-seen items
   * - falls back to LRU-weighted random across the rest
   */
  static pickWithHistory(
    allChoices: number[],
    history: number[],
    historyWindow: number,
    prevId: number | null
  ): number | null {
    if (!allChoices.length) return null;

    const banned = new Set<number>();
    if (prevId != null) banned.add(prevId);
    const recent = history.slice(-historyWindow);
    for (const id of recent) banned.add(id);

    let pool = allChoices.filter((id) => !banned.has(id));

    if (!pool.length) {
      pool = allChoices.filter((id) => id !== prevId);
      if (!pool.length) return allChoices[0];
    }

    const neverSeen = pool.filter((id) => !history.includes(id));
    if (neverSeen.length) {
      return neverSeen[this.randomInt(neverSeen.length)];
    }

    const weights = pool.map((id) => {
      const lastIndex = history.lastIndexOf(id);
      if (lastIndex === -1) return 1;
      const distance = history.length - lastIndex;
      return distance > 0 ? distance : 1;
    });

    const total = weights.reduce((a, b) => a + b, 0);
    let r = this.randomInt(total);
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r < 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  /**
   * Selection that respects user-defined exclusions and skin history:
   *  1. drop user-excluded ids; if everything ends up excluded, fall back to
   *     the unfiltered pool so the random never blocks
   *  2. ban prevId + the last `historyWindow` entries of history
   *  3. prefer never-seen items
   *  4. otherwise LRU-weighted random
   */
  static pickWithExclusionsAndHistory(
    allChoices: number[],
    excluded: ReadonlySet<number>,
    history: number[],
    historyWindow: number,
    prevId: number | null
  ): number | null {
    if (!allChoices.length) return null;

    const filtered = allChoices.filter((id) => !excluded.has(id));
    const baseChoices = filtered.length > 0 ? filtered : allChoices;

    const banned = new Set<number>();
    if (prevId != null) banned.add(prevId);
    if (historyWindow > 0) {
      const recent = history.slice(-historyWindow);
      for (const id of recent) banned.add(id);
    }

    let pool = baseChoices.filter((id) => !banned.has(id));
    if (!pool.length) {
      pool = baseChoices.filter((id) => id !== prevId);
      if (!pool.length) return baseChoices[0];
    }

    const neverSeen = pool.filter((id) => !history.includes(id));
    if (neverSeen.length) {
      return neverSeen[this.randomInt(neverSeen.length)];
    }

    const weights = pool.map((id) => {
      const lastIndex = history.lastIndexOf(id);
      if (lastIndex === -1) return history.length + 1;
      const distance = history.length - lastIndex;
      return distance > 0 ? distance : 1;
    });

    const total = weights.reduce((a, b) => a + b, 0);
    if (total <= 0) return pool[0];

    let r = this.randomFloat(total);
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }
}
