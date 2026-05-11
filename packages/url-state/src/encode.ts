import type { StateShape } from './types.js';

/**
 * Encode a state object to a URLSearchParams query string (no defaults filtering).
 *
 * - Arrays are joined as comma-separated values.
 * - Booleans encoded as their string representation ("true"/"false").
 * - Returns the query string WITHOUT a leading "?".
 *
 * This is the encoding format used by the STROps variant and the extended API.
 */
export function encodeState(state: StateShape): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      params.set(k, v.join(','));
    } else {
      params.set(k, String(v));
    }
  }
  return params.toString();
}
