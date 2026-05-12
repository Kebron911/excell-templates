import type { Primitive } from './types.js';

/**
 * Type for a value that can appear in a defaults map.
 * Used as the generic constraint for parse().
 */
export type DefaultsMap = Record<string, Primitive>;

/**
 * Parse a URL search string (or URLSearchParams instance) into typed state,
 * using `defaults` as both the type signal and the fallback for missing/invalid
 * values.
 *
 * Accepts strings with or without a leading "?", or a URLSearchParams instance.
 *
 * This is the canonical decode format used by STRGuests, STRBuyers, STRHost,
 * and STROps.
 */
export function parse<T extends Record<string, Primitive>>(search: string | URLSearchParams, defaults: T): T {
  const params = search instanceof URLSearchParams
    ? search
    : new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const out: Record<string, Primitive> = { ...defaults };
  for (const key of Object.keys(defaults) as Array<keyof T & string>) {
    const raw = params.get(key);
    if (raw == null) continue;
    const def = defaults[key];
    if (typeof def === 'number') {
      const n = Number(raw);
      out[key] = Number.isFinite(n) ? n : def;
    } else if (typeof def === 'boolean') {
      // Accept "1", "true" (and their inverses "0", "false")
      out[key] = raw === '1' || raw === 'true';
    } else {
      out[key] = raw;
    }
  }
  return out as T;
}
