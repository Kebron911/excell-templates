# strmanuals.com — Keyword Research & Pre-Launch SEO Plan

**Doc date:** 2026-05-10
**Author:** Claude (Opus 4.7)
**Scope:** Source-grounded keyword + competition scan for `STRManuals/` (Astro hybrid + Stripe). 5 paid PDFs + 1 bundle. **Site is pre-launch (HTTP 503 confirmed).**
**Live URL (current):** https://strmanuals.com — 503
**Sister sites referenced:** strhost.tools (live, audited 2026-05-08), strops.tools, strguests.tools, strbuyers.tools, thestrledger.com

---

## Executive summary

strmanuals.com is the only **paid-PDF** site in the STR Ledger cluster. Every other property monetizes via free tools, affiliate, or workbook upsell — this one needs cold visitors to type a credit card. That changes the keyword math: ranking for "what is the str tax loophole" is worth less than ranking for **"str tax loophole guide pdf"** or **"how to qualify for str loophole"** — terms with intent to act, not just learn.

The competitive surface is two-sided:

1. **CPA blogs** (TheRealEstateCPA, KeeperTax, WCG, Hiltzik, Madsen, Abode Cost Seg, MGO, Eisner Amper, REI Hub, Landlord Studio, Lodgify, TaxAct, gosummer, repstime, semiretiredmd) own the **informational** layer for tax topics. They rank for "str tax loophole" and "material participation" but they are gated by "consult our firm" CTAs. They will not be dislodged head-on; they can be **flanked** with action-oriented long-tail.
2. **Software vendors** (Hostfully, Hostaway, Lodgify, Uplisting, OwnerRez, AirDNA, PriceLabs, RedAwning, Truvi, Tabivista, Guesty) own the **operational** layer (bookings down, direct bookings, regulation). Same gate — their CTA is "start a free trial of our PMS."

**The gap:** Nobody is selling a $19–$39 self-serve PDF in either lane. Etsy has bundles ($10–$30 toolkits — bnbtools.com, artfultemplates, bnblabs, mammamode), but those are Canva templates, not editorial guides. STRManuals is a real category-of-one for **decision-driving prose at PDF prices**.

**Top 3 opportunities (by purchase-intent fit + winnability):**

| # | Cluster | Why it wins |
|---|---------|-------------|
| 1 | **TAX-01 / TAX-02 long-tail** ("str loophole 100 hour rule", "how to document material participation airbnb", "str loophole 2026 bonus depreciation") | High commercial-to-transactional intent. Buyers Googling these are mid-decision. CPA blogs answer thinly and pivot to a $2,500 engagement; a $29 PDF lands in a real white space. |
| 2 | **REV-01 "bookings down" diagnostic** ("airbnb bookings down 2026", "airbnb occupancy dropping", "why is my airbnb not getting bookings") | Pain-driven search, peak emotion. AirDNA owns the SERP with editorial that pitches the AirDNA platform — a $19 diagnostic PDF is a lower-friction yes than a $99/mo SaaS trial. |
| 3 | **LGL-01 city-specific permit terms** ("austin str permit", "los angeles airbnb permit", "[city] short term rental ordinance") | Hyper-local, pre-purchase intent (often a buyer about to close). Currently dominated by city government PDFs and a long tail of property managers. A national framework PDF + per-city research worksheet is a real wedge. **Programmatic city pages are mandatory here** — see §7. |

**Biggest risks (rank-ordered):**

1. **Paid-PDF buyers don't Google generic info terms** — they Google reviews, comparisons, and platform brands ("airbnb tax loophole reddit", "str tax cpa", "best str tax course"). Strategy must include review-bait and comparison content, not just topical authority.
2. **YMYL collision on tax content.** TAX-01 and TAX-02 sit in Google's Your-Money-Your-Life zone. Without strong author E-E-A-T signals (named author, credentials, About page, real reviews) Google will favor CPA-firm sites with `.cpa` domains and decade-old domain age.
3. **No backlink profile, no domain age, parent cluster is small.** Even with perfect on-page, ranking for "str tax loophole" against TheRealEstateCPA is a 2–3 year project. **Plan for direct, paid, and referral acquisition for 6–12 months while organic compounds.**
4. **Reddit is an SEO competitor now.** "airbnb bookings down" and "str loophole" both surface r/AirBnB and r/RealEstateInvesting threads in top 10. Need a Reddit presence — not as spam, as a participating author who links to long-form when relevant.

**Recommended first move (before launch):** ship the free magnet (`str-tax-loophole-explainer`) + TAX-01 sales page + per-manual schema + per-city LGL-01 programmatic pages on day 1. Treat the other three manuals as launch-week pages. Free magnet is the entry point; TAX-01 is the cash cow; LGL-01 is the volume play.

**Headline pre-launch readiness score: 6/10** — concept and product are sharp; site is unbuilt enough that there is no SEO debt yet; but no programmatic city layer exists in `site/src/pages/` and that is the single biggest at-launch decision.

---

## Score per dimension (1–10) — *forward-looking, what day-1 will look like if current scaffolding ships as-is*

| # | Dimension | Score | Justification |
|---|-----------|-------|---------------|
| 1 | Crawlability & indexing | 7 | Astro hybrid + manual content collection is clean. Pre-launch — no live sitemap to verify yet. Avoid strhost's blog-missing-from-sitemap mistake. |
| 2 | On-page metadata | 6 | Per-manual MDX exists in `src/content/manuals/`; need to confirm Layout-level title/desc/canonical/OG wired before launch. |
| 3 | Structured data | 4 | **Critical gap.** No evidence of `Product` + `Offer` schema in `[slug].astro`. For a paid-PDF store this is mandatory — drives rich result eligibility. Also missing: `Organization` `sameAs`, `BreadcrumbList`, `FAQPage`, `AggregateRating` (post-reviews). |
| 4 | Content & semantic HTML | 6 | 6 manual pages + bundle + about + thank-you + privacy + refund. Thin compared to a 30-page e-commerce store. Need long-form sales pages (1,500+ words each) and a blog. |
| 5 | Internal linking | 5 | Header/Footer/ManualCard exist. No blog or FAQ surface yet to internal-link from. Needs cross-sell links between TAX-01 ↔ TAX-02, REV-01 ↔ REV-02. |
| 6 | Performance | 7 | Astro hybrid output is fast by default. Watch the `BuyButton` / `EmailCapture` islands for `client:load` overuse — same finding strhost got dinged on. |
| 7 | Mobile / accessibility | 7 | Standard Astro Layout assumed sound; verify viewport + lang + form labels on EmailCapture and checkout button. |
| 8 | Off-page / authority | 2 | Zero backlinks, zero brand mentions, no parent-site link from thestrledger.com yet. Get listed in The STR Ledger footer + a launch announcement post on day 1. |
| 9 | Funnel / lead-magnet hygiene | 7 | Free PDF magnet planned (`str-tax-loophole-explainer`) — good. Thank-you page exists. EmailCapture component exists. Need to verify it goes through `/api/subscribe` → n8n → InfluencerSoft per `CLAUDE.md:35`. |
| 10 | Technical hygiene | 6 | HTTPS assumed (Hostinger Business). HMAC download tokens (`hmac.ts`) good for security. Need: robots.txt, sitemap, 404 page, /privacy /refund /about all stubbed (already in `src/pages/`). Confirm trailing-slash convention before launch — strhost has a known inconsistency, don't inherit. |

**Overall pre-launch readiness: 57/100.** Fixable to 80+ before go-live with the §7 checklist.

---

## Pre-launch context

| Item | Status | Source |
|---|---|---|
| Live URL | HTTP 503 | live check, brief noted |
| Site code | scaffolded | `STRManuals/site/` — Astro hybrid, 6 manual MDX files, checkout/webhook/subscribe API routes, EmailCapture, BuyButton |
| Manuscripts | 6 of 6 drafted | `STRManuals/manuscripts/` — TAX-01, TAX-02, REV-01, REV-02, LGL-01, FREE-str-tax-loophole-explainer |
| PDFs on disk | 0 (placeholder `private/manuals/.gitkeep`) | not yet typeset |
| Email vendor | InfluencerSoft via n8n | `CLAUDE.md:27-49` |
| Stripe | Direct integration via `/api/checkout` + `/api/stripe-webhook` | `site/src/pages/api/` |

### SEO timeline implication

503 means **no crawl history**. That is good (no negative signals to overcome) and bad (no domain trust to inherit). Google First Crawl latency from `live + sitemap submitted` to "first impressions in Search Console" is typically **3–14 days** for a fresh domain on a known host (Hostinger). Time to **first ranking on long-tail commercial terms** is typically **6–16 weeks** with consistent publishing. Time to compete head-on with TheRealEstateCPA on "str tax loophole" is **24+ months** — don't underwrite the launch on that.

### Recommended go-live + 90-day roadmap

| Phase | Timeline | Goal |
|---|---|---|
| **T-7 days** | Pre-launch | Ship the §7 checklist. Stage on a non-prod URL or behind basic auth so Stripe webhook can be tested without indexable URLs leaking. |
| **T-0 (launch day)** | Day 0 | Drop 503. Submit sitemap to Google Search Console + Bing Webmaster. Publish launch post on thestrledger.com with do-follow link. Soft-announce in 1 Reddit thread (r/AirBnB) — *participating, not spamming*. |
| **Week 1–2** | T+14 | Ship 4 pillar blog posts (one per manual + one bundle comparison). Each post links to the relevant sales page. Start free-magnet email capture funnel. |
| **Week 3–6** | T+45 | Ship LGL-01 programmatic city layer (top 25 STR markets — Austin, LA, Nashville, Asheville, Scottsdale, Joshua Tree, Gatlinburg, Sevierville, Big Bear, Destin, etc.). 1,500–2,500 indexable URLs in one keystroke. |
| **Week 7–12** | T+90 | First post-launch SEO audit (use the strhost.tools audit doc as the template). Add `AggregateRating` once you have 20+ verified-buyer reviews. Consider a comparison post: "STR Manuals vs. Hospitable Academy vs. AirBnB U" — a high-intent comparison query is a buyer 90% of the way down the funnel. |

---

## Per-manual keyword universe

**Volume bands:** XS = <100/mo · S = 100–500 · M = 500–2k · L = 2k–10k · XL = 10k+
**KD bands:** Low (≤25) · Med (26–50) · High (51–75) · Very High (76+) — *Ahrefs/SEMrush convention; estimated from SERP analysis, not pulled from a tool.*
**Intent:** I = informational · C = commercial · **T = transactional**
**Bang-for-buck:** 1–10, weighted toward purchase-intent fit + winnability

### TAX-01 — The STR Tax Loophole Playbook ($29)

| Keyword | Intent | Volume | KD | Top 3 SERPs (live) | Purchase-intent fit | BfB | Tier |
|---|---|---|---|---|---|---|---|
| short term rental tax loophole | I | L | Very High | TaxAct, TheRealEstateCPA, gosummer | Low (info) | 4 | P2 |
| str tax loophole 2026 | I/C | M | High | repstime, abodecostseg, KeeperTax | Med | 6 | P1 |
| str loophole bonus depreciation | C | S | High | abodecostseg, TheRealEstateCPA, WCG | Med-High | 7 | P1 |
| how to qualify for str loophole | C/T | S | Med | KeeperTax, gosummer, hiltzikcpa | High | 8 | **P0** |
| str tax loophole guide pdf | T | XS | Low | (no dominant result — opportunity) | **Very High** | 10 | **P0** |
| str loophole high w-2 income | C/T | XS | Low | wcginc | High | 9 | **P0** |
| str loophole step by step | C/T | XS | Low | (sparse) | High | 9 | **P0** |
| airbnb tax write off | I | L | Very High | NerdWallet, Investopedia | Low | 3 | P2 |
| airbnb depreciation calculator | C | S | Med | (sparse) | Med | 6 | P1 |
| str tax strategy book | T | XS | Low | (Amazon thin) | **Very High** | 10 | **P0** |
| str tax loophole reddit | I/C | S | Low | r/AirBnB, r/RealEstateInvesting | Med (review intent) | 7 | P1 |
| str loophole vs reps | C | XS | Med | TheRealEstateCPA | High | 8 | P1 |

**Anchor pages:** `/manuals/str-tax-loophole-playbook` (sales page) + `/blog/str-loophole-step-by-step` (informational entry → CTA to manual) + `/free/str-tax-loophole-explainer` (lead magnet).

### TAX-02 — Material Participation Survival Kit ($29)

| Keyword | Intent | Volume | KD | Top 3 SERPs (live) | Purchase-intent fit | BfB | Tier |
|---|---|---|---|---|---|---|---|
| material participation airbnb | I/C | M | High | hiltzikcpa, semiretiredmd, madsencpa | Med | 6 | P1 |
| 100 hour rule short term rental | C | S | Med | hiltzikcpa, madsencpa | High | 8 | **P0** |
| material participation 100 hour test | C | S | High | semiretiredmd, eisneramper | High | 7 | P1 |
| how to document material participation airbnb | T | XS | Low | (sparse — opportunity) | **Very High** | 10 | **P0** |
| material participation log template | T | XS | Low | (Etsy / template farms) | **Very High** | 9 | **P0** |
| non-passive str | C | XS | Med | TheRealEstateCPA | High | 7 | P1 |
| irs publication 925 str | I | XS | Low | irs.gov | Low | 4 | P2 |
| short term rental cpa near me | C | S | Med | local CPA pages | Low (not buyer for PDF) | 3 | P2 |
| material participation activities that count | I/C | XS | Low | semiretiredmd | Med-High | 8 | **P0** |
| str loophole audit defense | C/T | XS | Low | (sparse) | **Very High** | 10 | **P0** |

**Anchor pages:** `/manuals/material-participation-survival-kit` + `/blog/100-hour-rule-airbnb-explained` + (post-launch) `/blog/material-participation-log-template-free` (gated mini-magnet → upsell to TAX-02).

### REV-01 — Why Are My Bookings Down? ($19)

| Keyword | Intent | Volume | KD | Top 3 SERPs (live) | Purchase-intent fit | BfB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb bookings down 2026 | I/C | M | Med | newsilver, t2conline, AirDNA | High | 8 | **P0** |
| why is my airbnb not getting bookings | C | M | Med | AirDNA, hostaway | High | 9 | **P0** |
| airbnb occupancy dropping | I/C | S | Med | AirDNA, time.com | High | 8 | **P0** |
| airbnb not booking | C | S | Med | AirDNA | High | 8 | **P0** |
| vrbo bookings declining | C | S | Low | (sparse — opportunity) | High | 9 | **P0** |
| airbnb supply glut 2026 | I | S | Low | newsilver, time.com | Med | 6 | P1 |
| airbnb bookings down reddit | I/C | S | Low | r/AirBnB, r/AirBnBHosts | High (peer validation) | 8 | **P0** |
| how to fix airbnb bookings | C/T | S | Low | (sparse) | **Very High** | 10 | **P0** |
| airbnb diagnostic checklist | T | XS | Low | (sparse) | **Very High** | 10 | **P0** |
| airbnb listing not converting | C | XS | Low | hostaway, hostfully | High | 8 | **P0** |
| airbnb pricing too high or too low | C | S | Med | PriceLabs, AirDNA | High | 7 | P1 |
| airbnb collapse | I | M | Med | newsilver, t2conline | Low (doom intent) | 5 | P2 |

**Anchor pages:** `/manuals/why-bookings-down` + `/blog/airbnb-bookings-down-2026-diagnostic` + `/blog/airbnb-bookings-down-checklist`.

### REV-02 — Direct Bookings Starter ($25)

| Keyword | Intent | Volume | KD | Top 3 SERPs (live) | Purchase-intent fit | BfB | Tier |
|---|---|---|---|---|---|---|---|
| how to get direct airbnb bookings | C | M | Med | tabivista, redawning, hostaway | High | 8 | **P0** |
| direct booking website airbnb | C/T | M | Med | lodgify, uplisting, hostfully | High | 8 | **P0** |
| direct bookings vacation rental | C | M | Med | hostfully, hostaway, truvi | High | 7 | P1 |
| how to start direct bookings | C/T | S | Low | uplisting, pricelabs | **Very High** | 9 | **P0** |
| direct booking website cost | C/T | S | Low | (sparse) | High | 8 | **P0** |
| reduce airbnb fees | C/T | S | Med | (sparse) | High | 8 | **P0** |
| airbnb to direct booking transition | T | XS | Low | (sparse — opportunity) | **Very High** | 10 | **P0** |
| direct booking discount strategy | C/T | XS | Low | hostfully | High | 8 | P1 |
| airbnb without airbnb | I/C | XS | Low | (Reddit) | Med | 6 | P2 |

**Anchor pages:** `/manuals/direct-bookings-starter` + `/blog/direct-booking-website-airbnb-cost-comparison` + `/blog/airbnb-to-direct-booking-without-getting-banned` (the implicit fear in the hostaway/community thread cited).

### LGL-01 — STR Permit & Regulation Survival Guide ($25)

This is the **programmatic** manual. National-level keywords have high volume and high difficulty; per-city keywords are individually low-volume but collectively massive.

#### National terms

| Keyword | Intent | Volume | KD | Top 3 SERPs (live) | Purchase-intent fit | BfB | Tier |
|---|---|---|---|---|---|---|---|
| short term rental ordinance | I | M | Med | nlc.org, government PDFs | Low | 5 | P2 |
| airbnb permit | I | M | Med | city .gov sites, guestable | Med | 6 | P1 |
| str regulation guide | C | S | Low | (sparse) | High | 8 | **P0** |
| how to research airbnb regulations | C/T | S | Low | (sparse — opportunity) | **Very High** | 10 | **P0** |
| str compliance checklist | T | XS | Low | (sparse) | **Very High** | 10 | **P0** |
| airbnb legal guide | C | S | Med | lodgify, hostfully | High | 7 | P1 |

#### City terms (sample — actual list = top 50 STR markets)

| Keyword pattern | Volume per city | KD | Top 3 SERPs typical | BfB | Tier |
|---|---|---|---|---|---|
| `[city] short term rental ordinance` | XS–S | Low | city .gov, guestable, hometeamluxury | 9 | **P0** |
| `[city] airbnb permit` | S | Low–Med | city .gov, hostfully | 9 | **P0** |
| `[city] str regulation` | XS | Low | local property managers | 9 | **P0** |
| `[city] vacation rental license` | S | Low | city .gov | 9 | **P0** |

**Top 25 cities to ship at launch (gut-check from market activity, not measured):** Austin TX, Nashville TN, Los Angeles CA, San Diego CA, Phoenix AZ, Scottsdale AZ, Joshua Tree CA, Big Bear CA, Sevierville TN, Gatlinburg TN, Pigeon Forge TN, Asheville NC, Charleston SC, Savannah GA, Destin FL, Orlando FL, Miami FL, Key West FL, Honolulu HI, Maui HI, Park City UT, Breckenridge CO, Denver CO, Portland OR, New Orleans LA.

**Anchor pages:** `/manuals/permit-regulation-survival` (national framework PDF) + `/regulations/[city]` (programmatic, 25 at launch → 50 → 100). Each city page summarizes the rule, links to the city .gov source, and CTAs the LGL-01 PDF as the "how to research the next city" framework. **This is the volume play.** Without it, LGL-01 ranks for ~5 keywords; with it, 200+.

### BUNDLE-01 — All Five ($99)

| Keyword | Intent | Volume | KD | Top 3 SERPs (live) | Purchase-intent fit | BfB | Tier |
|---|---|---|---|---|---|---|---|
| airbnb host toolkit | C/T | M | Med | bnbtools, artfultemplates, mammamode | High | 7 | P1 |
| str owner bundle | T | XS | Low | (sparse) | **Very High** | 10 | **P0** |
| short term rental bundle pdf | T | XS | Low | (sparse) | **Very High** | 10 | **P0** |
| airbnb host bundle 2026 | C | S | Low | mammamode | High | 8 | **P0** |
| airbnb host essentials | C | M | Med | bnbtools, bnblabs, artfultemplates | Med (different product — Canva templates) | 5 | P2 |
| best airbnb host books | C | S | Med | (Amazon, Goodreads) | High | 7 | P1 |
| str host complete guide | C/T | XS | Low | (sparse) | **Very High** | 9 | **P0** |
| airbnb host course vs book | C/T | XS | Low | (sparse) | High (comparison intent) | 8 | P1 |

**Anchor pages:** `/bundle` (already exists in `src/pages/bundle.astro`) + `/blog/airbnb-host-toolkit-comparison-2026` (positions BUNDLE-01 against bnbtools/Canva-template bundles — different category).

---

## Competition deep-dive

### TAX-01 / TAX-02 (tax cluster)

**Who ranks now:**
- **Tier-1 CPA editorial:** TheRealEstateCPA, KeeperTax, WCG (wcginc), Eisner Amper, MGO CPA, Hiltzik CPA, Madsen CPA, Abode Cost Seg, Hall CPA. All publish 2k–4k word explainers, all gate behind "book a consult."
- **Tier-2 platform blogs:** TaxAct, REI Hub, Lodgify, Landlord Studio. Generalist posts, weaker authority on this niche.
- **Tier-3 forums:** Reddit (r/AirBnB, r/RealEstateInvesting, r/tax), BiggerPockets forum threads.

**The gap:** Every result on the front page is either (a) a sales page for a $2k+ consult or (b) a forum thread with no canonical answer. A **decision-driving $29 PDF** that says "here is whether the loophole works for you, here is exactly what to track, here is a sample participation log, here is what the IRS will ask" — there is literally no competing product in that price band on the front page. STRManuals' angle: "the manual the CPA blogs won't write because it's not in their commercial interest."

**Risk:** YMYL. Google deeply favors `.cpa` domains and named CPA authors on tax content. Mitigations: (a) credentialed reviewer page (commission a CPA review of TAX-01 and TAX-02, name them, link them), (b) explicit disclaimer on every page (already in manuscripts), (c) cite IRS Pub 925 + Treasury Regs by section (already in TAX-02 manuscript per glob pattern).

### REV-01 / REV-02 (revenue cluster)

**Who ranks now:**
- **AirDNA dominates** — owns "airbnb bookings down", "why is my airbnb not getting bookings", "airbnb diagnostic". Pitches the AirDNA $99/mo tool.
- **Hospitable, Hostaway, Hostfully, Lodgify, Uplisting, RedAwning, Truvi, Tabivista, PriceLabs** — all have direct-bookings explainers. Pitch their PMS/booking software.
- **News:** newsilver.com, t2conline.com, time.com — "Airbnb collapse" doom-bait. High volume, low conversion.
- **Reddit:** r/AirBnB and r/AirBnBHosts have constant "bookings down" threads — these RANK in Google because Google now boosts forum content.

**The gap:** A $19 self-serve diagnostic PDF beats a $99/mo AirDNA trial on friction. The buyer is in pain *now*, doesn't want to learn a SaaS dashboard. Position REV-01 as "the 30-minute diagnostic before you spend $1,200/yr on AirDNA." Position REV-02 as "the $25 starter pack vs. $300/mo Lodgify."

**Risk:** Software vendors will keep outpublishing on these terms forever — they have content teams. Counter: write better. Their posts are 80% checklist, 20% pitch. STRManuals can write 100% diagnostic with no software pitch — that's defensible.

### LGL-01 (regulation cluster)

**Who ranks now:**
- **Government .gov sites** — austintexas.gov, planning.lacounty.gov, planning.rctlma.org, stlouis-mo.gov, humboldtgov.org. Always rank for `[city] short term rental` because of `.gov` domain authority. Cannot be displaced from #1.
- **National League of Cities** (nlc.org) — owns "short-term rental regulations" national-level term.
- **Property managers:** guestable, hometeamluxuryrentals — rank for `[city] short term rental regulations [year]`. These ARE displaceable.
- **PMS vendors:** Lodgify, Hospitable explainers — same as above.

**The gap:** The .gov sites tell you THE RULE; they don't tell you HOW TO RESEARCH the rule for the next city. STRManuals' framework — "the six-question call you make to the city clerk before you put offer in" — is unique. Programmatic per-city pages should rank #2–#5 (below the .gov), capture the buyer who is researching multiple markets.

### BUNDLE-01 (bundle/comparison cluster)

**Who ranks now:**
- **Etsy template stores:** bnbtools.com, bnblabs.net, artfultemplates.com, mammamode.com — sell $10–$30 Canva template bundles (welcome book + Excel tracker + signs). NOT the same product. Different buyer.
- **Lodgify** — free hosting guide PDFs as lead magnet for their PMS.
- **Airbnb's official Host-Guide.pdf** — distributed via news.airbnb.com.

**The gap:** No editorial-grade decision-making bundle exists. Every competing bundle is templates or PMS lead-mag. STRManuals can position as "the only bundle that helps you decide what to do, not just give you templates."

---

## Free-magnet keyword strategy

**Magnet:** `str-tax-loophole-explainer` (free PDF). Manuscript exists at `manuscripts/FREE-str-tax-loophole-explainer.md`.

**Landing page:** `/free/str-tax-loophole-explainer` (recommended path; not yet in `src/pages/`).

| Keyword | Intent | Volume | KD | Notes |
|---|---|---|---|---|
| str tax loophole explained | I | M | High | Direct-match magnet name — own this. |
| str tax loophole pdf | T | XS | Low | Free + paid both eligible — own both. |
| str loophole quick guide | C | XS | Low | Sparse SERP — easy win. |
| airbnb tax loophole free guide | T | XS | Low | Lead-magnet intent — own. |
| does the str loophole apply to me | C | XS | Low | Decision intent — perfect magnet hook. |
| str loophole 2026 explained | I/C | S | Med | Annual refresh angle. |

**Magnet page strategy:** rank for "str tax loophole explained" + "does the str loophole apply to me" — both pure magnet intent. The page itself is the SEO surface; the email-gated PDF is the conversion. The page should be 800–1,200 words of partial answer (enough to rank, not enough to satisfy intent — leave the worked example, the doc-list, and the audit-defense section for the gated PDF).

**Conversion path:** magnet → InfluencerSoft sequence (Day 0 PDF, Day 7 soft TAX-01 pitch — already specified in `CLAUDE.md:48`). Track `magnet:str-tax-loophole-explainer` → `product:str-tax-loophole-playbook` conversion as the north-star metric.

---

## Bundle / cross-sell keywords

| Keyword | Intent | Volume | KD | Page | Tier |
|---|---|---|---|---|---|
| airbnb host toolkit | C/T | M | Med | `/bundle` | P1 |
| str owner complete bundle | T | XS | Low | `/bundle` | **P0** |
| short term rental playbook bundle | T | XS | Low | `/bundle` | **P0** |
| str host bundle save money | C/T | XS | Low | `/bundle` | P1 |
| airbnb host books bundle | C | XS | Low | `/bundle` | P1 |
| best resources airbnb host 2026 | C | S | Med | `/blog/best-airbnb-host-resources-2026` (listicle including own bundle) | P1 |
| airbnb course vs book | C | S | Low | `/blog/airbnb-course-vs-book-comparison` | P1 |

**Cross-sell keywords (intra-product):**

| From → To | Trigger keyword | Mechanism |
|---|---|---|
| TAX-01 → TAX-02 | "material participation airbnb" inside TAX-01 sales page | Inline link to TAX-02 sales page; bundle CTA |
| REV-01 → REV-02 | "direct bookings" inside REV-01 manual | Day 14 InfluencerSoft email after REV-01 purchase |
| LGL-01 → all | "before you buy your next STR" | Email Day 30 after LGL-01 purchase |
| Free magnet → TAX-01 | covered by InfluencerSoft Day 7 (per `CLAUDE.md:48`) | Confirmed |

---

## Pre-launch SEO checklist

Using strhost.tools' SEO audit framework as the template (10 dimensions). For each, what STRManuals must have on day 1.

| # | Dimension | Day-1 requirement | File / location | strhost.tools mistake to avoid |
|---|---|---|---|---|
| 1 | Crawlability | `robots.txt` + `sitemap.xml` (auto via @astrojs/sitemap) including `/manuals/[slug]/`, `/bundle`, `/free/[slug]`, `/regulations/[city]`, `/blog/[slug]`, `/about`, `/refund`, `/privacy`, `/thank-you` (noindex thank-you). | `site/public/robots.txt`, `site/astro.config.mjs` | strhost forgot blog + feed in sitemap. **Double-check `customPages` covers all dynamic routes.** |
| 2 | Crawlability | Custom `404.astro` with cross-links to all 5 manuals + bundle + about. | `site/src/pages/404.astro` (does not exist yet — **add**) | strhost has no 404 page (P0 finding). |
| 3 | Crawlability | All footer links resolve. `Footer.astro` — `/about`, `/refund`, `/privacy` all exist (verified). | `site/src/components/Footer.astro` + `site/src/pages/` | strhost ships sitewide-broken `/privacy` `/terms` `/disclosures` (P0). |
| 4 | On-page metadata | Per-manual `<title>` ≤ 60 chars, `<meta description>` ≤ 160 chars, canonical URL, OG image, Twitter card — emitted from `Base.astro`. | `site/src/layouts/Base.astro` + `[slug].astro` frontmatter | Audit title vs H1 alignment per page (strhost has 2 mismatches). |
| 5 | Structured data | **`Product` JSON-LD on every manual page** with `name`, `description`, `image`, `brand`, `sku`, `offers` (price, priceCurrency=USD, availability=InStock, url). + `Organization` sitewide with `sameAs` populated (link to thestrledger.com, strhost.tools, sister sites). + `BreadcrumbList` on every non-home page. + `FAQPage` on bundle + free-magnet pages. | `site/src/lib/seo.ts` (does not exist — **create** to mirror strhost pattern) | strhost has empty `sameAs[]` (P2) AND no `BreadcrumbList` site-wide (P1). **Don't repeat the BreadcrumbList omission.** |
| 6 | Structured data | Add `Review` and `AggregateRating` to product schema **as soon as 5+ verified reviews exist** (post-launch week 4–8). | same `seo.ts` | New finding — strhost doesn't sell so hasn't faced this. |
| 7 | Content & semantic HTML | Each manual page is a 1,500–2,500 word sales page (not just a buy button). H1 = manual name; H2s for "what's inside" / "who it's for" / "what you'll learn" / "FAQ" / "refund" / "what others ask". Avoid duplicate-content suppression: each sales page must have unique narrative, not boilerplate substitutions. | `site/src/content/manuals/*.mdx` | strhost has thin-content risk on 46 lodging-tax pages (P1). **Don't ship 6 thin manual pages — write each one as a real sales page.** |
| 8 | Internal linking | Header has all 5 manuals + bundle + free magnet + about. Footer mirrors. Each manual page has a "you may also want" cross-sell to 1 related manual + bundle. Bundle page lists all 5 with anchor-link descriptions. | `Header.astro`, `Footer.astro`, `[slug].astro` |  |
| 9 | Performance | All islands (`BuyButton`, `EmailCapture`) use `client:visible` not `client:load`. Astro hybrid output mode chosen correctly (server only for `/api/*` endpoints; everything else SSG). Critical fonts preloaded with `font-display: swap`. | `site/src/components/*.astro`, `site/astro.config.mjs`, `site/src/styles/global.css` | strhost ships `client:load` on all 7 calculators (P1). **Don't repeat.** |
| 10 | Mobile / accessibility | Viewport set, `lang="en"`, semantic HTML, all form inputs labeled (`EmailCapture` aria-labels), buy button is a `<button>` not a `<div>`. | `Base.astro`, `EmailCapture.astro`, `BuyButton.astro` |  |
| 11 | Off-page / authority | Day-1 backlink: footer of thestrledger.com adds strmanuals.com. Day-1 social: at minimum a Pinterest pin per manual cover (the `dist/client/covers/*.svg` exist). Day-1 Reddit: ONE post per relevant subreddit announcing the launch, value-first not promo. | external | strhost has empty `sameAs[]` (P2). |
| 12 | Funnel hygiene | `/thank-you` is `noindex` (verify in `thank-you.astro` frontmatter). `/api/*` routes have `Cache-Control: no-store`. Stripe success URL parameter is HMAC-signed (already implemented per `hmac.ts`). | `site/src/pages/thank-you.astro`, `site/src/pages/api/*.ts`, `site/src/lib/hmac.ts` |  |
| 13 | Technical hygiene | HTTPS only (Hostinger default). Pick **trailing-slash convention** (recommend with-slash to match `@astrojs/sitemap` default) and update canonical builder to match — emit canonical with trailing slash on all non-root pages. | `site/astro.config.mjs`, `seo.ts` | strhost has canonical-no-slash + sitemap-with-slash inconsistency (P1). **Pick one before launch.** |
| 14 | Search Console | GA4 + Google Search Console verified at DNS or HTML-tag level on day 0. Bing Webmaster Tools too. Submit sitemap. | DNS / `Base.astro` | — |
| 15 | OG images | Per-manual OG image generated from manual frontmatter via Satori (or static SVGs already in `public/covers/`). Static `/og-default.png` fallback referenced in `Base.astro` so every page has an OG even if dynamic generation fails. | `site/scripts/build-og.mjs` (not yet existing — optional), `site/public/og-default.png` | strhost's `build-og.mjs` swallows failures silently (P1). **Either fail loudly or ship a fallback.** |

---

## Prioritized action list

### P0 — before launch (drop the 503)

1. Add `Product` + `Offer` JSON-LD to every `/manuals/[slug]` page. Without this, paid PDFs cannot earn rich result eligibility — non-negotiable for an e-commerce site.
2. Add `BreadcrumbList` JSON-LD site-wide (don't repeat strhost's omission).
3. Add `Organization` JSON-LD with populated `sameAs[]` linking thestrledger.com + sister sites.
4. Custom `/404.astro` with cross-links to all 5 manuals + bundle + free magnet.
5. Robots.txt + sitemap.xml with all dynamic routes (manuals, regulations cities, blog, free magnet) — verify via local build before deploy.
6. Pick trailing-slash convention; update canonical URL builder to match sitemap output.
7. Switch all islands to `client:visible`.
8. Each manual sales page = unique 1,500–2,500 word sales narrative, not a stub. Same for bundle page.
9. Free magnet landing page `/free/str-tax-loophole-explainer` shipped with EmailCapture going through `/api/subscribe` → n8n → InfluencerSoft.
10. `/thank-you` confirmed `noindex`.
11. Day-1 LGL-01 programmatic: ship at least the top 25 city pages under `/regulations/[city]/`. Each unique 400–800 words + government source link + LGL-01 CTA.
12. GSC + Bing Webmaster verified, sitemap submitted.

### P1 — launch week

13. Ship 4 pillar blog posts: one per top-priority manual + one bundle comparison.
14. `FAQPage` JSON-LD on bundle and free-magnet pages.
15. Pinterest account + initial 6 pins (one per manual cover).
16. Backlink: thestrledger.com footer adds strmanuals.com.
17. Reddit: one announce post per subreddit, value-first.
18. Author page (`/about`) names Daniel Harrison, ties to thestrledger.com brand, lists publication credentials. Required for YMYL tax content.
19. Internal links: each manual page cross-sells to ONE related manual + bundle.

### P2 — post-launch (T+30 to T+90)

20. Expand LGL-01 programmatic: 25 → 50 cities.
21. `Review` + `AggregateRating` JSON-LD once 5+ verified-buyer reviews exist.
22. CPA reviewer credit on TAX-01 + TAX-02 (commission a paid review).
23. Comparison post: "STR Manuals vs. Hospitable Academy vs. AirBnB U" — high-intent transactional query.
24. Annual refresh of TAX-01 / TAX-02 for next tax year (2027 prep — Q4 2026).
25. First post-launch SEO audit at T+90 using strhost's SEO-AUDIT format as the template.

---

## Cadence / next checkpoints

| Date | Action |
|---|---|
| **2026-05-10** (today) | This doc. |
| **Pre-launch (T-7)** | Re-audit checklist §7 against built site before flipping 503 off. |
| **Launch day** | Submit sitemap to GSC; first crawl typically within 72h. |
| **T+14** | Check GSC for first impressions; verify all 5 manual pages indexed; verify rich-result eligibility for `Product` schema in GSC's Enhancements panel. |
| **T+30** | Mid-launch SEO health check (informal). Verify no broken sitemap entries; verify zero 5xx in GSC's Page indexing report. |
| **T+90** | First full post-launch SEO audit using the strhost.tools SEO-AUDIT format. Re-score each dimension. |
| **T+180** | Annual TAX-01/TAX-02 refresh prep (locked-in 2027 tax-year content updates ship by January). |

---

## Appendix A — competitor map (source-grounded)

| Competitor | URL pattern | Owns | Counter angle for STRManuals |
|---|---|---|---|
| TheRealEstateCPA | therealestatecpa.com/blog/short-term-rental-tax-loophole | "str tax loophole" head term | Not our buyer (their buyer wants $2k+ engagement). Concede. |
| KeeperTax | keepertax.com/posts/short-term-rental-tax-loophole | "str loophole 2025-2026" | Out-publish on long-tail, not head. |
| WCG | wcginc.com/blog/short-term-rental-tax-loophole | "str loophole high w-2 income" | Same — flank with action keywords. |
| Abode Cost Seg | abodecostseg.com/str-tax-loophole | bonus depreciation cluster | Long-tail flank. |
| Hiltzik CPA | hiltzikcpa.com/material-participation-short-term-rental-100-hour-rule | "100 hour rule" | Direct competitor for TAX-02 head term. Out-publish + stronger CTA. |
| Madsen CPA | madsencpa.com/material-participation-short-term-rental | material participation | Same as Hiltzik. |
| Semi-Retired MD | semiretiredmd.com/material-participation-for-a-short-term-rental | "activities that count" | Long-tail flank. |
| AirDNA | airdna.co/blog/why-is-my-airbnb-not-getting-bookings + /airbnb-bookings-down | REV-01 entire cluster | Outwrite as diagnostic-only (no SaaS pitch). |
| Lodgify | lodgify.com/guides/direct-booking-website + /airbnb-host-guide | REV-02 + bundle informational | Outwrite as decision-focused (no PMS pitch). |
| Hostfully | hostfully.com/blog/get-direct-bookings-vacation-rental | REV-02 mid-tier | Long-tail flank. |
| Uplisting | uplisting.io/blog/how-to-launch-a-direct-booking-website-in-minutes | REV-02 long-tail | Same. |
| Tabivista | tabivista.com/blog/how-to-get-direct-bookings-airbnb-host | REV-02 2026-tagged | Same. |
| RedAwning | redawning.com/pm/post/how-to-build-a-direct-booking-website | REV-02 mid-tier | Same. |
| PriceLabs | hello.pricelabs.co/how-to-generate-direct-bookings | REV-02 + REV-01 | Same. |
| Hostaway | hostaway.com/blog/generate-direct-bookings | REV-02 | Same. Their "you can lose your account" angle is REV-02's wedge — own that fear. |
| nlc.org | nlc.org/resource/short-term-rental-regulations | LGL-01 national | Concede national term; own per-city + research-framework. |
| guestable | guestable.com/blog/short-term-rentals-los-angeles | per-city LGL-01 | Direct competitor on city pages. Outwrite per city. |
| HomeTeam Luxury | hometeamluxuryrentals.com/blog/california-short-term-rental-regulations | per-state LGL-01 | Same. |
| BnbTools / Artfultemplates / BnbLabs / MammaMode | various Etsy + Shopify | bundle (different product = templates) | Different category — comparison post positions STRManuals as "decisions, not templates." |
| Reddit (r/AirBnB, r/AirBnBHosts, r/RealEstateInvesting, r/tax) | reddit.com/r/* | informational + "bookings down" + "loophole" | Author-presence strategy: participate, link long-form when relevant. |
| Time, NewSilver, T2C Online | various | "airbnb collapse" doom | Concede — different intent (news, not solution). |

---

## Appendix B — what's already in good shape

- **Single-platform email** (InfluencerSoft via n8n per `CLAUDE.md:27`) — no Postmark/ConvertKit fragmentation.
- **HMAC-signed download links** with 24h expiry (per `CLAUDE.md:27` and `site/src/lib/hmac.ts`) — secure-by-default.
- **Per-buyer pdf-lib watermarking at stream time** — anti-piracy without breaking SEO (downloads are post-purchase, not crawled).
- **Manuscripts already drafted for all 6 SKUs.** No content blocker — ready to typeset.
- **Cluster brand recognition** via thestrledger.com + 4 sister sites — low-cost backlink layer ready to wire on day 1.
- **Tag dictionary** already specified per `CLAUDE.md:38-46` — buyer-journey analytics will work day 1, not retrofitted.

---

*End of keyword research.*
