/**
 * Analytics — typed GA4 event helper.
 *
 * Single source of truth for every event the strops.tools site fires.
 * All islands and components route through `trackEvent` so the taxonomy is
 * grep-able, type-safe, and easy to swap if we ever migrate off GA4.
 *
 * Behavior:
 *   - SSR-safe (no-op on server).
 *   - Browser-side: calls `window.gtag('event', name, params)` if `gtag`
 *     is present. `gtag` is only injected when `PUBLIC_GA4_ID` is set
 *     (see `src/components/chrome/Layout.astro`). When unset, this is a
 *     silent no-op — no thrown errors, no console spam.
 *   - Cross-domain attribution: handled by GA4's `linker` config in
 *     Layout.astro. This helper just pushes the event; GA4 attaches the
 *     linker-tagged client id automatically.
 *
 * Taxonomy: see `docs/analytics-events.md`.
 */

export type EventName =
  | 'email_captured'
  | 'pdf_downloaded'
  | 'ics_exported'
  | 'tool_used'
  | 'affiliate_clicked';

/** Param shapes per event. Keep flat (GA4 prefers flat custom params). */
export interface EventParamMap {
  email_captured: { tool: string; magnet: string };
  pdf_downloaded: { filename: string; tool?: string };
  ics_exported: { filename: string; tool?: string };
  tool_used: { tool: string };
  affiliate_clicked: { vendor: string; tool: string };
}

type GtagFn = (command: 'event', name: string, params?: Record<string, unknown>) => void;
type GtagWindow = Window & { gtag?: GtagFn };

export function trackEvent<E extends EventName>(name: E, params: EventParamMap[E]): void {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  // Guarded — `gtag` only exists when PUBLIC_GA4_ID is set at build time.
  // No `gtag` => silent no-op, no thrown error, no console noise.
  w.gtag?.('event', name, params as unknown as Record<string, unknown>);
}
