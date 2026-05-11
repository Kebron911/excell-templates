import { encodeState } from './encode.js';
import type { StateShape } from './types.js';

/**
 * Append encoded state to a full URL string.
 *
 * - If the URL already has a query string, the state params are appended with "&".
 * - The state is encoded via `encodeState` (no defaults filtering, arrays comma-joined).
 * - Returns the original URL unchanged if the state encodes to an empty string.
 *
 * @example
 * withState('https://example.com/calc', { price: 250000, bedrooms: 3 })
 * // → "https://example.com/calc?price=250000&bedrooms=3"
 *
 * withState('https://example.com/calc?utm=foo', { price: 250000 })
 * // → "https://example.com/calc?utm=foo&price=250000"
 */
export function withState(url: string, state: StateShape): string {
  const qs = encodeState(state);
  if (!qs) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${qs}`;
}
