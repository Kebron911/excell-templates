# InfluencerSoft Gotchas, Tips, and Common Mistakes

Synthesized from 27 sources in the project NotebookLM notebook: founder live
session (SAAS Saturdays), "6 months later" user review, AppSumo reviews, blog
reviews, and official IS help docs. Cross-check with
[ops/influencersoft-api-probe.md §5](../../../ops/influencersoft-api-probe.md)
for API-level risks already documented.

Each row: **gotcha → why → how to apply.**

## Critical — surface immediately

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 1 | Renaming a trigger tag silently breaks the sequence | Sequences bind by exact string in IS UI; IS just mirrors whatever strings you send | Pull every tag string from [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md). Add new tags rather than renaming. |
| 2 | Custom-field slug collision + stale UI error | IS rejects names sharing prefix with existing fields; the form holds STALE error from prior attempt and reports the LAST already-existing field as the collision | Refresh the Custom Fields page between each add. Use the short distinct stems in [manual-setup-guide.md Part 2](../../../ops/manual%20work/influencersoft-manual-setup-guide.md). |
| 3 | Lesson "copy" is linked, not duplicated | Copying a course doesn't duplicate the lessons — they remain pointers to the original | If you want an independent copy, create the lesson from scratch. Edits to a copied lesson mutate the original course. |
| 4 | FBL mailbox must be brand new | IS auto-deletes all incoming mail after processing — reusing a live mailbox WIPES it | Provision a fresh mailbox (e.g. `fbl@kebron-domain.com`) before configuring FBL. See [deliverability.md](deliverability.md) §FBL. |
| 5 | PascalCase endpoint names | `getalllists` 307-redirects to `GetAllGroups`; lowercase fails on some methods | Use [client lib](../../../scripts/lib/influencersoft.mjs) helpers — they're already PascalCase. If writing raw fetch, use PascalCase. |
| 6 | Manually-added contacts cannot receive email | Creating a contact via UI "Create Contact" or API `AddUpdateLead` without going through a subscription/activation flow marks them non-emailable | To send email to a contact, they must subscribe via an opt-in form or be activated via the double opt-in link. Manual creation alone is not enough. |

## Email deliverability

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 6 | DMARC will reject Gmail/Yahoo "From" addresses | IS checks DMARC compliance; free-domain senders bounce | Always use a corporate domain (`@thestrledger.com`, `@kebron-domain.com`). |
| 7 | New sender emails are dead until confirmed | IS sends a confirmation link to the new sender mailbox; ignored = sequence silently fails to send | After adding a sender, immediately log into that mailbox and click the link. |
| 8 | Auto-clean removes unengaged subscribers | IS optional setting deletes subscribers who haven't opened 15 emails in 45 days | Enable for sender-reputation hygiene (per founder advice). Re-engage with `win-back` sequence before they hit the threshold. |
| 9 | DKIM/SPF/DMARC must be in DNS | Without these, deliverability tanks regardless of how good your content is | Configure DNS records in your domain registrar's panel; IS docs at `help.influencersoft.com` walk through it. |

## Funnel and page building

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 10 | No "mobile editing toggle" | The page builder can't simply switch views and edit per-device | Copy a section; set one to Desktop-only and the other to Mobile-only; reformat each independently. |
| 11 | `Click.js` script missing → silent affiliate tracking failure | The script is what parses UTM tags + sets cookies tying clicks to partners | Paste the snippet from `Affiliates → Offers` into the `<HEAD>` tag of every external landing page (WordPress, Calendly, etc.). |
| 12 | Upsell variables are special | One-click charging requires exact button variable names | Use `#upsell_yes` (charge + advance) and `#upsell_no` (refuse + downsell). `#nextpage` for normal navigation. |
| 13 | Note blocks for documentation | Don't put inline comments in JSON — the canvas has a Note action block | Drag a Note block onto the canvas to leave context for yourself or teammates. |
| 13a | "Selected" area — emails/pages NOT in Selected are deleted with the funnel | "Selected" is a saved-templates area. Items moved to Selected survive funnel deletion. Items left only inside a funnel are destroyed when the funnel is deleted. | Before deleting a funnel, move any reusable emails or pages to Selected. See [ui-walkthrough.md](ui-walkthrough.md) §5a. |
| 14 | Internal screenshots as block icons | IS auto-captures your page screenshots to show as flowchart icons | Re-edit a page → the icon updates. Useful for visually distinguishing similar pages. |

## E-commerce

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 15 | No "add-to-cart" | IS is single-product-funnel-first | Use bumps + upsells + downsells. For true cart, integrate external (Shopify) or accept the limitation. |
| 16 | PayPal integration is "wacky" | Routes to external page, not on-page | Stripe is the smoother path. If you need PayPal, expect a separate checkout step. |
| 17 | `CreateOrder` is irreversible | Real invoice generated on call — affects accounting | NEVER call during integration tests without `order_status=Cancel` or a test contact. |
| 18 | `AddGood` may be disabled | Per-account gating; returns `error_code 2` | Contact `support@influencersoft.com` or Tech Tuesday. Bulk script ready to run once enabled. |

## Tagging and segmentation

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 19 | Tags are case-sensitive and auto-create on first use | No pre-create endpoint; whatever string you send creates the tag verbatim (case included) | Stick strictly to [tag-dictionary.md](../../../infrastructure/influencersoft/tag-dictionary.md) — typos or case drift create orphan tags. |
| 20 | Tags don't trigger sequences retroactively for sequences that aren't bound to that tag | Sequence trigger is configured in UI; API can't "fire" a sequence directly | The trigger is set in UI, FIRED by API tagging — bind first, tag second. |
| 21 | List IDs are opaque numerics | E.g. `1594725950.5982672784` — you can't guess them | Call `GetAllGroups` once after creating lists in UI; cache in `infrastructure/influencersoft/lists.yaml` via `scripts/is-probe.mjs`. |
| 21a | Filter results expire in 5 minutes | When you apply a filter on the Contacts screen, the resulting set is held for only 5 minutes before expiring | Apply the filter, then immediately act (import, group, tag). If you wait >5 min, re-run the filter — otherwise the bulk action runs against the full database. |
| 22 | Behavioral segmenting pattern | Marketing automation tip from founder | When a purchase succeeds, in a Process block: ADD buyer tag AND REMOVE from retargeting list in one move. |

## Courses / LMS

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 23 | "Star" a course → 2-cell prominence | Hidden UI feature in student dashboard | Click star icon to make a course occupy 2 cells instead of 1 — for new releases. |
| 24 | Double-click a tag deselects all | Hidden UI feature | In the student dashboard, double-click a tag to show all courses again. |
| 25 | Homework auto-vs-manual | Lessons can require "learner completed assignment" — gates next lesson | Set in lesson settings → "Lesson completed if" → "the learner completed the assignment". Auto-accept available in global LMS settings. |

## GDPR + data

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 26 | "Delete contact" leaves a zombie | GDPR-compliant anonymization — replaces identity with `delete123@example.com` placeholder | Don't expect the count to drop. Use `do-not-email` tag to suppress instead, or accept the zombie state. |

## Process module / automation

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 27 | Don't over-engineer Process flows | Founder explicitly warns: massive Process = harder to debug | Prefer linear Sequences when possible. Reach for Process only when branching is essential. |

## API + integrations

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 28 | Rate limit is project convention, not IS-imposed | IS docs don't publish a rate limit; the 1100ms throttle is Daniel's conservative choice | Client lib enforces ≤0.9 req/sec. Batch where possible (one `AddUpdateLead` with CSV tags/lists = one call, not N). |
| 29 | API 1.0 hash auth needs PHP-compatible encoding | `http_build_query()` style — spaces become `+`, not `%20` | Reuse the impl in `infrastructure/influencersoft/push_products.js`. Don't re-derive. |
| 30 | "Add Tag to Lead" in Zapier fails if lead doesn't exist | API quirk — sequencing matters | Always `Add/Update Lead` BEFORE `Add Tag to Lead` in a Zap chain. |

## Platform quirks

| # | Gotcha | Why | How to apply |
|---|---|---|---|
| 31 | UI feels "dated" / "2004 SCADA" | IS was built for EU/Russian market 8+ years ago | Don't expect modern UX. Stick to documented paths — improvisation often hits translation quirks. |
| 32 | Supports Latin + Cyrillic characters in tags | Multi-language origin | Stick to lowercase Latin per tag-dictionary rules — Cyrillic technically works but breaks naming conventions. |
| 33 | "Funnel templates" catalog has named templates | Not just blank canvas | Use `Funnels → My Funnels → Catalog` → pick Simple Webinar / Free Book / Product Launch / Calendar Booking / Digital Summit / Evergreen Webinar / SLO. See [ui-walkthrough.md](ui-walkthrough.md). |

## What to never do

- Never log full POST bodies (`rpsKey` leaks via request logs)
- Never call `CreateOrder` during integration tests without `Cancel` status
- Never use free-domain senders (Gmail/Yahoo) — bounces guaranteed
- Never bulk-fire tagged contacts faster than 0.9 req/sec
- Never rename a trigger tag without re-binding the sequence in IS UI
- Never assume a list ID — always resolve via `GetAllGroups`
- Never use `git add -A` near `.env` (key leakage)
