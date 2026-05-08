# strops.tools — analytics event taxonomy

All client-side analytics route through `src/lib/analytics.ts` via the typed
`trackEvent(name, params)` helper. GA4 is the only logger; `gtag` is injected
in `src/components/chrome/Layout.astro` only when `PUBLIC_GA4_ID` is set.

When `PUBLIC_GA4_ID` is unset, every `trackEvent` call is a silent no-op (no
errors, no console noise). Cross-domain attribution is handled by GA4's
`linker` config covering the 5-site cluster (strhost.tools, thestrledger.com,
strbuyers.tools, strops.tools, strguests.tools).

## Canonical events

| Event name           | Fires when                                                        | Params                          | Source                                                |
| -------------------- | ----------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------- |
| `email_captured`     | User submits a valid email on `EmailCaptureCard`                  | `{ tool, magnet }`              | `src/components/funnel/EmailCaptureCard.astro`        |
| `pdf_downloaded`     | A PDF download is triggered via `downloadBytes()`                 | `{ filename, tool? }`           | `src/lib/pdf/download.ts`                             |
| `ics_exported`       | An `.ics` calendar export is triggered via `downloadIcs()`        | `{ filename, tool? }`           | `src/lib/calendar/ics.ts`                             |
| `tool_used`          | A calculator island mounts (once per page load, ref-guarded)      | `{ tool }`                      | `src/components/calculators/*.tsx`                    |
| `affiliate_clicked`  | User clicks an outbound `AffiliateCard` link                      | `{ vendor, tool }`              | `src/components/affiliate/AffiliateCard.astro`        |

## Notes

- **`tool_used` once per mount**, not per re-render. Prevents inflated counts
  when URL state changes on every keystroke.
- **`tool` slug** matches keys in `src/data/tools.json` (e.g.
  `turnover-scheduler`, `cleaner-dispatch`, `smart-lock-codes`, `linen-par`,
  `restock-calculator`, `damage-cost-lookup`, `maintenance-schedule`).
- **`magnet` slug** matches the `magnet` field in `src/data/tools.json`
  (`cleaner-sop-pdf`, `supply-par-pdf`, `maintenance-checklist-pdf`).
- **`vendor` key** matches keys in `src/data/affiliates.json`.

## Adding a new event

1. Add the literal to `EventName` in `src/lib/analytics.ts`.
2. Add its param shape to `EventParamMap`.
3. Call `trackEvent(name, params)` from the firing site.
4. Document it in this file (taxonomy is the source of truth, not GA4 UI).
