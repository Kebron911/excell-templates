# The STR Ledger

> *Run your rentals before they run you.*

Business-grade Excel financial and operational systems for short-term rental (Airbnb/VRBO) hosts, plus a four-site **free-tools cluster** that funnels into the storefront. Anchored on a tax-and-financial beachhead, distributed through a multi-storefront network (Etsy, Gumroad, own site), compounded by email, affiliates, and community. Designed to run 95% automated end to end.

## Start here

➡️ **[`LAUNCH.md`](LAUNCH.md)** — the single ordered path forward (cluster status, Daniel sequence, implementation map).

## Current status (2026-05-09)

| Surface | Status |
|---|---|
| **strhost.tools** | ✅ LIVE |
| **strguests.tools** | ✅ LIVE — `strguests-tools-v0.1.0` |
| **strops.tools** | ✅ LIVE — `v0.1.0-strops` |
| **strbuyers.tools** | ✅ LIVE — `strbuyers-tools-v0.1.0` |
| **thestrledger.com storefront** | ⚠️ Blocked on Daniel account openings — see [`LAUNCH.md`](LAUNCH.md) |
| Catalog: 65 SKUs (xlsx + builds + thumbnails + bundles) | ✅ Production-ready |

## Repository layout

```
LAUNCH.md                  ← single ordered path forward (read this first)
PROGRESS.md                ← master tracker (P0–P9, gates, daily standup)
README.md                  ← you are here
brand/                     ← locked brand identity + assets
copy/                      ← user-facing drafts (Etsy, email, blog, Pinterest, FB)
docs/
  runbooks/                ← ops procedures (disaster recovery, weekly content engine)
  superpowers/{specs,plans}/  ← strategy + execution history
infrastructure/
  airtable/schema.md       ← Airtable base schema (279 lines, ready)
  n8n/workflows/           ← 30 ready-to-import n8n workflow .json + .md
  stripe/setup.md          ← Stripe Tax + Connect runbook (305 lines, ready)
ops/
  DANIEL-FIRST-PAYMENT-CHECKLIST.md  ← detailed Daniel sequence (287 lines)
  automation-queue.md                ← detailed Claude queue (Phases A–I)
  credentials-inventory.md
  user-manual-todo.md
templates/
  _build/                  ← 65 Python build scripts (1:1 with SKUs)
  _masters/                ← 130 master xlsx (BLANK + DEMO per SKU)
  _delivery/               ← published artifacts (how-to, license, thumbnails, bundles)
STR{Buyers,Guests,Host,Ops}-Tools/    ← 4 free-tool cluster sites (each with its own .planning/)
```

## Operating model

- **Brand:** locked — The STR Ledger / thestrledger.com
- **Niche:** Short-Term Rental hosts
- **Beachhead:** STR tax & financial templates
- **Primary persona:** Semi-Pro Sarah (3–10 properties)
- **Hub:** Influencersoft + Stripe Tax + Ghost blog at `blog.thestrledger.com`
- **SSOT:** Airtable → Postgres (Phase 3)
- **Automation:** n8n self-hosted at `n8n.thestrledger.com`, Claude over MCP
- **Cluster:** four free-tool sites (Buyers/Host/Ops/Guests covering the full host lifecycle) all share one CI pattern + funnel into thestrledger.com

See [the master strategy](docs/superpowers/specs/2026-04-22-str-tax-platform-design.md), [the locked brand](brand/brand-decisions.md), and [the content atomization engine](docs/superpowers/specs/2026-04-29-content-atomization-engine.md) (one Source Topic → 11 platform artifacts → self-feeding loop).
