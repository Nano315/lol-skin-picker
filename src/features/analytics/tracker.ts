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
    console.debug("[Analytics] Missing UMAMI_URL or WEBSITE_ID");
    return false;
  }

  try {
    return await getTelemetryConsent();
  } catch {
    return false;
  }
}

export async function trackEvent(name: EventName, data?: EventData): Promise<void> {
  if (!(await isTrackingEnabled())) {
    console.debug("[Analytics] Tracking disabled, skipping event:", name);
    return;
  }

  try {
    // Umami API format - must include required fields for Electron apps
    const payload = {
      website: WEBSITE_ID,
      hostname: "skinpicker.app",
      language: navigator.language || "en",
      screen: `${window.screen.width}x${window.screen.height}`,
      url: "/",
      title: "SkinPicker",
      name,
      data: sanitizeData(data),
    };

    console.debug("[Analytics] Sending event:", name, payload);

    const response = await fetch(`${UMAMI_URL}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "SkinPicker Desktop App",
      },
      body: JSON.stringify({
        type: "event",
        payload,
      }),
    });

    if (!response.ok) {
      console.debug("[Analytics] Event response not ok:", response.status);
    }
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
