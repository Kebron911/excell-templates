# Tier 2 #10 — GA4 + GSC Verification Audit

**Date:** 2026-05-12
**Scope:** All 6 cluster sites (live + pre-launch).
**Status:** Document-only audit (requires Google account access to fully verify).

---

## Why this matters

Move 1–3 from `docs/seo/CLUSTER-SEO-ROLLUP-2026-05-10.md` are infrastructure;
Tier 2 #7 is content; **Tier 2 #10 is measurement**. Without verified GA4 +
GSC properties, the cluster cannot:

- Attribute organic traffic by source (cross-domain analytics)
- See indexed-vs-submitted URL ratios (catches sitemap regressions)
- Track CTR and impressions per query (the leading indicator of ranking)
- Catch manual actions or coverage drops within 24h instead of 30 days
- Submit URLs via the IndexNow / GSC URL Inspection API after content ships

The audits in `docs/seo/SEO-AUDIT-*.md` all assume measurement is wired.
None of them verified that assumption. This doc closes the gap.

---

## Site-by-site verification matrix

For each site, four things must be true:

1. **GSC property exists** — at minimum, the **Domain property** (DNS-verified)
   for the apex domain. Domain property automatically covers `www.`, `https://`,
   and every subdomain — strictly better than URL-prefix properties.
2. **`PUBLIC_GA4_ID` set in the deployed build env** — confirmed by viewing
   `<script>` tags in production HTML for the `G-` measurement ID.
3. **GA4 property created + cross-domain measurement configured** — domains
   list includes all 6 cluster hostnames.
4. **Sitemap submitted to GSC** — `Sitemaps` section shows the property's
   sitemap-index URL with status "Success" and ≥1 discovered URL.

### Matrix (operator to verify + complete)

| Site | GSC Domain property | GA4 ID set in prod | Cross-domain | Sitemap submitted |
|---|---|---|---|---|
| thestrledger.com | [ ] verify | [ ] set `STRLEDGER_GA4_ID` repo secret | [ ] add to cluster | [ ] submit `/sitemap-index.xml` |
| strhost.tools | [ ] verify | [ ] set `STRHOST_GA4_ID` repo secret | [ ] confirm in linker | [ ] verify in GSC |
| strguests.tools | [ ] verify | [ ] set `STRGUESTS_GA4_ID` repo secret | [ ] confirm | [ ] verify |
| strops.tools | [ ] verify | [ ] set `STROPS_GA4_ID` repo secret | [ ] confirm | [ ] verify |
| strbuyers.tools | [ ] verify | [ ] set `STRBUYERS_GA4_ID` repo secret | [ ] confirm | [ ] verify |
| strmanuals.com | [ ] verify (pre-launch acceptable) | [ ] pending site launch | [ ] pending launch | [ ] pending launch |

Tick each box once you've confirmed in GSC + GA4. Commit the checked
boxes back so future-Daniel can see what's wired.

---

## Step-by-step verification

### Step 1 — GSC Domain property per site

For each domain (do thestrledger.com first; others follow same flow):

1. Sign in to `https://search.google.com/search-console`.
2. **Add property** → choose **Domain** (NOT URL prefix).
3. Enter the apex domain (e.g., `thestrledger.com`).
4. Verify via **DNS TXT record**. The verification flow gives you a
   TXT record like `google-site-verification=abc123...`. Add it to
   the Hostinger DNS panel for the domain (Hostinger → Domains → DNS
   Zone → Add Record → TXT). Wait 5–15 min for propagation. Click
   **Verify** in GSC.
5. Once verified, the property covers `https://`, `www.`, the apex, and
   every future subdomain (e.g., `blog.thestrledger.com`,
   `preview.thestrledger.com`).

Save the TXT records in `ops/credentials-inventory.md` under each
domain.

### Step 2 — Create GA4 properties

The cluster uses **one GA4 property per domain** with cross-domain
measurement so attribution flows between sites. Per the existing
`Layout.astro` patterns in each site, the integration expects an
environment variable like `PUBLIC_GA4_ID=G-XXXXXXXXXX`.

For thestrledger.com:

1. Sign in to `https://analytics.google.com`.
2. **Admin → Create → Property**: name "thestrledger.com", time zone
   matching ops, reporting currency USD.
3. **Property → Data Streams → Web**:
   - URL: `https://thestrledger.com`
   - Stream name: thestrledger-web
4. Copy the **Measurement ID** (starts with `G-`).
5. **Configure → Tag Settings → Configure your domains**:
   - Add: `strhost.tools`, `strguests.tools`, `strops.tools`,
     `strbuyers.tools`, `strmanuals.com`. (Cross-domain measurement —
     the cluster linker tracks a session as it hops between sites.)
6. Add the Measurement ID to the GitHub repo secret
   `STRLEDGER_GA4_ID`. The CI workflow at
   `.github/workflows/deploy-strledger.yml` passes it through to
   `PUBLIC_GA4_ID` at build time.
7. Repeat for each sister site with its own Measurement ID and the
   same configured domains list.

### Step 3 — Submit sitemap to each GSC property

Each site already emits a sitemap-index. Submit it to GSC so Google
prioritizes the URLs:

| Site | Sitemap URL |
|---|---|
| thestrledger.com | `https://thestrledger.com/sitemap-index.xml` |
| strhost.tools | `https://strhost.tools/sitemap-index.xml` |
| strguests.tools | `https://strguests.tools/sitemap-index.xml` |
| strops.tools | `https://strops.tools/sitemap-index.xml` |
| strbuyers.tools | `https://strbuyers.tools/sitemap-index.xml` |
| strmanuals.com | `https://strmanuals.com/sitemap-index.xml` (post-launch) |

In each GSC property → **Sitemaps** → paste the URL → **Submit**.
Confirm status flips to "Success" within an hour and the discovered-URL
count matches `dist/sitemap-0.xml`'s entry count locally.

### Step 4 — IndexNow optional acceleration

GSC discovers URLs on its own crawl schedule (~weeks). For faster
indexing after content drops (e.g., new state pages just pushed),
ping IndexNow.

The cluster already has a partial wiring in
`infrastructure/n8n/` (the W43 IndexNow workflow). Confirm it points
at the right key + each site's domain in its config.

---

## Cross-domain attribution test (run weekly during launch)

Once GA4 + cross-domain linker are wired, this is the smoke test:

1. Open a private browser window.
2. Visit `https://strbuyers.tools/dscr-loan-calculator/`.
3. Click any internal link to `thestrledger.com` (the cluster funnel
   block at the bottom).
4. In GA4 → **Reports → Realtime**, confirm the session shows up under
   the thestrledger.com property's data stream with the strbuyers
   referrer attribution preserved.

If the session shows as `(direct)` instead of `strbuyers.tools`
referrer — the cross-domain linker is missing the destination domain.
Re-check Step 2 Configure-your-domains list.

---

## What to monitor (weekly cadence)

Once verified, set up a weekly 15-minute review per the
[seo-measurement](references/sub-skills/seo-measurement/playbook.md)
playbook in the cluster SEO suite:

### GSC (per property, every Monday)
- **Coverage** report: any "Discovered – not indexed" or "Crawled –
  not indexed" pages on the rise?
- **Performance** report: top 10 queries — CTR, impressions, position.
  Note movers (top 10 by ΔImpressions wk-over-wk).
- **Sitemaps**: discovered count matches submitted count.
- **Manual actions**: should be empty. If not, investigate immediately.

### GA4 (per property, every Monday)
- **Acquisition → Traffic acquisition**: Organic Search share of
  total. Compare to previous week.
- **Engagement → Pages and screens**: top 20 pages by sessions.
- **Realtime**: confirm tracking is actually firing right now.

### Cross-cluster (every Monday)
- Aggregate organic-search sessions across the 6 sites.
- Funnel: which sister-site users end up on thestrledger.com (the
  monetization target).
- Top-10 organic search queries by cluster (which content is winning).

---

## Open items requiring operator access

These can't be done in code — they need browser + Google account:

- [ ] Create + verify GSC Domain property for thestrledger.com
- [ ] Create + verify GSC Domain property for strhost.tools
- [ ] Create + verify GSC Domain property for strguests.tools
- [ ] Create + verify GSC Domain property for strops.tools
- [ ] Create + verify GSC Domain property for strbuyers.tools
- [ ] Create + verify GSC Domain property for strmanuals.com (post-launch)
- [ ] Create GA4 property for each site (6 total)
- [ ] Configure cross-domain measurement on each property
- [ ] Set repo secrets `<SITE>_GA4_ID` for each site
- [ ] Submit sitemap-index to GSC for each property
- [ ] Wire IndexNow N8N workflow with each site's domain key
- [ ] Run the cross-domain attribution smoke test
- [ ] Document the GSC verification TXT records in
      `ops/credentials-inventory.md`

---

## What's already in code (so the audit isn't from zero)

- Every site's `Layout.astro` reads `PUBLIC_GA4_ID` at build time and
  emits the GA4 snippet when set. Confirmed in:
  - STRBuyers-Tools/src/components/chrome/Layout.astro:60-74
  - STROps-Tools/src/layouts/Layout.astro:50 (`const ga4Id = ...`)
  - Other sister sites follow the same pattern.
- The CI workflows pass `secrets.<SITE>_GA4_ID` through to the build env
  variable `PUBLIC_GA4_ID`. Confirmed in:
  - `.github/workflows/deploy-strbuyers-tools.yml:63`
  - `.github/workflows/deploy-strledger.yml:51-52`
- Each site emits `<link rel="sitemap" href="/sitemap-index.xml">` in
  its Layout head.
- Each site's `robots.txt` includes `Sitemap: https://<domain>/sitemap-index.xml`.

The plumbing is already there. The remaining work is creating the
Google-side properties and setting the per-site secrets.

---

## Recommended verification cadence after initial setup

| Cadence | What to check |
|---|---|
| Daily (first 30 days post-launch) | GSC Coverage, GA4 Realtime |
| Weekly (ongoing) | Per-property reports per the playbook above |
| Monthly | Cross-cluster funnel + top-query trends |
| Quarterly | Full re-audit using `docs/seo/SEO-AUDIT-*.md` as the baseline |

---

*This audit completes Tier 2 #10 of CLUSTER-SEO-ROLLUP-2026-05-10.md.
The plumbing is in code; the remaining work is operator-side. Tick
the checkboxes in this file as each item is completed so the next
session sees current state.*
