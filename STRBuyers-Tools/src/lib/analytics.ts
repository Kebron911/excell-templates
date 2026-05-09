/**
 * GA4 analytics helpers — SSR-safe, no-ops when PUBLIC_GA4_ID is unset.
 *
 * Layout.astro injects gtag.js + a `gtag('config', …)` call gated on
 * `import.meta.env.PUBLIC_GA4_ID`. These helpers wrap `window.gtag` and
 * silently no-op if it isn't present (env unset, blocker installed,
 * SSR pass, or hydration error).
 *
 * Custom event names mirror the cluster-wide convention so the four-site
 * cluster + The STR Ledger roll up cleanly in GA4 Explorations.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag?: (cmd: string, event: string, params?: Record<string, unknown>) => void;
  }
}

function safeGtag(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const g = (window as any).gtag;
  if (typeof g !== 'function') return;
  try {
    g('event', event, params ?? {});
  } catch {
    /* swallow — analytics never crashes the page */
  }
}

/**
 * `calc_run` — fired the first time a calculator produces output for a given
 * tool in this session. Debounced via session-storage so input thrashing
 * doesn't spam the metric.
 */
export function trackCalculatorRun(args: { tool: string; inputs?: Record<string, unknown> }): void {
  if (typeof window === 'undefined') return;
  const key = `strbuyers:calc_run:${args.tool}`;
  try {
    if (window.sessionStorage?.getItem(key)) return;
    window.sessionStorage?.setItem(key, '1');
  } catch {
    /* ignore — privacy mode may block storage; still fire once per page load */
  }
  safeGtag('calc_run', { tool: args.tool, ...(args.inputs ?? {}) });
}

/**
 * `affiliate_click` — fired alongside the AffiliateBlock /api/click POST
 * so the cluster sees both server-side and client-side conversions.
 */
export function trackAffiliateClick(args: { vendor: string; tool: string; category?: string }): void {
  safeGtag('affiliate_click', args);
}

/**
 * `email_capture` — fired when EmailCaptureCard's submit handler resolves
 * successfully (ESP webhook 2xx or dev-mode fallback).
 */
export function trackEmailCapture(args: { source: string; tool?: string; magnet?: string }): void {
  safeGtag('email_capture', args);
}

/**
 * `city_view` — fired on /cities/{slug} page load.
 */
export function trackCityView(args: { slug: string; state: string }): void {
  safeGtag('city_view', args);
}

/**
 * `cluster_click` — fired when a user clicks across to a sister site
 * (ClusterFunnelBlock or footer link). Cross-domain linker handles
 * client-id propagation; this event marks the entry point.
 */
export function trackClusterClick(args: { destination: string }): void {
  safeGtag('cluster_click', args);
}
