/**
 * URL-state library — encode/decode tool inputs as URL params.
 *
 * Per design spec: every tool's inputs serialize to URL params. On change,
 * debounce 200ms and call history.replaceState. On page load, parse URL and
 * seed inputs (fall back to per-tool defaults).
 *
 * Defaults are also rendered server-side so first paint is useful pre-JS and
 * indexable. Keeping URLs short matters for sharing — keys whose values match
 * defaults are omitted on serialize.
 *
 * Identical contract to strhost.tools R3.
 */

type Primitive = string | number | boolean;
type State = Record<string, Primitive | null | undefined>;

/**
 * Serialize a state object to a URLSearchParams string.
 * - Keys equal to defaults are omitted (URLs stay short).
 * - Booleans encoded as 1/0.
 * - undefined/null values are skipped.
 *
 * Returns the query string WITHOUT a leading "?". Empty string if nothing to encode.
 */
export function serialize<T extends State>(state: T, defaults?: Partial<T>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value === undefined || value === null) continue;
    if (defaults && defaults[key as keyof T] !== undefined && defaults[key as keyof T] === (value as any)) continue;
    if (typeof value === 'boolean') {
      params.set(key, value ? '1' : '0');
    } else {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

/**
 * Parse a URL search string into typed state, using `defaults` as the type signal
 * AND the fallback for missing/invalid values.
 *
 * Accepts strings with or without leading "?".
 */
export function parse<T extends Record<string, Primitive>>(search: string, defaults: T): T {
  const cleaned = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(cleaned);
  const out: any = { ...defaults };
  for (const key of Object.keys(defaults) as Array<keyof T>) {
    const raw = params.get(String(key));
    if (raw == null) continue;
    const def = defaults[key];
    if (typeof def === 'number') {
      const n = Number(raw);
      out[key] = Number.isFinite(n) ? n : def;
    } else if (typeof def === 'boolean') {
      out[key] = raw === '1' || raw === 'true';
    } else {
      out[key] = raw;
    }
  }
  return out as T;
}

/**
 * Returns a debounced function that updates `window.location.search` via
 * `history.replaceState`. Calls within the debounce window collapse into one
 * update with the latest state.
 *
 * SSR-safe: a no-op when `window` or `history` is undefined.
 */
export function createDebouncedReplaceState(delayMs = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: State | null = null;

  return function replace(state: State, defaults?: State) {
    pending = state;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      if (typeof window === 'undefined' || typeof history === 'undefined') return;
      if (pending === null) return;
      const qs = serialize(pending, defaults as any);
      const path = (window.location?.pathname ?? '/');
      const next = qs ? `${path}?${qs}` : path;
      history.replaceState(null, '', next);
      pending = null;
      timer = null;
    }, delayMs);
  };
}
