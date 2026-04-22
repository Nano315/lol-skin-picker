import { initialize, trackEvent as aptabaseTrackEvent } from "@aptabase/electron/main";
import { logger } from "../logger";
import { loadSettings } from "./settings";

export type TelemetryProps = Record<string, string | number | boolean>;

// Vite reads empty env values as "" (not undefined), so normalise to undefined
// to keep "unset" and "set to empty" equivalent for host detection.
const APP_KEY = (import.meta.env.VITE_APTABASE_APP_KEY as string | undefined) || undefined;
const HOST = (import.meta.env.VITE_APTABASE_HOST as string | undefined) || undefined;

let initialized = false;

// MUST be called before `app.whenReady()` fires — the Aptabase SDK checks
// `app.isReady()` and disables tracking permanently if called too late.
export function initTelemetry(): void {
  if (initialized) return;
  if (!APP_KEY) {
    logger.info("[telemetry] VITE_APTABASE_APP_KEY not set — telemetry disabled");
    return;
  }

  try {
    // initialize() returns a Promise<void> but registers state synchronously;
    // fire-and-forget is the pattern recommended by the Aptabase SDK.
    void initialize(APP_KEY, HOST ? { host: HOST } : undefined);
    initialized = true;
    logger.info("[telemetry] Aptabase initialized", { host: HOST ?? "cloud" });
  } catch (err) {
    logger.warn("[telemetry] Failed to initialize Aptabase", err);
  }
}

export async function track(name: string, props?: TelemetryProps): Promise<void> {
  if (!initialized) return;

  try {
    const settings = await loadSettings();
    if (!settings.telemetryEnabled) return;
    await aptabaseTrackEvent(name, props);
  } catch (err) {
    logger.warn("[telemetry] trackEvent failed", { name, err });
  }
}
