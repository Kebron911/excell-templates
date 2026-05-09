// Single source of truth for client-side GA4 analytics.
//
// All tracking callsites import `track()` from here. The helper is a no-op
// unless `PUBLIC_GA4_ID` is defined at build time AND `window.gtag` exists at
// runtime — so the build is green without the env var, and stray calls during
// SSR or when the gtag script failed to load do nothing.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** True when GA4 is configured for this build. Compiled away at build time. */
export const GA4_ENABLED: boolean = !!import.meta.env.PUBLIC_GA4_ID;

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/**
 * Fire a GA4 custom event. No-op on the server, no-op when GA4 is unconfigured,
 * and no-op when the gtag script never loaded (e.g. ad-block).
 *
 * `tool_calc_run` should fire at most once per tool per session — pass a stable
 * `tool` param and use `markCalcRunOnce(tool)` to gate it.
 */
export function track(eventName: string, params: AnalyticsParams = {}): void {
  if (!GA4_ENABLED) return;
  if (typeof window === 'undefined') return;
  // Push to dataLayer directly — works even if gtag wrapper hasn't been
  // assigned yet (the inline bootstrap in Layout.astro creates it
  // synchronously, but defensive code is cheap).
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
    return;
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(['event', eventName, params]);
  }
}

const calcRunSession = new Set<string>();

/**
 * Returns true the first time it sees a given tool name in this session,
 * false thereafter. Use to fire `tool_calc_run` exactly once per tool.
 */
export function markCalcRunOnce(tool: string): boolean {
  if (calcRunSession.has(tool)) return false;
  calcRunSession.add(tool);
  return true;
}
