# Skill vs Guide Comparison

**Skill:** `.claude/skills/influencersoft/` (8 files, iteration 2)
**Guide:** `scrape-influencersoft/guide-md/` (206 screens, 35 endpoints)
**Auditor model:** claude-sonnet-4-6
**Date:** 2026-05-14

---

## Summary

- **9 accuracy errors found** (wrong menu paths, wrong endpoint naming convention, missing API distinction, wrong module characterization)
- **8 significant gaps found** (whole module missing, Email Series absent, Rules missing, Broadcasts missing, dedicated IP, reCAPTCHA, Automatic rules, Website chapter scope)
- **8 pieces of project-specific knowledge to preserve** (kebron tenant, tag namespace, custom field slugs, paste order, AddGood gating, MD5 hash impl, rate limit enforcement, push_products.js)

---

## Per-file findings

---

### SKILL.md

#### Accuracy errors

**A1 — Wrong menu path for Process module (critical)**
- Skill (SKILL.md §2 decision tree, §3 module quick map): `Automation → Process`
- Guide (06-automation.md §Where to find it): `Tasks → Processes` and `Tasks → Automatic rules`
- The guide's automation chapter explicitly states the top menu entry is `Tasks`, not `Automation`. The word "Automation" appears only as a section heading within the chapter, and as `Automation → Task` for a sub-view. The primary path to Processes is `Tasks → Processes`.

**A2 — Wrong menu path for Sequences (minor — singular vs plural)**
- Skill (SKILL.md §3 module quick map): `Campaigns → Sequence`
- Guide (05-campaigns.md §Where to find it): `Campaigns → Sequences` (plural)
- Also confirmed in guide screen label: "Screen: Sequences list (Campaigns → Sequences)"

**A3 — Sequences described as "linear email autoresponders" — misleading**
- Skill (SKILL.md §3 module quick map): characterizes Sequences as "Linear email autoresponders"
- Guide (05-campaigns.md Terminology): "Sequence: A visual flowchart of triggers, actions, emails, and A/B branches that runs for leads on a chosen list." The linear drip-chain product is called **Email Series** (`Campaigns → Email Series`), not Sequences. Sequences are the visual flowchart product.
- Impact: if a user asks "how do I build an email drip sequence triggered on subscription," the skill may point them to the wrong product.

#### Gaps

**G1 — Email Series (`Campaigns → Email Series`) entirely absent**
- The guide (05-campaigns.md) documents Email Series as a distinct product from Sequences: linear chains tied to list subscription, with interval spacing and an "Inseparable chain" lock to prevent broadcast interruption. The skill conflates this with Sequences. Email Series has its own analytics path (`Campaigns → Analytics of Automatic Email`) referenced in reports-analytics.md §3 but never explained.

**G2 — Broadcasts (`Campaigns → Broadcasts`) entirely absent from SKILL.md and modules.md**
- Guide (05-campaigns.md): Broadcasts are one-time blasts to subscriber lists, with their own analytics and spam-check pre-send option. The skill has no mention in the decision tree or module map.

**G3 — Automatic Rules (`Tasks → Automatic rules`) absent**
- Guide (06-automation.md): Rules are single trigger-to-action mappings, simpler than Processes and non-multi-step. The skill only acknowledges "Process" under automation. Rules are a distinct primitive with a separate menu item.

#### Skill-specific knowledge to preserve

None unique in SKILL.md beyond what is preserved in other files (decision tree routing, kebron tenant, tag-dictionary reference, AddGood gating warning, MD5 hash gotcha).

---

### modules.md

#### Accuracy errors

**A4 — Process module menu path wrong**
- Skill (modules.md §5 Process): `Automation → Process`
- Guide (06-automation.md §Where to find it): `Tasks → Processes`
- Same error as A1 above, repeated in the module map file.

**A5 — Sequences path: singular vs plural**
- Skill (modules.md §4 Sequences): path listed as `Campaigns → Sequence`
- Guide: `Campaigns → Sequences`

**A6 — Sequences mis-characterized as "Linear email autoresponders"**
- Skill (modules.md §4): "Linear email autoresponder chain tied to a list."
- Guide (05-campaigns.md): Sequences are visual flowchart automations. The linear product tied to list subscription is Email Series.

**A7 — Affiliates entry omits the "Advertise" module entirely**
- Skill (modules.md §8 Affiliates): path listed as `Affiliates → Offers`. This covers the *program owner* (Affiliates module). The guide also documents a separate **Advertise** top-menu module (`Top menu → Advertise`) — the *partner/affiliate view* — which is a wholly different screen (Partner's Cabinet) with its own left-nav (Offers, Leads, Orders, Referrals, Payments, Contact the Author). The skill presents only one side of the affiliate relationship.

#### Gaps

**G4 — Email Series module missing from the 11-module list**
- The skill lists 11 modules but treats Sequences and Email Series as the same thing. The guide treats Email Series (`Campaigns → Email Series`) as a distinct product. Either the skill needs a 12th entry, or it needs to correctly separate these two under the Campaigns umbrella.

**G5 — Advertise module (Partner's Cabinet) entirely absent**
- Guide (09-advertise.md): a full top-level module (`Top menu → Advertise`) with 20 screens and 16 tasks. The skill has no entry for this anywhere. If Daniel joins an affiliate program as a partner, he would have zero guidance.

**G6 — Website module severely understated**
- Skill (modules.md secondary surfaces §Website): one line: `Websites → Set up`
- Guide (02-website.md): 31 screens, 35 tasks including the Page Builder, domain management (custom domains, subdomains, DNS), file manager, popup blocks, webinar broadcast pages, auto-webinars, Blog, and the full SEO/social config. The Website chapter is the largest in the guide after Contacts.

**G7 — Calls / Meetings / CRM Settings absent**
- Guide (04-contacts.md §Where to find it): `Contacts → Calls`, `Contacts → Meetings`, `Contacts → Settings` (Additional lead fields, reCAPTCHA, call-center scripts). These are real screens with tasks. The skill's Contacts entry only mentions Leads, lists, tags, custom fields.

#### Skill-specific knowledge to preserve

- `modules.md §6 Mailing Settings`: the note that FBL is under `Campaigns → Settings → FBL` with the exact IMAP credential handoff to IS support — not in the guide.
- `modules.md §7 Courses`: "Lesson copy is linked not duplicated" warning — project-specific operational risk, absent from guide.
- `modules.md §11 Integrations & API`: "account footer → Integration and API" path for rpsKey — confirmed correct by guide, but the footer-link note is a useful UX detail not highlighted in the guide.

---

### api-quickref.md

#### Accuracy errors

**A8 — API 2.0 endpoint names use PascalCase in skill but guide documents them as lowercase**
- Skill (api-quickref.md §1 Primary endpoints table): `AddUpdateLead`, `AddTagToLead`, `RemoveTagFromLead`, `GetAllGroups`, `GetGoods`, `GetCoupons`, `CreateOrder`
- Guide (12-api-2-0.md §Conventions): endpoint names are explicitly listed as lowercase: `addtagtolead`, `addupdatelead`, `getpersonalmanagers`, `getcoupons`, `getalllists`, `getgoods`, `createorder`, `removeleadfromlist`, `removetagfromlead`
- **Nuance (important):** The API probe log (ops/influencersoft-api-probe.md 2026-05-11) confirmed live that lowercase `getalllists` 307-redirects to PascalCase `GetAllGroups`. The skill's gotchas.md §5 correctly notes this redirect behavior. So PascalCase *works* in practice, but the canonical names in the guide are lowercase. The skill should document both forms and note that the canonical guide form is lowercase.
- Additionally, the skill lists `GetAllGroups` but the guide's canonical endpoint name for that function is `getalllists` (redirects to `GetAllGroups` server-side). The skill should not present `GetAllGroups` as the endpoint name — it is the redirect destination, not the endpoint.

**A9 — API 2.0 rate limit claim**
- Skill (api-quickref.md §1 Sample call note, and SKILL.md §6 conventions): "≤0.9 req/sec (1100ms between calls)"
- Guide (12-api-2-0.md §Authentication): "Rate limits: not specified in source."
- The rate limit is project-specific convention (set by Daniel / client lib), not a documented IS platform limit. It should be clearly labeled as a *project convention*, not an IS-imposed rate limit, to avoid confusion.

#### Gaps

**G8 — `getpersonalmanagers` endpoint absent from skill**
- Guide (12-api-2-0.md §Conventions): lists `getpersonalmanagers` as a canonical API 2.0 endpoint.
- Skill (api-quickref.md §1): does not list this endpoint. Relevant if scripts need to assign a personal manager to a contact.

**G9 — `removeleadfromlist` endpoint absent from skill**
- Guide (12-api-2-0.md §Conventions): `removeleadfromlist` is a canonical endpoint.
- Skill (api-quickref.md §1): not listed. Important for cleanup workflows (removing contacts from lists after purchase, funnel exit, etc.).

**G10 — API 1.0 outbound webhook payload fields not fully documented**
- Guide (11-api-1-0.md §Script Notifications): the subscription notification payload includes `id_group`, `ip`, `status` (2=subscription, 1=activation), and full UTM array. The skill (api-quickref.md §6 Outbound webhook payload) covers some of this but does not distinguish the status codes (2 vs 1) or document the `id_group` field. These are needed to correctly route inbound webhook events.

**G11 — API 1.0 full endpoint inventory not reflected**
- Guide (11-api-1-0.md): documents 26 API 1.0 endpoints including `GetLeads`, `GetOrders`, `GetOrdersWithGoods`, `GetPartnerStats`, `UpdateSubscriberData`, `DeleteOrder`, `PostBackNotifications`. The skill (api-quickref.md §3) only mentions `AddGood`, `AddLeadToGroup`, `DeleteSubscribe`, `DeleteOrder` as the 1.0 endpoints to use. This is correct for the project's current use case but leaves no breadcrumb if someone needs read endpoints.

#### Skill-specific knowledge to preserve

- `api-quickref.md §3`: AddGood "error_code 2 endpoint disabled" gating warning with the exact support email and Tech Tuesday escalation path — not in guide.
- `api-quickref.md §3`: MD5 hash formula with PHP `http_build_query` encoding detail (spaces → `+`) — the guide documents the same formula but the skill's emphasis on the training-data confusion (HMAC vs MD5) is a valuable redundancy.
- `api-quickref.md §2`: Trigger tags → sequences pattern (tag fires sequence via IS UI binding) — project-specific operational model not documented in guide.
- `api-quickref.md §7`: "Never log full POST bodies — key leakage risk" — project-specific security policy, not from guide.

---

### gotchas.md

#### Accuracy errors

None found. All 33 gotchas are consistent with guide content or are project-specific observations beyond guide scope.

#### Gaps

**G12 — No gotcha for manually-added contacts cannot receive email**
- Guide (04-contacts.md Terminology): "Manually added contacts cannot be sent email through InfluencerSoft servers." This is a sharp edge: creating a contact via `Contacts → Create Contact` UI or API `AddUpdateLead` without subscription activation means they are not emailable. The gotchas.md does not explicitly call this out, though it is a very common confusion point.

**G13 — No gotcha for "Selected" template preservation on funnel delete**
- Guide (01-funnels.md Terminology): "Selected — saved-templates area where emails and pages survive funnel deletion; if items are not in Selected, deleting the funnel deletes them." This is a data-loss risk not flagged in gotchas.md.

**G14 — No gotcha for Filter result 5-minute expiry**
- Guide (04-contacts.md): "Filter results are stored for 5 minutes; if you wait longer before importing or grouping, re-filter or the action will run against the whole database." Critical for bulk operations on filtered contact sets.

#### Skill-specific knowledge to preserve

- gotchas.md §Critical #1–5: All project-validated. Especially the "lesson copy is linked" warning (gotcha #14) and the GDPR zombie-contact behavior (gotcha #26).
- gotchas.md §API gotchas: The 307-redirect PascalCase note (gotcha #5) is validated by live probe.
- gotchas.md #27: Process over-engineering warning sourced from founder live session — not in guide.

---

### ui-walkthrough.md

#### Accuracy errors

**A10 — Block type "Sales / Content" not in guide**
- Skill (ui-walkthrough.md §1 Block categories): lists "Sales / Content" as a page block type.
- Guide (01-funnels.md Terminology): lists "Content / Activation / Webinar page" as the generic page element category. The guide also lists: Opt-in, Double opt-in, Order, Payment, Upsell, Downsell, Webinar, Members Area, Any Page by URL, Thank You / Confirmation, and Countdown page. "Sales / Content" does not appear in the guide's enumeration.
- Minor: this may be a label difference in the UI at different account states, but worth flagging.

**A11 — "Payment" block listed separately from "Order" — guide distinguishes by payment processor**
- Skill (ui-walkthrough.md §1): lists both "Order" and "Payment" without explaining their difference.
- Guide (01-funnels.md Terminology): "Order page — page element used with PayPal: routes to PayPal for payment. Payment page — page element used with Stripe: takes card payment without leaving the page." This distinction is critical for checkout configuration and is missing from the skill.

#### Gaps

**G15 — Countdown page block absent**
- Guide (01-funnels.md Terminology): "Countdown page — page element with a pre-installed Timer widget; can be used as either a selling or a payment page." Not listed in ui-walkthrough.md §1 block categories.

**G16 — Custom block (stage marker) absent**
- Guide (01-funnels.md Terminology): "Custom block — user-defined action element with no settings beyond a name and icon, used as a stage marker." Not in skill.

**G17 — Traffic source types not fully enumerated**
- Skill (ui-walkthrough.md §1 Block categories → Traffic): lists "Facebook, YouTube, AdWords, generic"
- Guide (01-funnels.md): lists AdWords, YouTube, Affiliates, Facebook, Instagram, WhatsApp, Email, CPA, and generic Source — 9 types vs the skill's 4.

**G18 — Dynamic variables (`{$ name}`, `{$ email}`, `#nextpage`) absent**
- Guide (01-funnels.md Terminology): documents dynamic variable placeholders in exit-point links and `#nextpage` for in-funnel routing. These are used in order form pre-fill and upsell routing. The skill only mentions `#upsell_yes` / `#upsell_no` (correctly) but not the general dynamic variable system.

**G19 — "Selected" saved-templates area not mentioned**
- Guide: pages/emails saved to "Selected" survive funnel deletion; items not in Selected are destroyed with the funnel. The ui-walkthrough.md has no mention of the Selected area.

#### Skill-specific knowledge to preserve

- ui-walkthrough.md §7 HEAD code placement: `Websites → Set up → More` path for GA/Meta/TikTok pixels — project-validated, more actionable than guide's generic description.
- ui-walkthrough.md §6 A/B testing — 3 levels: split at canvas, page, and widget level — correct per guide structure, good synthesis.
- ui-walkthrough.md §8 Calendar/booking: IS-native booking block note — minor, project-specific operational preference.

---

### deliverability.md

#### Accuracy errors

None found. DKIM/SPF/DMARC descriptions, FBL setup steps, auto-clean threshold (15 emails / 45 days), and vCard details all match the guide (05-campaigns.md).

#### Gaps

**G20 — Dedicated IP option not mentioned**
- Guide (05-campaigns.md): "How do I get a Dedicated IP" is a documented task — a deliverability option where IS provisions a dedicated sending IP for accounts with volume. Not mentioned in deliverability.md.

**G21 — "Inseparable chain" lock not mentioned**
- Guide (05-campaigns.md Terminology): Email Series segments can be marked "Inseparable chain" (green exclamation icon) so that broadcasts cannot interrupt them for that subscriber. Relevant to deliverability planning but absent from the skill.

**G22 — `Test the distribution for spam` pre-send check absent**
- Guide (05-campaigns.md): a pre-send spam check is available from the broadcast send screen. A practical deliverability step not documented.

#### Skill-specific knowledge to preserve

- deliverability.md §6 List hygiene during sequence migration: the STR Ledger-specific onboarding pattern (probe → identify hard-bounce list → suppress before switching) — not in guide.
- deliverability.md §8 Escalation: Sharice-Marie / Tech Tuesday screen-share for live DKIM config — project relationship knowledge.
- deliverability.md §3 FBL setup: the brand-new mailbox requirement and IS auto-delete behavior — guide states this but the skill's framing ("CRITICAL: IS auto-deletes all incoming mail") is clearer.

---

### reports-analytics.md

#### Accuracy errors

**A12 — "Sales Statistics" report path may be imprecise**
- Skill (reports-analytics.md §2): lists path as `Reports → Sales Statistics`
- Guide (10-reports.md §Where to find it): "Top menu → Analytics → Sales Report" is an alternative entry that opens on every login; the primary path listed is `Top menu → Reports` and then the Sales Statistics page. The guide also notes "Sales Report" and "Sales Statistics" are used interchangeably. Not a hard error but the skill should note the dual path.

#### Gaps

**G23 — Sales Department Statistics report absent from skill**
- Guide (10-reports.md): `Reports → Sales Department` — per-manager sales statistics with a sub-page for "Payments to the managers." The skill's §2 table omits this entirely.

**G24 — UTM campaign builder (`Reports → New Campaign`) absent**
- Guide (10-reports.md §Where to find it): `Reports → New Campaign` — a UTM-tag builder for generating tagged links. This is a report-adjacent tool the skill does not mention.

**G25 — "Statistics via Email" (scheduled delivery) absent**
- Guide (10-reports.md): `Reports → Subscription statistics → Statistics via Email` — schedules email delivery of subscription stats. Not in skill.

**G26 — Cohort analysis absent**
- Guide (10-reports.md Terminology): "Cohort — A group of contacts who entered a funnel within the same period of time; compared against each other in cohort analysis." The Sales Funnel Analytics report includes a Cohorts tab. Not mentioned in the skill.

#### Skill-specific knowledge to preserve

- reports-analytics.md §7 "Which report answers which question" table — an excellent synthesis not present in the guide. Keep as-is.
- reports-analytics.md §8 Limitations: the "no cross-funnel rollup" and "no real-time data" caveats — project-validated operational notes.

---

### plans-and-support.md

#### Accuracy errors

None found. The AppSumo LTD tier comparison table, Tech Tuesday details, and support escalation order all appear consistent with available guide data (the guide does not document plans directly; this is tribal/AppSumo knowledge, so no contradictions are possible from guide comparison).

#### Gaps

**G27 — reCAPTCHA configuration absent from skill entirely**
- Guide (04-contacts.md §Where to find it): `Contacts → Settings → reCAPTCHA` — Google invisible reCAPTCHA requiring Site key and Secret key. Protects all subscription and order forms. No plan gate mentioned but this is a setup step relevant to any tier. Not in plans-and-support.md or any skill file.

**G28 — API access enabling prerequisite absent**
- Guide (11-api-1-0.md §Account access gate): Before API can be used, account must have API access enabled via written request to IS Support with subject "Enabling the API in Your Account." Subscription/order forms must include "Read and Agreed with the Offer Contract" checkbox. Over-clocking can result in account block "without possibility of recovery or appeal." This is a hard prerequisite not mentioned in plans-and-support.md or api-quickref.md.

#### Skill-specific knowledge to preserve

- plans-and-support.md §1 tier table: the specific T1/T2/T3 contact and email limits, whitelabel cost equivalents, and 1:1 counseling gate — not in guide.
- plans-and-support.md §5 Tech Tuesday: Sharice-Marie identity, screen-share capability, dashboard countdown timer — project-specific relationship knowledge.
- plans-and-support.md §4 Hitting a limit: the specific escalation to support@influencersoft.com for endpoint gating — project-validated.

---

## Top 5 highest-priority fixes

Ranked by user-impact (which fix prevents the most user-visible errors):

**#1 — Fix `Automation → Process` → `Tasks → Processes` everywhere (A1, A4)**
- Affects: SKILL.md §2 decision tree, SKILL.md §3 module quick map, modules.md §5
- Impact: User follows wrong path, can't find Process screen at all. Highest confusion potential.
- Fix: Replace every instance of `Automation → Process` with `Tasks → Processes`.

**#2 — Separate Sequences from Email Series; fix Sequences description (A3, A6, G1, G4)**
- Affects: SKILL.md §3, modules.md §4, SKILL.md decision tree
- Impact: User building a drip chain on subscription gets routed to Sequences (visual flowchart) instead of Email Series (linear drip). Wrong product entirely.
- Fix: Add Email Series as a distinct entry. Change Sequences description to "Visual flowchart automation (trigger-based)." Add Email Series as "Linear drip chain tied to list subscription."

**#3 — Add API 2.0 endpoint lowercase canonical names; flag rate limit as project convention (A8, A9)**
- Affects: api-quickref.md §1
- Impact: Scripts calling PascalCase forms may work (via redirect) but scripts reading guide docs will be confused. Rate limit as "IS-imposed" is misleading.
- Fix: Add a note that guide canonical names are lowercase; PascalCase redirects work (confirmed). Add "project convention, not IS-imposed" label to the 1100ms rate limit.

**#4 — Add `Campaigns → Sequences` plural correction and `Campaigns → Broadcasts` to decision tree (A2, A5, G2)**
- Affects: SKILL.md §3, modules.md §4, SKILL.md decision tree
- Impact: Singular path may cause navigation failure. Broadcasts omission means the skill gives no guidance on one-time email blasts.
- Fix: Correct plural. Add Broadcasts branch to decision tree: "Send a one-time email blast → `Campaigns → Broadcasts`."

**#5 — Add missing API 2.0 endpoints: `removeleadfromlist`, `getpersonalmanagers` (G8, G9)**
- Affects: api-quickref.md §1
- Impact: Scripts needing list removal or manager assignment have no guidance and may try to re-derive or use wrong endpoint.
- Fix: Add both to the Primary endpoints table in api-quickref.md §1.

---

## Recommended additions (new content blocks)

Prioritized by coverage gap size:

**1. Email Series block in modules.md and SKILL.md decision tree**
- `Campaigns → Email Series` — linear drip chain on list subscription, separate from Sequences.
- Distinguish: Email Series = interval-based, triggered by list join. Sequences = event-triggered visual flowchart.

**2. Advertise module entry in modules.md**
- `Top menu → Advertise` — Partner's Cabinet; where Daniel joins/monitors affiliate programs as a partner.
- Include: Offers, Promotional Drafts, Leads/Orders tracking, Payments view.

**3. Broadcasts branch in SKILL.md decision tree**
```
├── Send a one-time email blast?
│   └── Campaigns → Broadcasts → compose → select list → schedule/send now
```

**4. Missing API 2.0 endpoints table rows in api-quickref.md**
```
| `removeleadfromlist` | not yet wrapped | Remove contact from a list by email + list ID. |
| `getpersonalmanagers` | not yet wrapped | List all personal managers (for assignment workflows). |
```

**5. gotchas.md additions (3 new entries)**
- Gotcha #34: "Manually-added contacts cannot receive email — they must subscribe/activate first."
- Gotcha #35: "Deleting a funnel destroys all its pages/emails unless you first save them to 'Selected.'"
- Gotcha #36: "Contact filter results expire in 5 minutes — re-filter before bulk operations."

**6. API prerequisite block in api-quickref.md §0 or plans-and-support.md**
- Document the written-request process to enable API access, the "Offer Contract" checkbox requirement, and the account-block risk from over-clocking.

**7. Dedicated IP deliverability option in deliverability.md**
- Add §9: "Dedicated IP — for high-volume senders. Request via support@influencersoft.com or Tech Tuesday. Available at higher send volumes; IS provisions and warms the IP."

**8. Traffic source full list in ui-walkthrough.md §1**
- Expand Traffic block types from 4 (FB, YT, AdWords, generic) to 9: add Instagram, WhatsApp, Email, CPA, Affiliates.
- Add note on Order-page vs Payment-page distinction (PayPal vs Stripe).
