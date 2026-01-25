import { webcrypto } from "node:crypto";

export type Priority = "favorite" | "deprioritized" | null;

export interface PriorityMap {
  [skinId: number]: Priority;
}

export class RandomSelector {
  /**
   * RNG robuste base sur crypto.getRandomValues
   */
  static randomInt(max: number): number {
    if (max <= 1) return 0;
    const buf = new Uint32Array(1);
    webcrypto.getRandomValues(buf);
    return buf[0] % max;
  }

  /**
   * Random float between 0 and max using crypto
   */
  static randomFloat(max: number): number {
    const buf = new Uint32Array(1);
    webcrypto.getRandomValues(buf);
    return (buf[0] / 0xffffffff) * max;
  }

  /**
   * Get priority weight multiplier
   * favorite = 3x, deprioritized = 0.3x, normal = 1x
   */
  static getPriorityWeight(priority: Priority): number {
    if (priority === "favorite") return 3;
    if (priority === "deprioritized") return 0.3;
    return 1;
  }

  /**
   * Selection "intelligente" dans allChoices :
   * - evite prevId
   * - evite les N derniers (historyWindow)
   * - si possible : privilegie les jamais vus
   * - sinon : ponderation LRU (plus c'est ancien, plus c'est probable)
   */
  static pickWithHistory(
    allChoices: number[],
    history: number[],
    historyWindow: number,
    prevId: number | null
  ): number | null {
    if (!allChoices.length) return null;

    // 1) Construire l'ensemble des interdits (prev + N derniers)
    const banned = new Set<number>();
    if (prevId != null) banned.add(prevId);

    const recent = history.slice(-historyWindow);
    for (const id of recent) banned.add(id);

    let pool = allChoices.filter((id) => !banned.has(id));

    // 2) Si on a tout banni, on retombe sur "juste pas prevId"
    if (!pool.length) {
      pool = allChoices.filter((id) => id !== prevId);
      if (!pool.length) {
        // 1 seul choix possible -> on le prend
        return allChoices[0];
      }
    }

    // 3) Priorite aux jamais vus
    const neverSeen = pool.filter((id) => !history.includes(id));
    if (neverSeen.length) {
      const idx = this.randomInt(neverSeen.length);
      return neverSeen[idx];
    }

    // 4) Ponderation LRU : plus c'est ancien dans l'historique, plus le poids est grand
    const weights = pool.map((id) => {
      const lastIndex = history.lastIndexOf(id);
      if (lastIndex === -1) return 1;
      const distance = history.length - lastIndex; // 1 = dernier, 2 = avant-dernier, etc.
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
   * Selection with priority weights AND history:
   * 1. Apply history exclusion (ban recent skins)
   * 2. Apply priority weights to remaining pool
   * 3. Weighted random selection
   *
   * Priority weights: favorite = 3x, deprioritized = 0.3x, normal = 1x
   */
  static pickWithPriorityAndHistory(
    allChoices: number[],
    priorities: PriorityMap,
    history: number[],
    historyWindow: number,
    prevId: number | null
  ): number | null {
    if (!allChoices.length) return null;

    // 1) Construire l'ensemble des interdits (prev + N derniers)
    const banned = new Set<number>();
    if (prevId != null) banned.add(prevId);

    if (historyWindow > 0) {
      const recent = history.slice(-historyWindow);
      for (const id of recent) banned.add(id);
    }

    let pool = allChoices.filter((id) => !banned.has(id));

    // 2) Si on a tout banni, on retombe sur "juste pas prevId"
    if (!pool.length) {
      pool = allChoices.filter((id) => id !== prevId);
      if (!pool.length) {
        return allChoices[0];
      }
    }

    // 3) Calculate weights combining priority and LRU
    const weights = pool.map((id) => {
      // Base priority weight
      const priorityWeight = this.getPriorityWeight(priorities[id] ?? null);

      // LRU weight (older = higher)
      let lruWeight = 1;
      const lastIndex = history.lastIndexOf(id);
      if (lastIndex !== -1) {
        const distance = history.length - lastIndex;
        lruWeight = distance > 0 ? distance : 1;
      } else {
        // Never seen = bonus weight
        lruWeight = history.length + 1;
      }

      // Combine: priority * LRU
      return priorityWeight * lruWeight;
    });

    // 4) Weighted random selection
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
