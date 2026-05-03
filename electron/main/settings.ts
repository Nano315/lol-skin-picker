import { app } from "electron";
import { join, dirname } from "node:path";
import { promises as fs } from "node:fs";
import { logger as log } from "../logger";
import { safeParseObject } from "../utils/jsonGuards";

type Settings = {
  displayId?: number;
  openAtLogin?: boolean;
  telemetryEnabled?: boolean;
  consentModalSeen?: boolean;
  autoAcceptMatch?: boolean;
};

const settingsPath = join(app.getPath("userData"), "settings.json");

function coerceSettings(raw: Record<string, unknown>): Settings {
  const out: Settings = {};
  if (typeof raw.displayId === "number" && Number.isInteger(raw.displayId)) {
    out.displayId = raw.displayId;
  }
  if (typeof raw.openAtLogin === "boolean") out.openAtLogin = raw.openAtLogin;
  if (typeof raw.telemetryEnabled === "boolean") {
    out.telemetryEnabled = raw.telemetryEnabled;
  }
  if (typeof raw.consentModalSeen === "boolean") {
    out.consentModalSeen = raw.consentModalSeen;
  }
  if (typeof raw.autoAcceptMatch === "boolean") {
    out.autoAcceptMatch = raw.autoAcceptMatch;
  }
  return out;
}

export async function loadSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(settingsPath, "utf-8");
    const parsed = safeParseObject(data);
    if (!parsed) {
      log.warn("[settings] settings.json is malformed, using defaults");
      return {};
    }
    return coerceSettings(parsed);
  } catch (err) {
    log.debug("[settings] Could not load settings file, using defaults", err);
    return {};
  }
}

export async function saveSettings(s: Partial<Settings>) {
  try {
    // Ensure directory exists
    await fs.mkdir(dirname(settingsPath), { recursive: true });
    // Merge with existing settings instead of overwriting
    const existing = await loadSettings();
    const merged = { ...existing, ...s };
    await fs.writeFile(settingsPath, JSON.stringify(merged, null, 2), "utf-8");
    log.debug("[settings] Settings saved successfully", merged);
  } catch (err) {
    log.error("[settings] Failed to save settings", err);
  }
}
