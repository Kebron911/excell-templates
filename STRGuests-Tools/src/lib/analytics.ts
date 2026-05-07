/**
 * Typed GA4 event surface for strguests.tools.
 *
 * Each event is documented in src/.planning/REQUIREMENTS.md R7 and lives here
 * so a future analytics audit can grep one file. The runtime is a no-op when
 * `window.gtag` is absent (i.e. PUBLIC_GA4_ID was not set at build time).
 */

export type Ga4Event =
  | 'pdf_downloaded'
  | 'text_copied'
  | 'pin_generated'
  | 'pin_intent_opened'
  | 'ai_generation_completed'
  | 'ai_rate_limit_hit'
  | 'email_verified'
  | 'email_captured'
  | 'template_scenario_viewed'
  | 'str_ledger_cta_clicked';

export function track(event: Ga4Event, params: Record<string, unknown> = {}): void {
  const w = window as any;
  if (typeof w.gtag === 'function') {
    w.gtag('event', event, params);
  }
}
