import type { Primitive, StateShape } from './types.js';

/**
 * Decode a URL search string (with or without leading "?") into typed state.
 *
 * Uses `defaults` as the type signal AND the fallback for missing/invalid values.
 * - Arrays in defaults: value is split on comma (empty string → empty array).
 * - Numbers: falls back to default if not finite.
 * - Booleans: "true" → true, anything else → false.
 *
 * This matches the STROps decodeState variant.
 */
export function decodeState<T extends StateShape>(query: string, defaults: T): T {
  const cleaned = query.startsWith('?') ? query.slice(1) : query;
  const params = new URLSearchParams(cleaned);
  const out: StateShape = { ...defaults };

  for (const k of Object.keys(defaults)) {
    const raw = params.get(k);
    if (raw === null) continue;
    const def = (defaults as StateShape)[k];
    if (Array.isArray(def)) {
      out[k] = raw === '' ? [] : raw.split(',');
    } else if (typeof def === 'number') {
      const n = Number(raw);
      out[k] = Number.isFinite(n) ? n : def;
    } else if (typeof def === 'boolean') {
      out[k] = raw === 'true' || raw === '1';
    } else {
      out[k] = raw;
    }
  }

  return out as T;
}

/**
 * Type for a value that can appear in a defaults map that includes arrays.
 * Used for the generic constraint of decodeState.
 */
export type DefaultsMap = Record<string, Primitive | Primitive[]>;
