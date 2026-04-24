import { app, ipcMain, shell } from "electron";
import path from "node:path";
import { loadSettings, saveSettings } from "../settings";
import { track } from "../telemetry";

const OPEN_EXTERNAL_ALLOWED_HOSTS = new Set<string>([
  "discord.com",
  "www.discord.com",
  "github.com",
  "www.github.com",
  "raw.githubusercontent.com",
  "communitydragon.org",
  "www.communitydragon.org",
  "aptabase.com",
  "www.aptabase.com",
  "riotgames.com",
  "www.riotgames.com",
]);

function isAllowedExternalUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  return OPEN_EXTERNAL_ALLOWED_HOSTS.has(parsed.hostname.toLowerCase());
}

export function registerMiscIpc() {
  ipcMain.handle("open-external", (_e, url: string) => {
    if (typeof url !== "string" || !isAllowedExternalUrl(url)) {
      console.warn(`[Security] open-external blocked: ${url}`);
      return;
    }
    return shell.openExternal(url);
  });

  ipcMain.handle("open-logs-folder", async () => {
    const logFolder = path.join(app.getPath("userData"), "logs");
    const errorMessage = await shell.openPath(logFolder);
    if (errorMessage) {
      console.error("Failed to open log folder:", errorMessage);
    }
  });

  ipcMain.handle("get-open-at-login", async () => {
    const settings = await loadSettings();
    // On peut aussi verifier app.getLoginItemSettings().openAtLogin
    // mais ici on se fie a notre config ou a defaut false
    return settings.openAtLogin ?? false;
  });

  ipcMain.handle("set-open-at-login", async (_e, openAtLogin: boolean) => {
    app.setLoginItemSettings({
      openAtLogin,
      path: app.getPath("exe"), // Important pour Windows
    });

    const settings = await loadSettings();
    settings.openAtLogin = openAtLogin;
    await saveSettings(settings);
    track("setting_changed", { key: "open_at_login", value: openAtLogin });
  });
}
