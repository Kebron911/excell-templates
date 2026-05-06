# STRManuals — strmanuals.com

## What this is
PDF guide store for short-term rental owners. Single-problem / single-solution manuals, $19–$39 each, sold direct via Stripe. Editorial, plain-English, decision-driving.

## Cluster role
Fifth site in the STR ecosystem cluster.

| Site | Audience | Format | Monetization |
|------|----------|--------|--------------|
| thestrledger.com | All hosts | Editorial + Etsy traffic | Workbooks (Etsy + direct) |
| strhost.tools | Active hosts | Free calculators | Workbook upsell, ads |
| strops.tools | Hosts scaling | Ops templates | Email-list-first, PDF gen |
| strguests.tools | Hosts → guests | AI generators | Affiliate, Pinterest funnel |
| strbuyers.tools | Pre-purchase | Underwriting tools | Affiliate-first |
| **strmanuals.com** | **All hosts** | **Paid PDFs** | **Direct Stripe sales** |

## Launch SKUs (5 manuals)
1. `TAX-01` — The STR Tax Loophole Playbook ($29, ~48 pages)
2. `TAX-02` — Material Participation Survival Kit ($29, ~36 pages)
3. `REV-01` — Why Are My Bookings Down? Diagnostic ($19, ~28 pages)
4. `REV-02` — Direct Bookings Starter ($25, ~32 pages)
5. `LGL-01` — STR Permit & Regulation Survival Guide ($25, ~30 pages)
6. `BUNDLE-01` — All Five ($99, save $46)

## Tech
Hostinger Business · Node.js + Astro (hybrid output) · Stripe Checkout · **InfluencerSoft** (cluster-wide email + sequences, orchestrated through n8n). PDFs live on the Hostinger filesystem under `/private/manuals/` and are served by `/api/download` with HMAC-signed tokens (24h expiry) and per-buyer `pdf-lib` watermarking at stream time. **No Cloudflare/AWS, no Postmark/ConvertKit** — one platform, one email vendor, matches the cluster.

## Email integration (InfluencerSoft via n8n)

The cluster uses **tag-based segmentation** with a single contact pool. This site posts to existing n8n webhooks; n8n handles all IS API calls.

**Flows:**
- Stripe webhook → `/api/stripe-webhook` (Hostinger Node) → n8n → tags contact `product:<sku>`, `source:strmanuals`, `acquired:<date>` → triggers IS order-confirmation sequence with `{download_url, order_id, manual_title}` merge vars
- `/api/subscribe` (free PDF) → n8n → tags `magnet:str-tax-loophole-explainer`, `source:strmanuals` → triggers free-magnet sequence

**New tags this site adds to the cluster tag dictionary** (`infrastructure/influencersoft/tag-dictionary.md`):
- `product:str-tax-loophole-playbook` (TAX-01)
- `product:material-participation-survival-kit` (TAX-02)
- `product:why-bookings-down` (REV-01)
- `product:direct-bookings-starter` (REV-02)
- `product:permit-regulation-survival` (LGL-01)
- `product:str-manuals-bundle` (BUNDLE-01)
- `magnet:str-tax-loophole-explainer`
- `source:strmanuals`

**Sequences to author** (in `infrastructure/influencersoft/sequences/` per cluster pattern):
- `strmanuals-order-confirmation` — receipt + download link + companion-asset CTA
- `strmanuals-free-magnet` — Day 0 PDF + biweekly cadence + soft TAX-01 pitch on Day 7

## Memory
See MEMORY.md (created when first user-triggered note arrives).

## Project files
- `charter.md` — full project charter
- `design-spec.md` — 18-section design specification
