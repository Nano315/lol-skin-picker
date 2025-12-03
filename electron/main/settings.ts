import { app } from "electron";
import { join } from "node:path";
import { promises as fs } from "node:fs";

type Settings = { displayId?: number; openAtLogin?: boolean };
const settingsPath = join(app.getPath("userData"), "settings.json");

export async function loadSettings(): Promise<Settings> {
  try {
    return JSON.parse(await fs.readFile(settingsPath, "utf-8")) as Settings;
  } catch {
    return {};
  }
}

export async function saveSettings(s: Settings) {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(s, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
}
