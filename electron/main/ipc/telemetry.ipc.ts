import { ipcMain } from "electron";
import { loadSettings, saveSettings } from "../settings";
import { track, type TelemetryProps } from "../telemetry";
import {
  getOnboardingState,
  markOnboardingCompleted,
} from "../onboardingState";
import { logger as log } from "../../logger";

export function registerTelemetryIpc() {
  ipcMain.handle("telemetry:getConsent", async () => {
    const settings = await loadSettings();
    return settings.telemetryEnabled ?? false; // Default: disabled (opt-in)
  });

  ipcMain.handle("telemetry:setConsent", async (_e, enabled: boolean) => {
    const settings = await loadSettings();
    const wasEnabled = settings.telemetryEnabled ?? false;
    settings.telemetryEnabled = enabled;
    await saveSettings(settings);

    // Mark consent as explicitly recorded so we don't re-prompt on next launch.
    // Done ONLY here (in response to a user action), never on a passive read —
    // unlike the previous `isFirstLaunch` handler which flipped the flag at
    // read time and could lose it if the disk write later silently failed.
    try {
      await markOnboardingCompleted("consentRecorded");
    } catch (err) {
      // Non-fatal: settings.json carries the actual consent VALUE; the
      // onboarding flag only governs whether we re-prompt. If this fails,
      // the worst case is one extra prompt next launch — but the user's
      // recorded choice is honoured.
      log.warn("[telemetry] Failed to persist consentRecorded flag", err);
    }

    if (enabled && !wasEnabled) {
      track("consent_granted");
    }
    return true;
  });

  ipcMain.handle("telemetry:isFirstLaunch", async () => {
    // Pure read — no side effects. The flag flips only when the user
    // explicitly accepts/declines via `setConsent`, which makes this safe
    // to call multiple times during boot without losing the consent state.
    const state = await getOnboardingState();
    return !state.consentRecorded;
  });

  ipcMain.handle(
    "telemetry:track",
    async (_e, name: string, props?: TelemetryProps) => {
      await track(name, props);
    }
  );
}
