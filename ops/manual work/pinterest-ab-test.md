# Pinterest Voice A/B Test — Tracking Log

**Test window:** 2026-04-24 → 2026-06-23 (60 days minimum)
**Decision date:** 2026-06-23 (extend if impression threshold not met)
**Protocol source of truth:** `brand/brand-decisions.md` §6.4
**Primary metric:** outbound CTR (outbound clicks ÷ impressions)
**Decision rule:** challenger becomes Pinterest default if it beats control by **≥15% on outbound CTR**. Otherwise warning/solution baseline holds and challenger retires.

---

## How to use this log

1. Ship pins in **matched pairs** — same design, topic, product link, publish window. Only headline + first description line differ.
2. Tag each pin `control` (§6.1 warning/solution) or `challenger` (upbeat).
3. Pull Pinterest analytics every Monday. Record impressions, outbound clicks, saves per pin.
4. Compute outbound CTR = outbound clicks ÷ impressions.
5. **Do not edit pin copy mid-test.** Pulling underperformers early invalidates the data. Let both sides run the full window.
6. Need ≥1,000 impressions per variant before calling. Extend the window if the threshold isn't met by 2026-06-23.

---

## Matched-pair tagline inventory

From brand-decisions §6.4:

| Campaign | Control (warning) | Challenger (upbeat) |
|---|---|---|
| Tax season | Close your year before April does. | Your cleanest tax season yet — built in a weekend. |
| Operations | Turnover chaos has a spreadsheet. | Calm turnovers, every time. |
| Guest experience | The welcome-book gap that costs 5-star reviews. | Welcome books that earn 5-stars. |

Note: for Guest experience the **challenger** is the existing §2 canonical tagline; the control was drafted to complete the pair.

---

## Pin log

One row per pin. Each matched pair = two rows sharing a `Pair ID`.

| Pair ID | Pin ID | Variant | Campaign | Published | Impressions | Outbound clicks | Saves | Outbound CTR | Notes |
|---|---|---|---|---|---|---|---|---|---|
| _(first pair pending — add on publish)_ | | | | | | | | | |

---

## Weekly rollup

Update every Monday. Roll up totals across all live pins, grouped by variant.

| Week ending | Control impressions | Control outbound CTR | Challenger impressions | Challenger outbound CTR | Lift (challenger − control, pp) | Notes |
|---|---|---|---|---|---|---|
| _(no data yet)_ | | | | | | |

---

## Outcome checklist

- [ ] ≥60 days elapsed (earliest 2026-06-23)
- [ ] ≥1,000 impressions per variant
- [ ] Decision rule applied against rollup
- [ ] ADR written to `docs/superpowers/specs/` recording winner + margin
- [ ] §6.1 amended if challenger wins (Pinterest carve-out)
- [ ] §6.4 block removed from `brand/brand-decisions.md`
- [ ] Version-bump `brand/brand-decisions.md` header to v1.2
