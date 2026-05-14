# InfluencerSoft Reports & Analytics

Where to find every metric in the platform. Beyond the funnel canvas overlay
(magic button → top-right of any canvas), IS has a dedicated **Reports**
top-level menu plus per-module analytics under **Campaigns**, **Affiliates**,
and **Courses**.

## 1. Funnel canvas overlay (the fastest view)

**Path:** Open any funnel → click the **statistics icon (magic button)** at
top-right of the canvas.

- Overlays real-time numbers on every block: page views, opt-ins, orders,
  conversion %
- Best for "what's working" at-a-glance
- Per-block stats also visible by clicking a block

## 2. Reports module (dedicated)

**Path:** `Reports` (top-level menu)

| Report | Menu path | KPIs |
|---|---|---|
| **Sales Funnel Analytics** | `Reports → Sales Funnel Analytics` | Subscription activation rate, email open/click within sequence, bill processed → bill paid conversion. Includes **Cohorts tab** — groups contacts by funnel-entry period for cohort comparison. |
| **Sales Statistics (Sales Report)** | `Reports → Sales Statistics` (alt: `Top menu → Analytics → Sales Report`) | Total revenue, order count, product-level sales, per-funnel profitability. Dual entry: both paths open the same report. |
| **Subscription Statistics** | `Reports → Subscription Statistics` | List growth, total subscriber count, segmentation breakdown. Sub-page: **Statistics via Email** — schedule automatic email delivery of this report. |
| **Advertising Efficiency** | `Reports → Advertising (The Efficiency of the Advertising Campaign)` | ROI per channel (FB / YouTube / AdWords / Instagram / etc.) by UTM; most profitable traffic source. |
| **Sales Department Statistics** | `Reports → Sales Department` | Per-manager sales stats + sub-page for "Payments to the managers." |
| **Expenses Import** | `Reports → How to Import Expenses into your Reports` | Upload external costs (ad spend) to compute true net profit. |
| **UTM Campaign Builder** | `Reports → New Campaign` | Generate UTM-tagged links for campaigns. Not a report per se — a link builder that feeds into Advertising Efficiency. |

## 3. Email + sequence analytics

**Path:** `Campaigns → Analytics of Automatic Email` or `Campaigns → Broadcasts Message Analytics`

- Real-time per-email metrics: opens, clicks, unsubscribes, spam complaints
- Granular: sequence-level + per-step
- Use for diagnosing slow openers, finding the email in a sequence where
  drop-off happens

## 4. Affiliate analytics

**Path:** `Affiliates → Affiliate Management and Reporting`

- Per-partner: clicks generated, earnings, payout history
- Identifies most/least productive affiliates
- Leaderboard view

## 5. Course / student analytics

**Path:** `Courses → Reports`

- "Lesson opened" vs "Lesson completed" counts
- Homework status (New / Accepted / Rejected) — click status to jump to
  student card
- Per-course completion rates
- Per-student progress

## 6. External analytics integrations

In addition to native reports, push event data out via the HEAD code field:

- **Google Analytics (Universal Analytics):** paste GA script in
  `Websites → Set up → More → Add HEAD code`. Auto-tracks e-commerce
  transactions, quantities, time-to-purchase.
- **Facebook Pixel:** same HEAD code mechanism per-funnel or site-wide
- **External tracking ("Any Page by URL" block):** for WordPress, Calendly,
  ThriveCart — pulls those visitors into IS funnel analytics via `Click.js`

## 7. Which report answers which question

| Question | Where |
|---|---|
| "Why are my opt-ins low?" | Funnel canvas overlay — see drop-off block |
| "Which ad source converts best?" | Reports → Advertising Efficiency |
| "Which email in my sequence is killing engagement?" | Campaigns → Analytics of Automatic Email |
| "Did my latest broadcast hit the inbox?" | Campaigns → Broadcasts Message Analytics |
| "Who are my top 3 affiliates this month?" | Affiliates → Management and Reporting |
| "What % of students finish my course?" | Courses → Reports |
| "What's my net profit on this funnel?" | Reports → Sales Statistics + Expenses Import |
| "Is my list growing or shrinking?" | Reports → Subscription Statistics |
| "How do cohorts from different months compare in this funnel?" | Reports → Sales Funnel Analytics → Cohorts tab |
| "Get this report emailed to me weekly?" | Reports → Subscription Statistics → Statistics via Email |
| "Create UTM-tagged links for a new ad campaign?" | Reports → New Campaign |
| "How is my sales team performing?" | Reports → Sales Department |

## 8. Limitations

- No native real-time dashboard combining all KPIs (you assemble from above)
- No export of canvas overlay numbers (must screenshot or use raw report)
- Cohort analysis IS available natively via the Cohorts tab in Sales Funnel
  Analytics — push to GA/BigQuery only for multi-funnel cross-cohort work
