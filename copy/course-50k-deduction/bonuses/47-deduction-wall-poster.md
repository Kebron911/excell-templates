# Bonus B9 — The 47-Deduction Wall Poster

**Format:** Print-at-home PDF (18×24" tabloid) + 11×14" small variant + digital wallpaper
**Course module:** Cross-cutting (lives near the host's desk)
**Use case:** Single-page visual reference of all 47 deductions, on the wall, in the line of sight

> **The hosts who run the system have it on the wall.** Not in a folder. Not buried in a workbook. Pinned above the desk where the receipt photographing happens.
>
> This poster is the operator's pegboard. Forty-seven deductions, organized by category, each with its Schedule E line and the workbook tab that captures it. Glance at it Saturday morning and the seven-minute tab gets a half-minute faster.

---

## Specs

| Field | Value |
|---|---|
| **Dimensions (primary)** | 18 × 24 inches (US tabloid / "small poster") |
| **Dimensions (small variant)** | 11 × 14 inches (frame-friendly) |
| **Dimensions (digital)** | 2880 × 1800 px (desktop wallpaper) + 1440 × 2560 px (phone) |
| **Color profile** | CMYK for print; sRGB for digital |
| **Bleed** | 0.125" on all edges (print versions) |
| **Page count** | 1 page, single-sided |
| **Format export** | PDF/X-1a:2001 (print), PDF (digital), PNG (digital) |
| **Build tool** | Vista Create (or Figma → PDF export) |

---

## Brand spec

| Element | Value |
|---|---|
| Background | Parchment `#F6EFE2` |
| Headline / display | Cormorant Garamond Medium |
| Body | Inter 400 (12 pt poster body, 9 pt deduction-row body) |
| Mono accents | JetBrains Mono (Schedule E line numbers, code citations) |
| Primary ink | Harbor Navy `#12304E` |
| Accent | Muted Gold `#C9A24B` (rules, pull-quote, "47") |
| Watermark | Monogram bottom-right, ~8% opacity |
| Footer | "*The STR Ledger — Run your rentals before they run you.*" |

---

## Layout

The poster is divided into ten sections on a 6-column grid:

```
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   THE FORTY-SEVEN.                                                │
│   ───────                                                          │
│   Every deduction a short-term rental host should be claiming,    │
│   organized by where it lives in the tax code. Pinned to your wall │
│   so the next receipt knows where to go.                           │
│                                                                   │
│  ╔═══════════════════════════════════╤══════════════════════════╗ │
│  ║ I. THE RECURRING TEN              │ II. REPAIRS & CAPITAL    ║ │
│  ║ Operating expenses                 │ §263(a) BAR test         ║ │
│  ║                                    │                          ║ │
│  ║  1. Cleaner pay          Sched E 7 │ 14. Routine repairs   14 ║ │
│  ║  2. Cleaning supplies         17   │ 15. Routine maintenance 14║ │
│  ║  3. Property utilities        17   │ 16. Component replace.  14║ │
│  ║  4. Internet / cable          17   │ 17. Building MACRS 27.5 18║ │
│  ║  5. Trash                     17   │ 18. Improvements MACRS  18║ │
│  ║  6. Lawn / snow / pest        17   │                          ║ │
│  ║  7. Pool / hot tub            17   │                          ║ │
│  ║  8. Security monitoring       17   │                          ║ │
│  ║  9. HOA dues                  17   │                          ║ │
│  ║ 10. Property mgmt fee         11   │                          ║ │
│  ║ 11. Mortgage interest         12   │                          ║ │
│  ║ 12. Property tax              16   │                          ║ │
│  ║ 13. Insurance                  9   │                          ║ │
│  ╠═══════════════════════════════════╧══════════════════════════╣ │
│  ║ III. ACCELERATION & COST SEG                                   ║ │
│  ║ §168(k) bonus, §179, §1.263(a)-3                              ║ │
│  ║                                                                ║ │
│  ║ 19. Cost-seg 5-year        ─────────  20. Cost-seg 7-year     ║ │
│  ║ 21. Cost-seg 15-year       ─────────  22. §168(k) bonus dep.  ║ │
│  ║ 23. §179 expensing         ─────────  24. §179 nonresid.      ║ │
│  ║                                                                ║ │
│  ║ 25. Bonus on reclassed assets                                  ║ │
│  ╠════════════════════════════════════════════════════════════════╣ │
│  ║ IV. TRAVEL · MEALS · VEHICLE     │ V. PLATFORMS & SOFTWARE     ║ │
│  ║ §274(d) substantiation            │ §162                       ║ │
│  ║                                   │                            ║ │
│  ║ 26. Mileage standard rate    6    │ 31. Airbnb / VRBO fees  19 ║ │
│  ║ 27. Vehicle actual method    6    │ 32. PMS subscriptions   19 ║ │
│  ║ 28. Per-diem meals          19    │ 33. Pricing software    19 ║ │
│  ║ 29. Lodging — repair trip   19    │ 34. Payment processing  19 ║ │
│  ║ 30. Tolls / parking          6    │                            ║ │
│  ╠══════════════════════════════════╪════════════════════════════╣ │
│  ║ VI. PROFESSIONAL SERVICES         │ VII. HOME OFFICE           ║ │
│  ║                                   │ §280A(c)                   ║ │
│  ║ 35. CPA / EA tax prep       10    │                            ║ │
│  ║ 36. Bookkeeping             10    │ 39. Simplified method   19 ║ │
│  ║ 37. Legal — entity / dispute 10   │ 40. Actual method  Form 8829║ │
│  ║ 38. 1099 contractors      7/19    │                            ║ │
│  ╠══════════════════════════════════╪════════════════════════════╣ │
│  ║ VIII. INSURANCE & ENTITY          │ IX. MARKETING & ED          ║ │
│  ║                                   │                            ║ │
│  ║ 41. Property insurance       9    │ 44. Listing photography  8 ║ │
│  ║ 42. Umbrella (allocated)     9    │ 45. Welcome book / amen. 19║ │
│  ║ 43. Entity costs            19    │ 46. Education / courses 19 ║ │
│  ╠══════════════════════════════════╧════════════════════════════╣ │
│  ║ X. THE EDGE                                                    ║ │
│  ║ §280A(g)                                                       ║ │
│  ║                                                                ║ │
│  ║ 47. Augusta Rule — 14-day rental of personal residence         ║ │
│  ║                                                                ║ │
│  ╚════════════════════════════════════════════════════════════════╝ │
│                                                                   │
│   THE RECORDKEEPING PACT                                          │
│   ─────────                                                        │
│   ONE.  Log it as you go. (§6001)                                 │
│   TWO.  Keep the supporting documents. (§274(d))                  │
│   THREE.Back it up. One workbook. One cloud. One local.           │
│                                                                   │
│   ────                                                              │
│   The STR Ledger.                                                 │
│   Run your rentals before they run you.                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Section design details

### Title block (top)

```
THE FORTY-SEVEN.
   ↑ "47" rendered in Muted Gold, Cormorant Medium 96 pt
   ↑ Period rendered in Muted Gold (book's signature mark)
```

Subtitle in Cormorant Italic 18 pt, Graphite at 80%.

### Deduction rows

Each row formatted as:

```
  [#]. [Name]                              [§ line]
  ──┬──        ──┬──                        ──┬──
   8 pt mono   13 pt Inter 400               9 pt mono
   gold        navy ink                      gold

```

Subtle gold dotted leader between name and Schedule E line for readability.

### Section headers

Section headers (`I. THE RECURRING TEN`) in Inter Bold small caps 11 pt, navy ink, with a 1pt gold rule beneath. Subhead in Cormorant Italic 9 pt with code citation in JetBrains Mono.

### Recordkeeping Pact (bottom block)

The three rules from the book's front matter, set in Cormorant Medium 14 pt with the numbers in Muted Gold. Visually anchors the poster — it's the rule everything else points at.

### Footer

Brand boilerplate:

```
The STR Ledger.    Run your rentals before they run you.
                     ↑ Cormorant Italic 11 pt
                     ↑ tagline subdued
```

Monogram (parchment-on-navy variant) in bottom-right, ~8% opacity.

---

## Three variants to ship

### Variant A — Reference poster (primary)

The 18×24" wall poster as specified above. The version 90% of buyers will print or hang.

### Variant B — Frame-friendly small (11×14")

Same content, scaled. Slightly tighter typography. Fits a $20 frame from any home-goods store.

Difference from A: deductions in 8 pt body instead of 9 pt; Recordkeeping Pact moves to a single line at the bottom instead of a 3-line block.

### Variant C — Digital wallpaper

Two ratios:

- **Desktop** (2880 × 1800 px) — the poster as a desktop wallpaper. Deduction grid takes the left two-thirds; the right third is blank for desktop icons.
- **Phone** (1440 × 2560 px) — vertical layout, 2-column deduction grid, Recordkeeping Pact at the very bottom.

Used by hosts who don't print but want the visual anchor on a screen they look at constantly.

---

## Distribution

| Tier | What they get |
|---|---|
| **Self-Study course** | All 3 variants as digital downloads (PDF + PNG) |
| **Cohort tier** | All 3 variants digital + a physical 18×24" print mailed at enrollment |
| **Done-With-You tier** | All of the above + a framed 11×14" with the host's portfolio name foil-stamped on the bottom |

The mailed print is a brand moment — it arrives in a tube within 7 days of enrollment with a handwritten card. Cost ≈ $18 per buyer (print + tube + shipping) for a $997 purchase. Ratio is right.

---

## Print specs (for the mailed version)

| Field | Value |
|---|---|
| Paper | 100lb matte cover stock |
| Print process | Digital offset (Printful, MOO, or local) |
| Finish | Matte, no lamination (reduces glare on a wall) |
| Tube | 24" mailing tube with end caps |
| Insert | A handwritten card with course welcome line |
| Vendor recommendations | Printful (drop-ship integration), Smartpress (better quality, manual order), local print shop |

---

## Quality checks before printing

- [ ] All 47 deductions present and correctly numbered
- [ ] Each deduction's Schedule E line matches the book's Appendix A
- [ ] Code citations match the book's chapter content
- [ ] Muted Gold renders correctly after CMYK conversion (no muddy result)
- [ ] Harbor Navy holds depth on parchment background
- [ ] Body text is legible at 4 feet (test by hanging on a wall and walking back)
- [ ] No live type within 0.25" of trim
- [ ] Bleed extends 0.125" past trim
- [ ] Type converted to outlines on export

---

## A/B variants (optional, post-launch)

After v1 ships, three poster variants worth testing:

1. **The Audit-Ready edition** — 47 deductions + the audit-dossier folder map down the right side
2. **The Augusta-Plus edition** — adds a §280A(g) sidebar (for hosts who want to lean into the entity-rental angle)
3. **The Bookkeeper's edition** — adds Schedule E line totals for "average" and "well-run" portfolios (anonymized aggregate data) so hosts can sanity-check their own numbers

Decision gate: ship v1, see what hosts pin first, then build the variant most-asked-for.

---

## Why this exists

The poster is the only physical artifact of the course that lives in the host's environment 365 days a year. Every other deliverable lives in a workbook or a video library — surfaces the host opens deliberately. The poster is a passive surface that surfaces the system at every glance.

It's also the most photographable artifact. Cohort buyers post it on Instagram. Pinterest pins of "my STR setup" feature it. The brand surface compounds.

---

## File outputs

```
/08-poster/
   master-18x24.pdf                ← print-ready, with bleed
   master-18x24.png                ← digital, no bleed
   small-11x14.pdf                 ← print-ready, with bleed
   small-11x14.png                 ← digital, no bleed
   wallpaper-desktop-2880x1800.png ← digital
   wallpaper-phone-1440x2560.png   ← digital
   print-vendor-readme.md          ← Printful + Smartpress upload instructions
```

---

*Last reviewed: 2026-04-28. The 47 deductions reflect the book's Vol. 01 outline; if a future tax-law change adds or removes a deduction, the poster will be reissued with a version stamp.*
