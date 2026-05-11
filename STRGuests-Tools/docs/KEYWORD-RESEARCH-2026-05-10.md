# strguests.tools — Keyword Research

**Research date:** 2026-05-10
**Author:** Claude (Opus 4.7)
**Scope:** SERP-grounded keyword universe + competition deep-dive for the strguests.tools launch cluster (4 PDF generators, 3 AI generators deferred, 26-template message library, programmatic /templates/[scenario] pages, Pinterest distribution).
**Sister-cluster context:** strhost.tools (math), strops.tools (operations), strbuyers.tools (acquisition), thestrledger.com (financial backbone). strguests.tools is the **Guest XP** node — by Daniel's read, the lowest-competition cluster of the four.

---

## 1. Executive summary

The Guest XP keyword cluster is the softest SERP in the four-site STR network. None of the seven primary keywords are dominated by a single fortress — they are split between SaaS blogs (Hostfully, Touchstay, Lodgify, iGMS, Hostaway), template marketplaces (Etsy, Canva, Templatables, Edit.org), and lifestyle-blogger traffic farms (At Home With Ashley, The Frugal Gene, Our Little Lifestyle). No incumbent owns more than 2 of the 7 primary keywords on page-1.

**Top 3 opportunities (tier P0):**

1. **`airbnb wifi sign template`** — Etsy + Pinterest + 3-4 small blogs split the SERP. Free, in-browser, QR-included generator with print-ready output is a frontal-zone differentiator. Volume band: medium. KD band: low. Bang-for-buck: **9/10**.
2. **`airbnb welcome book template` + `airbnb welcome book template free`** — Lodgify, Touchstay, Edit.org, Notion, Hostfully all rank with mostly downloadable PDF or Canva. A *generator* (not a static template) with live preview + email-after-download is novel here. Volume: high. KD: medium. Bang-for-buck: **9/10**.
3. **Programmatic /templates/[scenario] cluster** — 26 hand-written long-tails (`airbnb late checkout request message template`, `airbnb noise complaint message to guest template`, etc.) where SERP is dominated by giant SaaS blog posts that bury one example among many. Per-scenario pages with one focused template + example I/O are a structurally better answer to the query. Volume per page: low. Aggregate volume: high. KD: low. Bang-for-buck: **9/10**.

**Top 3 risks:**

1. **AI-generator keywords are already crowded** — `airbnb listing description generator` has PriceLabs, Lodgify, AirDNA, AutoMate, Galaxy.ai, Hostaway, Anakin, Creati on page-1. `airbnb review response generator` has Touchstay, BuildUp Bookings, Gustaf, Revyoos, MARA, Hospitable. Phase 3 (deferred on `OPENAI_API_KEY`) walks into a knife fight; the frontmatter on these tools matters enormously and the keyword tier should be **P2** until shipped.
2. **Thin-content risk on /templates/[scenario]** — current 26 pages are essentially the JSON `exampleOutput` block + 2 related-template links + the same FAQ. With no narrative MDX, Google's near-duplicate cluster heuristic could swallow most of them. Mirrors strhost.tools' lodging-tax problem (46/51 boilerplate pages) — the lesson is already learned in the network and should not be repeated here.
3. **Pinterest is 30-50% of the realistic traffic** for `welcome book template`, `wifi sign printable`, `house rules printable`. If the Pinterest pin program ships pins with weak titles or non-tested aspect ratios, the strongest channel for this cluster is left on the table.

**Recommended first move:** ship a single 200-word narrative MDX block per /templates/[scenario] page (writing-time: ~3 hrs for all 26) **before** Google's first deep crawl establishes the duplicate-content signal. Same time, generate Pinterest pins for the 4 PDF generators using the `build-pins.mjs` script that already exists in `scripts/`. This is 6 hours of work that captures the cheapest 80% of the upside.

---

## 2. Keyword universe (28 terms)

Volume bands: **High** (10k+/mo), **Medium** (1k–10k), **Low** (100–1k), **Long-tail** (<100). KD bands: **Low** (mostly indie blogs + marketplaces), **Medium** (SaaS blog + 1 fortress), **High** (multiple fortresses + brand search overlap). Bang-for-buck: 1–10 (volume × monetization × winnability).

| # | Keyword | Intent | Volume | KD | Top 3 SERPs | Monetization fit | B4B | Tier |
|---|---|---|---|---|---|---|---|---|
| 1 | `airbnb wifi sign template` | tool | Medium | Low | Etsy, Templatables, Quill Decor blog | Wi-Fi sign generator + Pinterest pin + Touch Stay/Canva affiliate | 9 | P0 |
| 2 | `airbnb welcome book template` | tool/template | High | Medium | Lodgify, Touchstay, Edit.org | Welcome book builder + Touch Stay/Hostfully affiliate + email capture | 9 | P0 |
| 3 | `airbnb welcome book template free` | template | Medium | Low | Now I Stay (Canva), Lodgify, Edit.org, FlipHTML5 | Welcome book builder direct hit | 9 | P0 |
| 4 | `airbnb house rules pdf` | tool | Medium | Low | Touchstay, Lodgify, completehospitalitymanagement.com | House rules PDF generator + email capture | 9 | P0 |
| 5 | `airbnb house rules printable template` | tool | Medium | Low | Hostfully, Canva, Etsy, Hostaway | House rules generator + Pinterest pin + Canva affiliate | 8 | P0 |
| 6 | `airbnb check in instructions template` | template | Medium | Low | Hospitable, Relaxo, Lodgify, Hostex | Check-in PDF generator + Touch Stay affiliate | 8 | P0 |
| 7 | `airbnb message templates` | template/list | High | Medium | Hostfully, Hostaway, iGMS, Minut | /templates/ index + email capture for the pack | 8 | P0 |
| 8 | `airbnb late checkout request message template` | template | Low | Low | airbnb help, Our Little Lifestyle, Breezeway, airhostsforum | /templates/check-out-late-checkout-request | 8 | P0 |
| 9 | `airbnb noise complaint message to guest template` | template | Low | Low | Hospitable, Hostaway, Uplisting, Alertify | /templates/problem-resolution-noise | 8 | P0 |
| 10 | `airbnb broken item message guest template` | template | Long-tail | Low | airbnb help, bnbduck, Minoan, Our Little Lifestyle | /templates/problem-resolution-broken-item | 7 | P0 |
| 11 | `airbnb pre arrival message template` | template | Low | Low | Hostfully, Hostaway, vacationhomehelp, GuestGuru | /templates/pre-arrival-* (3 templates) | 8 | P0 |
| 12 | `airbnb welcome message after booking template` | template | Low | Medium | Touchstay, Lodgify, Operto, Our Little Lifestyle | /templates/pre-arrival-confirmation | 7 | P1 |
| 13 | `airbnb 5 star review response template` | template | Medium | Medium | Hostfully, Avantio, Touchstay, ResponseScribe, Hostaway | Phase 3 review-response AI tool (deferred) | 7 | P1 |
| 14 | `how to respond to bad airbnb review template` | template | Medium | Medium | BuildUp Bookings, Breezeway, airbnb resources, Hostfully | Phase 3 review-response AI tool (deferred) | 7 | P1 |
| 15 | `airbnb cancellation message template` | template | Low | Low | Hostfully, Hostaway, Minut | /templates/cancellation-* (3 templates) | 7 | P1 |
| 16 | `airbnb post checkout message template` | template | Low | Low | Hostfully, Hostaway | /templates/post-checkout-* (2 templates) | 7 | P1 |
| 17 | `vrbo welcome book template` | template | Low | Low | Evolve, Template.net, Lodgify, Templatables, Relaxo | Welcome book builder (no per-property branding distinction needed) | 8 | P1 |
| 18 | `vacation rental welcome book template` | template | Low | Low | Lodgify, Evolve, Relaxo, Touchstay | Welcome book builder | 7 | P1 |
| 19 | `airbnb guest message templates` | template/list | Medium | Medium | iGMS, Hostfully, Hostaway, Minut | /templates/ index — semantic variant of #7 | 7 | P1 |
| 20 | `airbnb listing description generator` (AI) | tool | High | High | PriceLabs, AutoMate, Lodgify, AirDNA, Galaxy.ai | Phase 3 listing-description AI tool (deferred — `OPENAI_API_KEY` blocked) | 5 | P2 |
| 21 | `airbnb review response generator` (AI) | tool | Medium | High | BuildUp Bookings, Touchstay, Gustaf, Revyoos, MARA | Phase 3 review-response AI tool (deferred) | 5 | P2 |
| 22 | `airbnb message generator ai` | tool | Low | Medium | iGMS, Hospitable, Guest Guru | Phase 3 guest-messages AI tool (deferred) | 5 | P2 |
| 23 | `airbnb welcome book canva` | template | Low | Low | Now I Stay, Templatables, Etsy | Welcome book builder + Canva affiliate | 7 | P1 |
| 24 | `airbnb wifi qr code generator` | tool | Low | Low | various qr-code generators, edit.org | Wi-Fi sign generator (already emits WIFI: QR) | 7 | P1 |
| 25 | `airbnb host welcome letter template` | template | Low | Medium | Lodgify, Operto, completehospitalitymanagement | Welcome book + /templates/pre-arrival-confirmation | 6 | P1 |
| 26 | `airbnb checkout instructions template` | template | Low | Low | Lodgify, PriceLabs, Hospitable | /templates/check-out-reminder + future "checkout instructions PDF" | 7 | P1 |
| 27 | `airbnb refund request response template` | template | Long-tail | Low | airbnb help, Hospitable, NerdWallet | /templates/problem-resolution-* | 6 | P2 |
| 28 | `airbnb superhost checklist` | reference | Medium | High | OptimizeMyBnb, KeyNest, Guesty, Boom, Folio | Blog content (future) — no current generator hit | 5 | P2 |

**Summary by tier:** P0 = 11 keywords. P1 = 12. P2 = 5. The cluster's center of gravity is the P0 group (PDF generators + scenario template pages); P1 covers semantic variants and OS-affiliate-friendly long-tails; P2 is everything that depends on Phase 3 AI generators or fights `superhost`-style fortress queries.

---

## 3. Competition deep-dive (primary keywords)

### `airbnb welcome book template`

Top-3 ranking domains (per WebSearch, May 2026):

| Domain | Type | Format on page | Gap to exploit |
|---|---|---|---|
| nowistay.com (`/ressources/how-to-create-an-amazing-airbnb-welcome-book-with-canva-templates`) | SaaS blog (Now I Stay PMS) | Listicle of Canva templates | Static templates; no in-browser builder; no PDF download |
| lodgify.com (`/guides/airbnb-welcome-book/`) | Fortress SaaS blog | Long-form guide + downloadable PDF gated by email | Gated; templates are static; no live preview |
| edit.org (`/blog/host-pack-templates`) | Editor SaaS | Free editable templates inside their editor | Locked into their editor; no portable PDF; ad-heavy |

**Gap:** strguests.tools' `/welcome-book` is the only result that is a true client-side **builder** (toggle sections, live page preview, PDF arrives whether or not email is given). That's a structurally different product, not a better blog post.

### `airbnb wifi sign template`

| Domain | Type | Gap |
|---|---|---|
| etsy.com (`/listing/4332311356/...`) | Marketplace | Paid; no QR generator with WIFI: payload; one design per listing |
| templatables.com | Template SaaS | Editable in MS Word; no live QR; no Pinterest pin |
| quilldecor.com (blog) | Lifestyle blog freebie | Single PNG, no QR, no SSID/password substitution |
| pinterest.com (multiple pins) | Channel | All link out to Etsy or blogs — no pin currently links to a *generator* |

**Gap:** Live QR generator (already emits standard `WIFI:T:WPA;S:...;P:...;;` payload — confirmed in source at `wifi-sign.astro`) + 3 design templates + frame-ready PDF + Pinterest "Save to Pinterest" CTA. Fastest of the seven keywords to win.

### `airbnb house rules pdf`

| Domain | Type | Gap |
|---|---|---|
| touchstay.com (`/blog/airbnb-house-manual-template`) | Fortress SaaS blog | Free Word doc download; not a generator |
| lodgify.com (`/guides/airbnb-house-rules/`) | Fortress SaaS blog | Static PDF download; preset rules baked in |
| completehospitalitymanagement.com (PDF direct) | One-page PDF | Single static PDF, no customization |

**Gap:** 22 preset toggles + custom rules box + branded property name + downloadable PDF, all in browser. Touchstay/Lodgify will keep their rankings on the educational query but lose the *transactional* "give me the PDF now" sub-intent.

### `airbnb check in instructions template`

| Domain | Type | Gap |
|---|---|---|
| hospitable.com (`/airbnb-check-in-instructions`) | Fortress SaaS marketing page | Educational; pushes guests to use Hospitable platform |
| relaxo.io | Digital guidebook SaaS | Locks into their platform; not a portable PDF |
| lodgify.com blog | Fortress SaaS blog | Templates inside the post, no PDF builder |

**Gap:** `/check-in-instructions` is the only one that ships a per-booking PDF with optional door + parking photos uploaded by the host. `lastVerified` style timestamps + photo upload = unmatched on this SERP.

### `airbnb message templates`

| Domain | Type | Gap |
|---|---|---|
| hostfully.com (`/blog/airbnb-message-templates/`) | Fortress SaaS blog | Long-form; templates buried; pushes Hostfully PMS |
| hostaway.com (`/blog/airbnb-guest-messaging-templates/`) | Fortress SaaS blog | Same shape — listicle inside a 4000-word post |
| igms.com (`/airbnb-messages/`) | Fortress SaaS blog | Strategy-first, templates secondary |
| minut.com (`/blog/airbnb-message-templates`) | SaaS blog | 10 templates in one page |

**Gap:** None of the top-4 give each scenario its own URL. strguests.tools' /templates/ index + 26 individual scenario pages are a *structurally* better answer to "I need the late-checkout response right now" — they let Google rank each long-tail to its own destination instead of one omnibus listicle. This is the architectural play.

### `airbnb listing description generator` (P2 — Phase 3 deferred)

| Domain | Type | Notes |
|---|---|---|
| hello.pricelabs.co | Fortress SaaS tool (free, email-gated) | Live, polished, email-gated |
| automatevacations.com | SaaS tool | Live, free |
| tools.airdna.co | Fortress SaaS tool | Live, brand-trust advantage |
| lodgify.com | Fortress SaaS tool | Live |
| hostaway.com (blog) | Educational | Top-3 for the "AI" qualifier |
| galaxy.ai | Indie AI tool aggregator | Live, no-login |

**Gap:** Crowded. The only way to win here is (1) ship Phase 3 with `OPENAI_API_KEY` (or Claude Haiku 4.5 per spec §13), (2) differentiate on rate-limit transparency + style toggles + the "we don't store your output" copy already in `/about`. Recommend **deferring keyword targeting** until tool ships; do not yet write SEO copy for `/listing-description` since the page 404s today.

### `airbnb review response generator` (P2 — Phase 3 deferred)

Top: BuildUp Bookings (free), Touchstay (free), Gustaf, Revyoos (Chrome ext), MARA, Hospitable, Anakin, GetGPT. Same shape as #20: live competitors, polished UX, email-gated. Same recommendation.

---

## 4. Programmatic /templates/[scenario] strategy

### SERP shape per scenario

The 26 scenarios fan out across SERPs that look like this:

| Scenario family | Typical SERP top-3 |
|---|---|
| `pre-arrival-*` | Hostaway / Hostfully blog (omnibus listicle), GuestGuru, vacationhomehelp |
| `check-in-*` | Hospitable, airbnb help center, Relaxo |
| `mid-stay-*` | Hostfully, Minut, Minoan |
| `check-out-*` | airbnb help center, Hostfully, Breezeway, Our Little Lifestyle |
| `post-checkout-*` | Hostfully, Hostaway, GuestReady |
| `problem-resolution-*` | Hospitable, Uplisting, Alertify, airhostsforum |
| `review-request` | Hostfully, Touchstay, Avantio |
| `repeat-guest` | Niche — almost no dedicated pages; airhostsforum threads |
| `cancellation` | airbnb help center, BiggerPockets/airhostsforum threads |
| `special-occasion` | Personal-host blog posts, Pinterest |

**Pattern:** every scenario family is dominated by one of the same ~8 SaaS blogs (Hostfully, Hostaway, Touchstay, Minut, Hospitable, Lodgify, iGMS, Breezeway). Each ranking page is a 2,000–4,000 word blog with the relevant template buried inside. A focused single-template page is a better match for the user's intent — and Google has been rewarding "answer the specific query" pages over omnibus content since the September 2023 helpful content update.

### Top competitors (programmatic risk)

| Competitor | What they do | Threat |
|---|---|---|
| iGMS (`/guest-messaging-templates/`) | Single-page listicle | High SERP authority; weak granularity |
| Hostfully (`/blog/airbnb-message-templates/`) | Omnibus listicle | DR ~70+, ranks for everything |
| Hostaway (multiple) | Omnibus + per-category articles | Two-page approach; closest competitor structurally |
| Reddit r/AirBnB / airhostsforum | UGC threads | Wins on truly long-tail conversational queries |
| Hostfully blog (per-template buckets) | Topic clusters | Strongest fortress; will not yield top spots without unique hooks |

### Thin-content risk

**Current state per source `src/pages/templates/[scenario].astro` + `src/data/templates.json`:** each scenario page renders the JSON `name`, `category`, `scenario` (one sentence), `exampleInput`, `exampleOutput`, then 2 related-template links + the same FAQ block + same email capture + same funnel band. The unique surface per page is ~150–250 words of `exampleOutput`. With no narrative MDX, **all 26 pages will look near-duplicate to Google's clustering pass**, identical to the strhost.tools lodging-tax problem (46/51 state pages). Result: Google picks 4–6 to rank, suppresses the rest as "near-duplicate."

### Recommended differentiation

Add a 200-word **MDX narrative block per scenario** addressing the same 4 questions for each:

1. When to send (timing) — single paragraph, scenario-specific.
2. What to leave out — opinionated; this is the differentiator.
3. The host-side mistake to avoid — anecdotal voice; this is what crawlers reward post-HCU.
4. One small tweak that lifts conversion — usually a single sentence change.

Total cost: ~150 lines of MDX per scenario × 26 = ~3 hrs writing. Output: every page has 400–500 unique words. Indexable as 26 distinct URLs. Estimated upside: 4–6× the long-tail share of voice once Google re-crawls.

---

## 5. Pinterest as parallel SEO channel

Google search and Pinterest search are different surfaces. For 4 of the 7 launch keywords, **Pinterest may deliver more qualified clicks than Google** — guest-XP collateral is visual, hosts pin to "Airbnb Setup" boards as inspiration, and the click-through is high-intent.

### Pinterest pin-keyword universe

These are *Pinterest search* terms (different from Google), grounded in Pinterest's own related-pin sidebar via the WebSearch results.

| # | Pin-keyword | Pinterest SERP shape | Top pinners | Strguests fit | B4B (Pinterest) |
|---|---|---|---|---|---|
| 1 | `airbnb welcome book template` | 2,000+ pins; mostly Etsy + Canva creators | shoprshop, Mamma Mode, malwinapzk, designbywildheart | Direct hit — `/welcome-book` generator pin | 10 |
| 2 | `airbnb wifi sign` | 1,500+ pins; Etsy + small blog freebies | Templatables, Real Estate Templates, Cabin Host | Direct hit — `/wifi-sign` generator pin | 10 |
| 3 | `airbnb house rules printable` | 1,000+ pins; Etsy + Pinterest creator boards | Frugal Gene, Cabin Host, Mamma Mode | Direct hit — `/house-rules-pdf` pin | 10 |
| 4 | `free airbnb printables` | 500+ pins; bundle freebies dominate | thefrugalgene.com, Pinterest creator hubs | Cluster pin — bundle of all 4 PDFs | 9 |
| 5 | `airbnb check in instructions` | 400+ pins; mostly Etsy | Realtor Templates, Cabin Host | Direct hit — `/check-in-instructions` pin | 9 |
| 6 | `airbnb welcome poster template` | 600+ pins | Etsy creators dominant | Welcome book builder (multi-page variant) | 7 |
| 7 | `airbnb host bundle` | 300+ pins; Etsy bundles | Mamma Mode, Pinterest creator hubs | `/get-the-templates` cluster pack pin | 8 |
| 8 | `vacation rental welcome book` | 200+ pins | Pinterest creator boards | Welcome book builder pin | 7 |
| 9 | `airbnb host signage` | 800+ pins | Cabin Host, Templatables | Wi-Fi sign + house rules pin | 8 |
| 10 | `airbnb host printables free` | 1,000+ pins; biggest single Pinterest cluster | Frugal Gene, Mamma Mode, designbywildheart | Cluster pin (4 PDFs) | 10 |

### Pinterest SERP snapshot — primary terms

**`airbnb welcome book template`** (Pinterest search, May 2026, per WebSearch results):
1. Pinterest idea page (curated by `shoprshop`) — 93 pins board
2. Etsy listings (multiple) for editable Canva templates
3. Indie creator pins (designbywildheart, Mamma Mode)
4. Almost no pins linking to a free in-browser generator. **Strguests can own this lane.**

**`airbnb wifi sign`** (Pinterest search):
1. Pinterest idea page
2. Etsy listings (paid, $3–$8 each)
3. Templatables, Realtor Templates pins
4. Quill Decor blog freebie pin
5. **Zero pins** for a free QR generator. **Open lane.**

**`airbnb host printables free`** (Pinterest search):
1. The Frugal Gene's 24-page bundle PDF (most-pinned freebie in this niche, single pin >10k repins per Pinterest sidebar count)
2. Mamma Mode bundle
3. designbywildheart curator board (110 pins)
4. **A "free 7-tool generator hub" pin would be a structurally novel pin in this SERP.**

### Top pinners (potential collaborators / repin sources)

- `@shoprshop` — Airbnb welcome book template board, 93 pins, frequently repins free freebies
- `@designbywildheart` — Airbnb templates and printables board, 110 pins
- `@malwinapzk` — Airbnb welcome book ideas board
- `@cabinhost` — Airbnb welcome posters, signage
- `@mammamode` — Airbnb host bundle creator (paid product)
- `@thefrugalgene` — Free Airbnb printables (high-authority freebie publisher)

### Recommended Pinterest motion (P0)

1. Generate one pin per PDF generator output: 4 generators × 3 templates each (Minimal/Hospitable/Fun for wifi-sign; equivalent style variations for the other 3) = ~12 pins. The `scripts/build-pins.mjs` file already exists — confirm it produces 1000×1500px (Pinterest standard) and writes alt-text from the page H1.
2. One bundle pin per `/get-the-templates` (cluster-pack lead magnet).
3. Pinterest title format that's been winning the SERP: `Free Airbnb [Tool] Template — Printable [Year]`. Avoid emoji.
4. Schedule: pin 2–3/week per board (avoid spam-flag), saved to a single "Free Airbnb Host Printables" board on the strguests.tools Pinterest profile.

### Pinterest bang-for-buck vs Google

For PDF generators, Pinterest will likely deliver **30–50% of organic traffic in months 1–6** per the SERP shape analysis above. Pinterest doesn't have the JS-execution problem that hurts Google's crawl of dynamic sites — pins go into a static index immediately on save.

---

## 6. Prioritized action list

### P0 — within this week

1. Write 200-word MDX narrative per /templates/[scenario] page (26 pages × 3 hrs total). Avoid the lodging-tax thin-content trap that hit strhost.tools.
2. Run `scripts/build-pins.mjs` and ship the 12+ Pinterest pins (4 PDF generators, multiple templates each + cluster bundle).
3. Confirm OG image generation runs in CI for the live build (verified live: `/og/index.png` and `/og/welcome-book.png` both 200 OK at audit time — see audit doc Appendix C).
4. Fix the four 404s blocking sitewide footer link integrity: `/privacy`, `/terms`, `/disclosures`, `/get-the-pdf`. Either ship one-paragraph stubs or remove the links from `Footer.astro:44-46`. (Cross-ref: same problem strhost.tools shipped with — pattern is repeating.)

### P1 — within two weeks

5. Per-tool FAQ schema emission — currently `seo.ts` has a `buildFAQPage` builder but not all 4 PDF generators emit it. Verify each tool page passes its FAQs through `Layout.astro` `jsonLd` prop.
6. `BreadcrumbList` schema on every /templates/[scenario] (`Home → Templates → [Scenario]`) and /blog/[slug] (`Home → Blog → [Post]`). Add `buildBreadcrumb()` to `seo.ts`.
7. Custom `404.astro` page (`src/pages/404.astro` is missing; live `/nonexistent-test-page-404` returns generic 404). Cross-link the 7 tools + /templates/ + /blog.
8. Sitemap `customPages` for `/templates/[all 26 scenarios]/` — verified live sitemap-0.xml *does* include them, so this is OK as-is; just confirm /feed.xml isn't dropped (currently absent from sitemap — strhost.tools P0 problem repeating).
9. Author profile + E-E-A-T: `/about` exists (good); add a named human author for blog posts in `Article` schema instead of just `Organization`.

### P2 — within the month or post-Phase 3

10. After Phase 3 ships (AI generators), seed the 3 generator pages with FAQ blocks targeting `airbnb listing description generator` / `airbnb review response generator` / `airbnb message generator ai`. These are P2 only because the routes 404 today.
11. Programmatic "Airbnb [scenario] message template for [property type]" expansion (`for cabin`, `for condo`, `for boutique hotel`, etc.) — second-tier programmatic if /templates/[scenario] traffic warrants it after 90 days.
12. Pinterest creator outreach: pitch `@shoprshop`, `@cabinhost`, `@thefrugalgene` for a single repin or guest pin once the freebie page is polished.

---

## 7. Cadence / next checkpoints

| When | Check |
|---|---|
| 2026-05-17 | All P0 actions complete; verify `/templates/[scenario]` pages each have unique narrative MDX + 12 Pinterest pins live |
| 2026-05-24 | Indexation status check via Google Search Console: are all 26 /templates/* pages indexed? Are blog posts in feed sitemap? |
| 2026-06-10 (1 month) | First-pass analytics: which 5 /templates/[scenario] pages drove the most impressions? Use that to inform the next 5–10 templates to write |
| 2026-06-10 | Pinterest analytics: top 3 pin titles by saves; iterate the rest to match |
| 2026-08-10 (3 months) | Re-audit. Specifically: has Phase 3 shipped? Which P2 keywords now reachable? Any thin-content suppression on /templates/* (compare indexed vs sitemap count) |

---

*End of keyword research.*
