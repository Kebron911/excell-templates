# InfluencerSoft Module Map

The 11 top-level modules plus secondary surfaces. Each entry lists the exact UI
menu path and the primary thing you do there. Tenant: `kebron.influencersoft.com`.

## 1. Dashboard
- **Path:** Login landing screen
- **What:** Startup Checklist, welcome/fast-start videos, **InfluencerSoft
  Academy**, weekly mentoring (Tech Tuesday) timer + join link.
- **Related:** Gateway to every other module's training.

## 2. Funnels — the visual hub
- **Path:** `Funnels → My Funnels` (then `Catalog` for templates)
- **What:** Drag-drop flowchart canvas. Pages, Forms, Actions, Traffic blocks.
  Link blocks with arrows. Pencil icon on any block opens the page editor.
- **Related:** Courses, sequences, store products can all be created from
  inside the funnel canvas by dragging the matching block.
- **Deeper:** see [ui-walkthrough.md](ui-walkthrough.md).

## 3. Contacts (CRM)
- **Path:** `Contacts → Leads`
- **What:** Lists/groups (terms used interchangeably in UI), tags, custom
  fields, subscription forms, individual lead activity history.
- **Add contact:** API (`AddUpdateLead`) or manual via this screen.
- **Custom fields:** `Contacts → Custom Fields` — IS rejects prefix-colliding
  names (refresh page between adds; see [gotchas.md](gotchas.md)).
- **Naming rules:** see [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md) §6.

## 4. Email Sequences (Campaigns)
- **Path:** `Campaigns → Sequence`
- **What:** Linear, scheduled email autoresponders. Purple "+" adds first
  email, green "+" adds subsequent. Delays are time-based (e.g. 2d after prev)
  or date-based. "Add option" inside an email = A/B test (auto 50/50 split).
- **Sequences cannot be created via API** — paste from `.md` drafts. See
  paste order in [manual-setup-guide.md](../../../ops/manual%20work/influencersoft-manual-setup-guide.md) Part 3.

## 5. Process (Automation)
- **Path:** `Automation → Process` or canvas Action block
- **What:** Advanced visual automation — branching, multi-fire, filters,
  A/B test blocks, action blocks (send email, add tag, move between lists).
  Use this when a linear sequence can't express the logic.
- **Warning:** Don't build massive Process flows if a linear sequence works —
  harder to troubleshoot (founder's own advice).

## 6. Mailing Settings (deliverability)
- **Path:** `Campaigns → Settings`
- **What:** Add/confirm sender emails (must be corporate domain — DMARC
  rejects Gmail/Yahoo), configure DKIM/SPF/DMARC DNS records, FBL setup.
- **Email templates** sub-tab: project logo, author photo, social links
  auto-appended to all mailings.
- **Language** sub-tab: account-wide default language.
- **Deeper:** see [deliverability.md](deliverability.md).

## 7. Courses (LMS)
- **Path:** `Courses → Add a Course`
- **What:** Modules → Lessons (with optional drip — "Instantly" / "X days
  after start" / "X days after previous" / "calendar date"). Bulk-add or
  drag-reorder lessons. Mark obligatory (blue exclamation mark).
- **Access:** `Access` tab → "Allowed to leads in lists" → check lists.
  Override with "Not allowed" lists. Per-module gating also supported.
- **Reports:** `Courses → Reports` — Lesson opened vs completed counts,
  homework status (New/Accepted/Rejected).
- **Members area:** drag Members Area block in any Funnel to link a course.

## 8. Affiliates
- **Path:** `Affiliates → Offers`
- **What:** 2-tier affiliate program. Fixed sum OR % commission. Payout via
  PayPal or bank. MoneyBack auto-subtracts commission on refund.
- **Tracking:** `Click.js` script (paste into HEAD of external pages) parses
  UTM tags + sets browser cookie tying clicks to partners.
- **Fee Period:** 1–365 days or "forever" (cookie window).
- **Reports:** `Affiliates → Affiliate Management and Reporting`.

## 9. Store (E-commerce)
- **Path:** `Store → Products`, `Store → Order forms`, `Store → Coupons`
- **What:** Digital + physical products, single-price or recurring plans,
  multi-currency, order bumps (Payment Page → Actions → "Adding a Bump
  Offer"), upsell/downsell pages with `#upsell_yes` / `#upsell_no` variables
  for one-click charging.
- **Gateways:** Stripe (on-page card), PayPal (off-page redirect).
- **Limitation:** no "add-to-cart" — single-product funnels only.

## 10. Webinars
- **Path:** `Website → Webinar`
- **What:** Configure webinar rooms — title, date, time (East Coast military),
  countdown timer toggle, chat toggle, embed YouTube/private video.
  Behavioral routing in funnels (watched-to-end vs skipped → different paths).
- **Live webinars:** recommended to use external (Zoom/Sessions) via "Any
  Page by URL" block and let IS handle traffic tracking.
- **Evergreen:** native Replay Room block — the same funnel with a different
  arrow makes a live webinar evergreen.

## 11. Integrations & API
- **Path:** Account footer → `Integration and API` or
  `username.influencersoft.com/shops/setts/apisettings/`
- **What:** Retrieve **rpsKey** (API key). Connect Zapier (4 triggers + 6
  actions). Generate `Click.js` snippet for external page tracking.
  Configure webhook fields.
- **Deeper:** see [api-quickref.md](api-quickref.md).

---

## Secondary surfaces

### Surveys
- **Path:** `Website → Surveys`
- **What:** Standalone survey builder (Pages + Questions). Multi-language
  field requirements. Trigger actions on completion (add to list, redirect).
- **Founder advice:** if you need anything beyond basic, embed Google Forms
  via the Code widget — native builder is "very simple".

### Reports
- **Path:** `Reports` (top-level)
- **What:** Sales Funnel Analytics, Sales Statistics, Subscription
  Statistics, Advertising Efficiency, Sales Department Statistics,
  Expenses Import. Plus sequence analytics under `Campaigns → Analytics`.
- **Deeper:** see [reports-analytics.md](reports-analytics.md).

### Website / Domain
- **Path:** `Websites → Set up`
- **What:** Link custom domain via CNAME, get free SSL, manage subdomains,
  paste HEAD code (Google Analytics, Facebook Pixel, custom scripts) under
  the `More` tab → `Add HEAD code`.

### Personal Managers / Team
- **Path:** `Integration and API` (account footer) — also `getpersonalmanagers` API
- **What:** Additional users (Sales Manager, Personal Manager roles for
  homework review). User count depends on tier (5 / 15 / 25+).
