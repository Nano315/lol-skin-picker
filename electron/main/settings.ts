import { app } from "electron";
import { join, dirname } from "node:path";
import { promises as fs } from "node:fs";
import { logger as log } from "../logger";
import {
  isBoolean,
  isFiniteNumber,
  isPlainObject,
  safeParseObject,
} from "../utils/jsonGuards";

export type CompanionBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Settings = {
  displayId?: number;
  openAtLogin?: boolean;
  telemetryEnabled?: boolean;
  consentModalSeen?: boolean;
  autoAcceptMatch?: boolean;
  wardAutoRollEnabled?: boolean;
  /** Sidecar de draft : ouverture automatique en champ select. */
  companionEnabled?: boolean;
  /** Raccourcis globaux du sidecar (actifs uniquement pendant la champ select). */
  companionHotkeysEnabled?: boolean;
  /** Derniere position/taille du sidecar, pour la restaurer au lancement. */
  companionBounds?: CompanionBounds;
};

/**
 * Resolved lazily, NOT at module load time. In dev, `app.setPath("userData",
 * ...lol-skin-picker-dev)` runs in `electron/main/app.ts` AFTER all imports
 * — capturing the path into a `const` at import time would freeze the
 * production path before the dev override is applied. Calling
 * `app.getPath("userData")` from inside each function reads the current
 * value, including the dev redirection. Same pattern as
 * `electron/main/onboardingState.ts`.
 */
function getSettingsPath(): string {
  return join(app.getPath("userData"), "settings.json");
}

/**
 * Reglages booleens, tous coerces de la meme facon. Une liste plutot que N
 * blocs `if` identiques : ajouter un reglage devient une entree ici, et non
 * trois lignes de ceremonie qu'on peut oublier — les oublier signifiait
 * perdre silencieusement la valeur au rechargement.
 */
const BOOLEAN_KEYS = [
  "openAtLogin",
  "telemetryEnabled",
  "consentModalSeen",
  "autoAcceptMatch",
  "wardAutoRollEnabled",
  "companionEnabled",
  "companionHotkeysEnabled",
] as const satisfies readonly (keyof Settings)[];

function coerceSettings(raw: Record<string, unknown>): Settings {
  const out: Settings = {};
  if (typeof raw.displayId === "number" && Number.isInteger(raw.displayId)) {
    out.displayId = raw.displayId;
  }
  for (const key of BOOLEAN_KEYS) {
    if (isBoolean(raw[key])) out[key] = raw[key];
  }
  const bounds = coerceCompanionBounds(raw.companionBounds);
  if (bounds) out.companionBounds = bounds;
  return out;
}

/**
 * Un `companionBounds` corrompu (edition manuelle, disque a moitie ecrit)
 * produirait une fenetre de taille NaN ou hors ecran, donc invisible et
 * impossible a recuperer sans supprimer settings.json. On rejette en bloc
 * plutot que de coercer champ par champ : mieux vaut retomber sur la position
 * par defaut.
 */
function coerceCompanionBounds(raw: unknown): CompanionBounds | null {
  if (!isPlainObject(raw)) return null;
  const keys = ["x", "y", "width", "height"] as const;
  const out = {} as CompanionBounds;
  for (const key of keys) {
    const value = raw[key];
    if (!isFiniteNumber(value)) return null;
    out[key] = Math.round(value);
  }
  if (out.width <= 0 || out.height <= 0) return null;
  return out;
}

export async function loadSettings(): Promise<Settings> {
  try {
    const data = await fs.readFile(getSettingsPath(), "utf-8");
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
    const target = getSettingsPath();
    // Ensure directory exists
    await fs.mkdir(dirname(target), { recursive: true });
    // Merge with existing settings instead of overwriting
    const existing = await loadSettings();
    const merged = { ...existing, ...s };
    await fs.writeFile(target, JSON.stringify(merged, null, 2), "utf-8");
    log.debug("[settings] Settings saved successfully", merged);
  } catch (err) {
    log.error("[settings] Failed to save settings", err);
  }
}
