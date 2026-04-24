/**
 * Runtime type guards for JSON payloads coming from external sources
 * (LCU API, CommunityDragon, on-disk caches/settings).
 *
 * Treat every JSON.parse / res.json() result as `unknown` and narrow it
 * through these guards before accessing fields. This prevents a malformed
 * or hostile payload from propagating `any`-shaped values into the app.
 */

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isNonNegativeInt(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER
  );
}

export function isBoundedString(
  value: unknown,
  maxLength = 4096
): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Extract a field from an unknown object without asserting its type. The
 * caller is responsible for validating the returned value.
 */
export function getField(value: unknown, key: string): unknown {
  if (!isPlainObject(value)) return undefined;
  return value[key];
}

/**
 * Parse JSON and return `null` when the result is not a plain object.
 * Useful for local cache/settings files: a corrupted file falls back to
 * defaults instead of throwing.
 */
export function safeParseObject(
  raw: string
): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
