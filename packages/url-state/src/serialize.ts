import type { State } from './types.js';

/**
 * Serialize a state object to a URLSearchParams query string.
 *
 * - Keys equal to defaults are omitted (URLs stay short for sharing).
 * - Booleans encoded as "1" / "0".
 * - undefined/null values are skipped.
 *
 * Returns the query string WITHOUT a leading "?".
 * Returns an empty string if nothing is left to encode.
 *
 * This is the canonical encoding format used by STRGuests, STRBuyers, and STRHost.
 */
export function serialize<T extends State>(state: T, defaults?: Partial<T>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value === undefined || value === null) continue;
    if (
      defaults &&
      defaults[key as keyof T] !== undefined &&
      defaults[key as keyof T] === (value as unknown)
    ) {
      continue;
    }
    if (typeof value === 'boolean') {
      params.set(key, value ? '1' : '0');
    } else {
      params.set(key, String(value));
    }
  }
  return params.toString();
}
