/**
 * Persisted preference for which side the floating MatchControls widget
 * sits on. Mirrors the existing `usePrefs` pattern (localStorage + a
 * `pref-changed` custom event) but for a string value, since `usePrefs`
 * itself only supports booleans.
 */

import { useEffect, useState } from "react";

export type WidgetSide = "left" | "right";

const KEY = "pref-matchControlsSide";
const EVENT = "pref-changed";

export function readWidgetSide(): WidgetSide {
  try {
    const raw = localStorage.getItem(KEY);
    return raw === "left" ? "left" : "right";
  } catch {
    return "right";
  }
}

export function saveWidgetSide(side: WidgetSide): void {
  try {
    localStorage.setItem(KEY, side);
    window.dispatchEvent(
      new CustomEvent(EVENT, { detail: { key: "matchControlsSide", value: side } })
    );
  } catch {
    /* ignore quota / privacy mode failures */
  }
}

export function useWidgetSide(): readonly [WidgetSide, (side: WidgetSide) => void] {
  const [side, setSide] = useState<WidgetSide>(readWidgetSide);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string; value: string }>).detail;
      if (detail?.key === "matchControlsSide") {
        setSide(detail.value === "left" ? "left" : "right");
      }
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return [side, saveWidgetSide] as const;
}
