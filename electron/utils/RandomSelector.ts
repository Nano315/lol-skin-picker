import { webcrypto } from "node:crypto";

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
   * Selection "intelligente" dans allChoices :
   * - evite prevId
   * - evite les N derniers (historyWindow)
   * - si possible : privilegie les jamais vus
   * - sinon : ponderation LRU (plus c’est ancien, plus c’est probable)
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
}
