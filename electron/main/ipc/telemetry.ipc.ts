import { ipcMain } from "electron";
import { loadSettings, saveSettings } from "../settings";
import { track, type TelemetryProps } from "../telemetry";

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
    if (enabled && !wasEnabled) {
      track("consent_granted");
    }
    return true;
  });

  ipcMain.handle("telemetry:isFirstLaunch", async () => {
    const settings = await loadSettings();
    const seen = settings.consentModalSeen ?? false;
    if (!seen) {
      settings.consentModalSeen = true;
      await saveSettings(settings);
    }
    return !seen;
  });

  ipcMain.handle(
    "telemetry:track",
    async (_e, name: string, props?: TelemetryProps) => {
      await track(name, props);
    }
  );
}
