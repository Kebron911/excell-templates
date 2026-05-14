# InfluencerSoft Plans, Limits, and Support

Daniel's current tier: **Tier 3 (Influencer)** (LTD redeemed via AppSumo;
tenant `kebron.influencersoft.com`).

## 1. AppSumo LTD tier comparison

| Feature | Tier 1 (Starter) | Tier 2 (Professional) | Tier 3 (Influencer) |
|---|---|---|---|
| Contacts | 10,000 – 25,000 | 100,000 | 100,000+ |
| Emails / month | 10,000 – 250,000 | 1,000,000 | 1,000,000 |
| Funnels | 50 | 1,000 | **Unlimited** |
| Websites | 3 | 1,000 | **Unlimited** |
| Custom domains | 1 | 3 | **Unlimited** |
| Team users | 5 | 15 | 25 – **Unlimited** |
| Courses | Basic | 50 course funnels | **Unlimited** |
| Tracked visitors / month | 1 million | 1 million | 1 million |
| Affiliate program | Not included | Included | Included |
| Whitelabel | No | Yes ($97/mo equiv) | Yes ($177/mo equiv) |
| 1:1 strategic counseling | No | No | Yes (Enterprise tier) |

**T3 is most LTD buyers' "smart move"** — unlimited funnels/websites/users
for the same one-time price.

## 2. What "tracked visitors" means

The 1M cap applies to anonymous traffic counted by `Click.js` on landing
pages and the "Any Page by URL" external tracker. Authenticated CRM
contacts are separately counted in the contacts limit.

## 3. Per-feature plan gates

- **Affiliate program** = T2+
- **Whitelabel** (remove IS branding from email templates) = T2+
- **Unlimited funnels** = T3
- **Unlimited team users** = T3 (top variant)
- **Enterprise 1:1 counseling** = paid custom tier above T3

## 4. Hitting a limit — what to do

| Limit hit | Symptom | Action |
|---|---|---|
| Contacts | Can't add new lead, API returns `error_code` | Run auto-clean (deliverability.md §4); enable `do-not-email` suppression on dormant tags; upgrade if needed |
| Emails/month | Sequence stalls mid-month | Audit volume in `Reports → Subscription Statistics`; reduce broadcast frequency or upgrade |
| Funnels | Can't create new funnel | Archive unused funnels (move to "Inactive" state); upgrade if you legitimately need more |
| Team users | Can't add new manager | Reuse existing manager assignment via `getpersonalmanagers` |

## 5. Support channels

### Tech Tuesday (weekly mentoring live call)
- **Host:** Sharice-Marie
- **Format:** can take over your screen via remote-share to fix technical
  setup issues directly
- **When:** Weekly (timer on Dashboard countdown to next call)
- **Use for:** DKIM/SPF/DMARC + FBL configuration, API key generation,
  custom-field collision debugging, sequence-trigger binding, anything UI

### Influencer Business First Class (strategy)
- Bonus tier mentoring (offered with higher LTD purchases)
- Format: 1-hour strategy call
- Use for: business model + funnel design + offer creation (not technical
  troubleshooting)

### Startup Checklist
- **Path:** Dashboard (main landing)
- 4-step mandatory walkthrough — prevents getting overwhelmed by 11 modules
- Re-runnable anytime — useful to verify setup is complete

### 15-minute Discovery Consult
- Offered to new users in first few weeks
- Format: introductory call
- Skip if you're past onboarding (Daniel is)

### Email support
- `support@influencersoft.com`
- Use for: API endpoint enablement (e.g. `AddGood` gating), billing,
  account issues
- Response time: business hours; not real-time

### Help portal
- `help.influencersoft.com`
- Separate sections for API 1.0 and API 2.0
- Use for: written reference; some articles are placeholders (skim before
  relying)

## 6. Escalation order (when to use what)

1. **Skill files first** — answer 95% of routine questions
2. **NotebookLM escape hatch** ([SKILL.md §9](SKILL.md)) — for edge cases
3. **help.influencersoft.com** — official written reference
4. **Tech Tuesday** — technical configuration issues
5. **support@influencersoft.com** — account / billing / endpoint gating
6. **Daniel asks Sharice-Marie directly** — relationship-based path for
   anything urgent

## 7. reCAPTCHA setup

To protect opt-in forms from bot submissions, IS supports Google reCAPTCHA.

**Path:** `Contacts → Settings` → reCAPTCHA section

**Setup steps:**
1. Go to `google.com/recaptcha` → register your IS domain.
2. Get your **Site Key** and **Secret Key**.
3. In IS: `Contacts → Settings` → paste both keys into the reCAPTCHA fields.
4. Save. reCAPTCHA will appear on all opt-in forms site-wide.

**Note:** reCAPTCHA v2 ("I'm not a robot" checkbox) is the tested version.
Confirm the current supported version at `help.influencersoft.com` if IS
has updated to v3.

## 8. Renewal / upgrade

- LTD = lifetime; no recurring payment for the redeemed tier
- Upgrades available at AppSumo (if they re-list deal) or directly from IS
- "All upgrades at cost" benefit on Enterprise tier (rare)
