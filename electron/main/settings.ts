import { app } from "electron";
import { join, dirname } from "node:path";
import { promises as fs } from "node:fs";
import { logger as log } from "../logger";

type Settings = {
  displayId?: number;
  openAtLogin?: boolean;
  telemetryEnabled?: boolean;
  consentModalSeen?: boolean;
};

const settingsPath = join(app.getPath("userData"), "settings.json");

export async function loadSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(settingsPath, "utf-8");
    return JSON.parse(data) as Settings;
  } catch (err) {
    log.debug("[settings] Could not load settings file, using defaults", err);
    return {};
  }
}

export async function saveSettings(s: Settings) {
  try {
    // Ensure directory exists
    await fs.mkdir(dirname(settingsPath), { recursive: true });
    await fs.writeFile(settingsPath, JSON.stringify(s, null, 2), "utf-8");
    log.debug("[settings] Settings saved successfully", s);
  } catch (err) {
    log.error("[settings] Failed to save settings", err);
  }
}
