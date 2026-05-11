---
title: Phase 0 Citation Sprints — Profile + Directory Backlinks
owner: Daniel
last_reviewed: 2026-05-11
cadence: annual
---

# Phase 0 Citation Sprints

**Goal:** earn 12–25 free dofollow citations + branded-SERP shield in one weekend. Cheapest, highest-leverage backlink work for a new brand. No reputation prerequisite. No outreach.

**Time:** 7 hours total across one weekend.

**Cost:** $0.

**Outcome:** `ops/citations.yaml` flips from 24 `pending` → 18–22 `live`. Empire Console `/promote/citations` lights up. W42 takes over future bio refreshes.

---

## Pre-flight (15 min, Friday night)

- [ ] Open `ops/citations.yaml` and confirm all 24 stub entries are present
- [ ] Open Airtable `Identity` table and confirm these fields are populated (Daniel's source of truth):
  - `bio_short` (≤160 chars)
  - `bio_long` (≤500 chars)
  - `headshot_url` (1000×1000 minimum)
  - `tagline` ("Business-grade Excel financial systems for STR hosts")
  - `product_count` (current SKU count)
- [ ] Take or pick a current headshot — same one everywhere builds entity recognition
- [ ] Have a screen-sized brand logo at hand (1200×630 OG-size + a square 1024×1024 version)
- [ ] Have a list of your verified social/dev profile URLs (LinkedIn, X, GitHub, YouTube, Pinterest, Substack, Medium) — these go into every `sameAs` field

---

## Sprint 0.1 — T1 Universal trust (4 hours Saturday)

These show up first in branded SERP and feed Google's knowledge-panel candidate pool. Do these first.

### Crunchbase (45 min)
- [ ] Go to https://www.crunchbase.com/ → Add Organization
- [ ] Company: **The STR Ledger** | Website: `https://thestrledger.com`
- [ ] Description: paste `bio_long` from Identity
- [ ] Founded: your actual founding date
- [ ] Add yourself as founder
- [ ] Upload square logo + headshot for founder profile
- [ ] Add social links (Twitter/X, LinkedIn, YouTube)
- [ ] **Update `ops/citations.yaml`:** find `platform: Crunchbase` → set `url: <new-url>`, `state: live`, `last_refresh: 2026-05-XX`, `bio_version: 1`

### LinkedIn Company Page (20 min)
- [ ] https://www.linkedin.com/company/setup/new/
- [ ] Logo + cover image + `bio_long` + website + industry "Software Development" + size "1 employee"
- [ ] Pin the announcement post to top
- [ ] Update YAML row

### Trustpilot (15 min)
- [ ] https://business.trustpilot.com/signup
- [ ] Verify domain via DNS TXT or HTML file (Hostinger upload)
- [ ] Customize profile with logo + bio
- [ ] Generate review-invitation link → save to Identity table for W13 to use
- [ ] Update YAML row

### G2 (45 min)
- [ ] https://sell.g2.com/ — sign up as a vendor
- [ ] Category: "Vertical Industry Software" → "Real Estate" → "Property Management"
- [ ] Add product: "The STR Ledger Tax Template Bundle" with description + screenshots + pricing
- [ ] Set up listing for the Tax Season Bundle as the primary product
- [ ] Update YAML row

### Capterra / GetApp / Software Advice (60 min total)
These are all owned by Gartner Digital Markets — one application covers the trio.
- [ ] https://www.capterra.com/vendors/ — apply once
- [ ] After approval (1–3 business days), profile auto-appears on all three
- [ ] Set Capterra YAML state to `pending` with note "awaiting approval" until profile is live, then update all three rows

### Product Hunt (Maker profile, 15 min)
- [ ] https://www.producthunt.com/ → create account
- [ ] Set Maker bio + headshot + sameAs links + tagline
- [ ] Don't launch any product yet — that's a separate planned event
- [ ] Update YAML row

### Indie Hackers (10 min)
- [ ] https://www.indiehackers.com/ → sign up
- [ ] Profile bio + product card for The STR Ledger
- [ ] Update YAML row

### AngelList / Wellfound (15 min)
- [ ] https://wellfound.com/ → claim founder profile
- [ ] Create company profile, list as bootstrapped
- [ ] Update YAML row

### About.me (10 min)
- [ ] https://about.me/ → claim Daniel-Harrison handle
- [ ] One-page bio + headshot + links + tagline
- [ ] Update YAML row

**End of Saturday:** 9 citations live, T1 tier filled.

---

## Sprint 0.2 — STR-niche directories (2 hours Sunday morning)

These have lower DR but higher topical relevance — and many carry actual traffic.

### HostTools.io directory (20 min)
- [ ] https://hosttools.io/tools/submit — submit listing
- [ ] Category: Spreadsheets / Bookkeeping / Tax
- [ ] Update YAML row

### Hospitable resources / OwnerRez integrations (30 min each)
- [ ] Find the public "tools we love" or "resources" page on each PMS
- [ ] Email/form submit a recommendation request via their generic contact
- [ ] If they have a partner portal: apply
- [ ] Update YAML rows to `state: pending` with note `awaiting moderation` — flip to `live` when accepted

### BNB Wizards / SmartBnB resources (20 min)
- [ ] Same play: find resources page, submit
- [ ] Update YAML

### Awesome Airbnb / STR GitHub list (20 min)
- [ ] Find an active list — search `github.com/topics/airbnb` for `awesome-*` repos
- [ ] Open PR adding one-line entry: `- [The STR Ledger](https://thestrledger.com) — Business-grade Excel templates for STR hosts (tax, P&L, bookkeeping)`
- [ ] Update YAML to `pending` until merged

### Vertex42 / Spreadsheet123 user submissions (30 min)
- [ ] Vertex42: https://www.vertex42.com/ExcelTemplates/ — submit free lead-magnet version of one template
- [ ] Spreadsheet123: same submission process
- [ ] Update YAML to `pending`

**End of Sunday morning:** 5–8 more citations submitted (some pending moderation).

---

## Sprint 0.3 — Founder-brand cross-posts (1 hour Sunday afternoon)

These compound over time as you publish — set them up now, fuel them later.

### Substack publication (20 min)
- [ ] https://substack.com/ → create publication "The STR Ledger" at your-handle.substack.com
- [ ] Add `<link rel="canonical">` template pointing back to `https://blog.thestrledger.com/<slug>`
- [ ] Don't publish anything yet — wait for W16 to push cross-posts later
- [ ] Update YAML row

### Medium publication (20 min)
- [ ] https://medium.com/ → create publication
- [ ] Same canonical-back rule
- [ ] Update YAML row

### Reddit user profile bio + verified domain (10 min)
- [ ] Edit Reddit profile bio → add `thestrledger.com` link
- [ ] Update YAML row

### YouTube channel banner + about (10 min)
- [ ] YouTube Studio → Customization → Branding → upload banner
- [ ] About tab → add description (paste `bio_long`) + website link + social links
- [ ] Update YAML row

### Pinterest profile (verify already-claimed domain, 5 min)
- [ ] Pinterest Settings → Claimed accounts → confirm `thestrledger.com` shows verified
- [ ] If not: paste HTML tag in Hostinger site `<head>` once
- [ ] Update YAML row

**End of Sunday:** 13–15 citations live. Empire Console `/promote/citations` shows 13+/24 live.

---

## Verify

- [ ] Open `/promote/citations` in Empire Console
- [ ] Confirm Live count = ~13+
- [ ] T1 tier should be filled (~9 live)
- [ ] T3 tier should be filled (~5 live)
- [ ] T2 tier should have 2–4 pending and 2–4 live
- [ ] Branded SERP check: Google `"The STR Ledger"` — Crunchbase, LinkedIn, Trustpilot should appear in top 10 within 2–4 weeks

---

## What to do with the rest

| Citation | When to revisit |
|----------|----------------|
| BetaList | When you launch a public product event (later — defer) |
| Pending T2 directories (Hospitable, OwnerRez, etc.) | Check weekly until accepted; ping their team if no response after 14 days |
| Capterra/GetApp/Software Advice | Watch email for approval; usually 1–3 business days |
| Vertex42 / Spreadsheet123 | Watch email for acceptance of submitted template |

W42 (citation refresher) will keep these in sync going forward — when Daniel updates Identity bio, n8n re-pushes to platforms with APIs (LinkedIn, YouTube, Pinterest, Substack) and Slack-cards the rest for manual refresh.

---

## Anti-patterns

- ❌ Stuffing keywords in profile bios — write naturally, the brand recall matters more than keyword density
- ❌ Using different bios on different platforms — entity consistency is the whole point; use the locked Identity table version
- ❌ Hitting 25 mediocre directories — quality > quantity. 15 strong T1/T2/T3 citations beat 25 random listings
- ❌ Skipping the YAML update — the dashboard depends on it; missing rows mean missed `last_refresh` checks
- ❌ Submitting to "free SEO directory" lists from 2015 SEO blogs — those are link-farm bait; HCU-bait, manual-action risk

---

## When this is done

When 15+ rows in `ops/citations.yaml` show `state: live`:
- The Empire Console `/promote/citations` page shows 60%+ green
- The `/promote/index.astro` Citations tile signal flips to ok-tone
- Phase 0 is complete
- W41–W45 workflows can be wired in n8n (next milestone in `docs/backlink-automation-plan.md`)

---

## Iteration log

- `2026-05-11` — Initial runbook based on `docs/backlink-automation-plan.md` Phase 0 sprints.
