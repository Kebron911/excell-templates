# ops/cache/

Phase 3 cache layer. **Written by n8n `nightly-refresh` flow** (cron 02:00),
**read by the empire console** at page load.

Every file in here is a snapshot of external API data — Stripe, Etsy, Gumroad,
Influencersoft, GA4, Plausible, Search Console, CrUX. The console NEVER calls
those APIs directly — n8n owns secrets + rate limits + retries.

## Contract

| File | Source(s) | Schema | Refreshed |
|---|---|---|---|
| `money.json` | Stripe + Etsy + Gumroad | revenue/refunds yesterday/week/MTD per channel + per SKU | nightly 02:00 + post-purchase webhooks |
| `traffic.json` | GA4 + Plausible | sessions yesterday/week/MTD by site + top sources | nightly 02:00 |
| `seo.json` | Search Console + CrUX/PSI | impressions/clicks/position/CWV per page | nightly 02:00 |
| `contacts.json` | Influencersoft | total list, new 7d, engaged 30d, cold 90d, bounce/unsub/complaint, sequence perf, top sign-up sources | nightly 02:00 |
| `sync-log.json` | self | per-source last run + status (success/fail/error) | every nightly cycle |

## Schema enforcement

Each reader (`src/lib/data/<entity>.ts`) parses with Zod. If a cache file
is malformed, the page renders an empty/zeroed state — never crashes.

## When the cache doesn't exist

All readers gracefully return zeros / empty arrays. Pages render as
placeholders with a "Phase 3 stub — n8n nightly-refresh not yet active"
notice in the SourceFooter.

## Local-only files

This directory is **gitignored** (each cache file holds privileged data
post-wire). The README is committed; the JSON snapshots are not.

## Drain pattern

n8n writes via:

```bash
# inside the nightly-refresh flow's "Write money cache" node:
echo '<json>' > $EMPIRE_REPO_PATH/ops/cache/money.json
```

Atomic write (write temp + rename) recommended to avoid mid-read corruption.
