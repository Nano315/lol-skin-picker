import { describe, it, expect, beforeEach } from "vitest";
import { matchLockStore } from "@/features/matchLock/matchLockStore";

/**
 * The store also tries to reach `window.lcu.setMatchLock` on every change to
 * forward the value to the Electron main process. In jsdom that property is
 * undefined; the store's internal `if (lcu && typeof lcu.setMatchLock === "function")`
 * guard short-circuits, so we don't need to mock anything here.
 */
describe("matchLockStore", () => {
  beforeEach(() => {
    matchLockStore.setLocked(false);
  });

  it("starts unlocked", () => {
    expect(matchLockStore.getLocked()).toBe(false);
  });

  it("setLocked(true) flips the value", () => {
    matchLockStore.setLocked(true);
    expect(matchLockStore.getLocked()).toBe(true);
  });

  it("toggle flips the value", () => {
    matchLockStore.toggle();
    expect(matchLockStore.getLocked()).toBe(true);
    matchLockStore.toggle();
    expect(matchLockStore.getLocked()).toBe(false);
  });

  it("notifies subscribers on change", () => {
    const calls: boolean[] = [];
    const unsub = matchLockStore.subscribe((locked) => calls.push(locked));

    matchLockStore.setLocked(true);
    matchLockStore.setLocked(false);

    expect(calls).toEqual([true, false]);
    unsub();
  });

  it("does NOT notify on a no-op set (same value)", () => {
    const calls: boolean[] = [];
    const unsub = matchLockStore.subscribe((locked) => calls.push(locked));

    matchLockStore.setLocked(false);

    expect(calls).toEqual([]);
    unsub();
  });

  it("unsubscribe stops further notifications", () => {
    const calls: boolean[] = [];
    const unsub = matchLockStore.subscribe((locked) => calls.push(locked));

    matchLockStore.setLocked(true);
    expect(calls).toEqual([true]);

    unsub();
    matchLockStore.setLocked(false);
    expect(calls).toEqual([true]);
  });

  it("supports multiple independent subscribers", () => {
    const a: boolean[] = [];
    const b: boolean[] = [];
    const unsubA = matchLockStore.subscribe((v) => a.push(v));
    const unsubB = matchLockStore.subscribe((v) => b.push(v));

    matchLockStore.setLocked(true);

    expect(a).toEqual([true]);
    expect(b).toEqual([true]);

    unsubA();
    matchLockStore.setLocked(false);

    expect(a).toEqual([true]);
    expect(b).toEqual([true, false]);

    unsubB();
  });
});
