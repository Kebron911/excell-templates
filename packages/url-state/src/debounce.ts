import { serialize } from './serialize.js';
import type { State } from './types.js';

/**
 * Returns a debounced function that updates `window.location.search` via
 * `history.replaceState`. Calls within the debounce window collapse into one
 * update with the latest state.
 *
 * SSR-safe: the returned function is a no-op when `window` or `history` is
 * undefined (e.g. during server-side rendering or in Node.js tests).
 */
export function createDebouncedReplaceState(delayMs = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: State | null = null;

  return function replace(state: State, defaults?: State): void {
    pending = state;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      if (typeof window === 'undefined' || typeof history === 'undefined') return;
      if (pending === null) return;
      const qs = serialize(pending, defaults as Partial<State>);
      const path = window.location?.pathname ?? '/';
      const next = qs ? `${path}?${qs}` : path;
      history.replaceState(null, '', next);
      pending = null;
      timer = null;
    }, delayMs);
  };
}

/**
 * Lower-level debounce helper (from STROps variant).
 * Wraps any string-replacement function with a debounced call.
 */
export function makeReplacer(replace: (q: string) => void, ms = 200) {
  let t: ReturnType<typeof setTimeout> | null = null;
  let last = '';
  return (q: string): void => {
    last = q;
    if (t) clearTimeout(t);
    t = setTimeout(() => replace(last), ms);
  };
}

/**
 * Browser-ready replacer that pushes to `window.history`.
 * SSR-safe: no-op when `window` is undefined.
 */
export function browserReplacer(ms = 200) {
  return makeReplacer((q) => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.pathname}${q}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, ms);
}
