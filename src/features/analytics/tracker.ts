// src/features/analytics/tracker.ts
import { getTelemetryConsent } from "../api";

const UMAMI_URL = import.meta.env.VITE_UMAMI_URL;
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;

type EventName =
  | "app_launch"
  | "solo_reroll"
  | "solo_reroll_chroma"
  | "solo_reroll_color"
  | "room_create"
  | "room_join"
  | "group_reroll"
  | "skinergy_match";

interface EventData {
  [key: string]: string | number | boolean;
}

async function isTrackingEnabled(): Promise<boolean> {
  // Skip if environment variables not configured
  if (!UMAMI_URL || !WEBSITE_ID) {
    return false;
  }

  try {
    return await getTelemetryConsent();
  } catch {
    return false;
  }
}

export async function trackEvent(name: EventName, data?: EventData): Promise<void> {
  if (!(await isTrackingEnabled())) return;

  try {
    await fetch(`${UMAMI_URL}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: {
          website: WEBSITE_ID,
          name,
          data: sanitizeData(data),
        },
        type: "event",
      }),
    });
  } catch (error) {
    // Silent fail - analytics should never break the app
    console.debug("[Analytics] Event failed:", error);
  }
}

function sanitizeData(data?: EventData): EventData | undefined {
  if (!data) return undefined;

  // Remove any potentially personal data
  const sanitized = { ...data };
  delete sanitized.summonerName;
  delete sanitized.skinId;
  delete sanitized.roomCode;
  delete sanitized.memberId;

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

// Convenience functions
export const trackAppLaunch = () => trackEvent("app_launch");
export const trackSoloReroll = () => trackEvent("solo_reroll");
export const trackSoloRerollChroma = () => trackEvent("solo_reroll_chroma");
export const trackSoloRerollColor = () => trackEvent("solo_reroll_color");
export const trackRoomCreate = () => trackEvent("room_create");
export const trackRoomJoin = () => trackEvent("room_join");
export const trackGroupReroll = () => trackEvent("group_reroll");
export const trackSkinergy = (matchCount: number) =>
  trackEvent("skinergy_match", { matchCount });
