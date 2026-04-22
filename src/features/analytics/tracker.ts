// src/features/analytics/tracker.ts
//
// Thin wrapper over the Aptabase bridge exposed by the Electron preload
// (`window.lcu.trackEvent`). Consent is enforced in the main process, so
// callers here never need to check it themselves.
//
// Aptabase automatically enriches every event with: install ID (persistent
// per OS user), session ID, app version, OS, locale, engine version and
// country. Do NOT add any of those here.
//
// Main-process-only events (lcu_connected, lcu_disconnected, update_*,
// setting_changed, priority_*) are emitted directly from the main process
// via `track()` in electron/main/telemetry.ts — they do NOT round-trip
// through this file.
type EventName =
  | "app_launch"
  | "screen_view"
  | "solo_reroll"
  | "solo_reroll_chroma"
  | "solo_reroll_color"
  | "room_create"
  | "room_join"
  | "group_reroll"
  | "skinergy_match"
  | "consent_granted";

type EventProps = Record<string, string | number | boolean>;

export async function trackEvent(name: EventName, props?: EventProps): Promise<void> {
  try {
    await window.lcu.trackEvent(name, props);
  } catch {
    // Analytics must never break the app.
  }
}

export const trackAppLaunch = () => trackEvent("app_launch");
export const trackScreenView = (name: string) => trackEvent("screen_view", { name });
export const trackSoloReroll = () => trackEvent("solo_reroll");
export const trackSoloRerollChroma = () => trackEvent("solo_reroll_chroma");
export const trackSoloRerollColor = () => trackEvent("solo_reroll_color");
export const trackRoomCreate = () => trackEvent("room_create");
export const trackRoomJoin = (memberCount: number) =>
  trackEvent("room_join", { memberCount });
export const trackGroupReroll = (
  syncType: "sameColor" | "skinLine",
  memberCount: number
) => trackEvent("group_reroll", { syncType, memberCount });
export const trackSkinergy = (matchCount: number) =>
  trackEvent("skinergy_match", { matchCount });
