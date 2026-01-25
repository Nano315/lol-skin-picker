import { ipcMain } from "electron";
import { loadSettings, saveSettings } from "../settings";

export function registerTelemetryIpc() {
  ipcMain.handle("telemetry:getConsent", async () => {
    const settings = await loadSettings();
    return settings.telemetryEnabled ?? false; // Default: disabled (opt-in)
  });

  ipcMain.handle("telemetry:setConsent", async (_e, enabled: boolean) => {
    const settings = await loadSettings();
    settings.telemetryEnabled = enabled;
    await saveSettings(settings);
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
}
