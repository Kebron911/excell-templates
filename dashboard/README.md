# Dashboard — Empire Console

> **One-stop pointer for everything dashboard-related.** Code, data feeds, deploy, design spec — all linked from here. Nothing moved (would break n8n flows + CI deploy); this is the map.
>
> **Production URL (once Hostinger Wave-0 setup complete):** https://dashboard.thestrledger.com
>
> **Last reviewed:** 2026-05-12

---

## What this folder is

A navigation hub. The dashboard's actual code stays in `tools/empire-console/` (Astro build, deploy workflow expects it there). The dashboard's operational data feeds stay in `ops/` (n8n flows write to them at their current paths). This folder gives you ONE place to reach the structure without digging.

---

## Code & build

- **Source:** [`tools/empire-console/`](../tools/empire-console/) — Astro 4 + Tailwind. Routes split as `Today / Check / Promote / Maintain`.
- **Run locally:** `cd tools/empire-console && pnpm install && pnpm dev` → http://localhost:4327
- **CLI:** `cd tools/empire-console && pnpm cli status` (exits non-zero on red)
- **Build:** `pnpm build` → outputs `tools/empire-console/dist/` (static, deployed via rsync)
- **README:** [`tools/empire-console/README.md`](../tools/empire-console/README.md)
- **Design spec:** [`docs/superpowers/specs/2026-05-10-empire-console-design.md`](../docs/superpowers/specs/2026-05-10-empire-console-design.md)
- **Tests:** `tools/empire-console/tests/`

---

## Data feeds (read by the dashboard at build/runtime)

These stay in `ops/` because n8n writes to them. Don't move them.

| Path | Role | Writer |
|---|---|---|
| `ops/alerts.ndjson` | Alert feed (Today landing) | n8n flows on error |
| `ops/cache/money.json` | Money pulse (revenue, refunds, burn) | n8n `nightly-refresh` |
| `ops/cache/traffic.json` | Traffic snapshot per site | n8n `nightly-refresh` → Plausible Stats API |
| `ops/cache/etsy.json` | Etsy listings + recent orders | n8n `nightly-refresh` → Etsy API |
| `ops/cache/is.json` | InfluencerSoft contact + tag snapshot | n8n `nightly-refresh` → IS API |
| `ops/console-actions.ndjson` | Audit log of dashboard button clicks | Dashboard → n8n webhook → file |
| `ops/decisions.ndjson` | Decision log | Manual via /maintain |
| `ops/inbox.ndjson` | Captured items via `/empire-capture` webhook | n8n `capture-receiver` |
| `ops/near-misses.ndjson` | Bug/issue near-misses | Manual |
| `ops/customer-voice.ndjson` | Customer-quote source for OG cards | Manual + n8n harvest |
| `ops/customer-embeds.ndjson` | Customer embeds for testimonials | Same |
| `ops/social-answers.ndjson` | Public answer log (forum/social replies) | Manual + n8n harvest |
| `ops/time-log.ndjson` | Time tracking | Manual |
| `ops/atlas.yaml` + `ops/atlas/` | Site atlas (pages, owners, deps) | Manual + drift detector |
| `ops/infrastructure.yaml` | Domains/certs/DNS | Manual; consumed by `cert-watch` |
| `ops/citations.yaml` | Backlink/citation tracker | Manual + n8n |
| `ops/competitors.yaml` | Competitor inventory | Manual |
| `ops/risks.yaml` | Risk register | Manual |
| `ops/roadmap.yaml` | Roadmap (phases + gates) | Manual |
| `ops/targets.yaml` | KPI targets | Manual |
| `ops/calendar.yaml` | Content calendar | Manual + n8n |
| `ops/network.yaml` | Network (partners, affiliates) | Manual |
| `ops/vendor-inventory.yaml` | SaaS vendor inventory + burn | Manual |
| `ops/owner-compensation.yaml` | Owner pay tracker | Manual |
| `ops/setup-checklist.yaml` | Phase 5 activation checklist | Manual; read by `/maintain/setup` |
| `ops/ai-visibility-log.md` | AI-search visibility log | Manual |
| `ops/automation-queue.md` | Claude automation queue (Phases A–I) | Manual |
| `ops/credentials-inventory.md` | Credentials map (no secrets) | Manual |

---

## Deploy

- **Trigger:** push to `main` branch with changes under `tools/empire-console/**`
- **Workflow:** `.github/workflows/deploy-empire-console.yml` (GitHub Actions)
- **Auth:** `STR_SSH_KEY` repo secret (✅ set, shared with sister-site deploys)
- **Build-time inline:** `PUBLIC_N8N_WEBHOOK_BASE` repo secret (set during [hostinger-manual-setup-guide.md](../ops/manual%20work/hostinger-manual-setup-guide.md) Part 5)
- **Target:** Hostinger doc root `~/domains/thestrledger.com/public_html/dashboard/`
- **Basic auth gate:** `~/domains/thestrledger.com/.htpasswd-dashboard` (see [hostinger guide](../ops/manual%20work/hostinger-manual-setup-guide.md) Part 3)
- **TLS:** Hostinger AutoSSL (Let's Encrypt)

---

## n8n flows that feed the dashboard

All at [`infrastructure/n8n/flows/`](../infrastructure/n8n/flows/) (source) and `ops/n8n-workflows/` (exports). Setup via [n8n-manual-setup-guide.md](../ops/manual%20work/n8n-manual-setup-guide.md).

Core orchestrator:
- **`nightly-refresh`** — runs 03:00 UTC, populates `ops/cache/*.json`

Watchers (write to `ops/alerts.ndjson` on red):
- `cert-watch` · `domain-watch` · `vendor-renewal-watch` · `runbook-staleness`
- `revenue-watch` · `refund-spike-watch` · `traffic-anomaly-watch`
- `indexing-watch` · `cwv-watch` · `funnel-dropout-watch` · `cache-staleness-watch`
- `sitemap-freshness` · `broken-link-watch`
- `cluster-smoke-fs` · `n8n-self-watch`

Webhook flows (powered by dashboard buttons):
- `capture-receiver` — `/empire-capture` POST handler
- `release-shipped` — `/release-shipped` POST (Ship update button)
- `delist-sku` — `/delist-sku` POST (Delist button on `/check/kill-sku`)
- `gdpr-intake` — `/gdpr-intake` POST (Data rights form)
- `backup-restore-test` — Maintain → Backups

---

## Setup the dashboard from scratch

If onboarding fresh, the ordered path:

1. **Hostinger Wave-0** — subdomain + .htpasswd + GitHub Actions `PUBLIC_N8N_WEBHOOK_BASE` secret → [hostinger-manual-setup-guide.md](../ops/manual%20work/hostinger-manual-setup-guide.md)
2. **Telegram + n8n Wave-2** — bot + channels + flow imports → [telegram](../ops/manual%20work/telegram-manual-setup-guide.md) + [n8n](../ops/manual%20work/n8n-manual-setup-guide.md) guides
3. **Open empire-console PR** → CI runs validate + tests + build → merge to main → deploy workflow rsyncs `dist/` to Hostinger
4. **Smoke-test** https://dashboard.thestrledger.com — basic auth prompt → console loads with cache freshness badges

---

## Don't put dashboard files here

This folder is a pointer. To add new dashboard features:

- **Code:** add under `tools/empire-console/src/`
- **New data feed:** put yaml/ndjson at `ops/<name>.{yaml,ndjson}` and update the table above
- **New runbook the dashboard reads:** drop at `ops/runbooks/` or `docs/runbooks/` with the standard frontmatter (`title / owner / last_reviewed / cadence`)
- **New manual setup step:** add to `ops/manual work/<tool>-manual-setup-guide.md` and link from the [INDEX](../ops/manual%20work/manual-setup-INDEX.md)

The goal of this folder is **one click to find anything dashboard-related**. Not a duplicate of the code.
