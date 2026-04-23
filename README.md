# The STR Ledger

> *Run your rentals before they run you.*

Business-grade Excel financial and operational systems for short-term rental (Airbnb/VRBO) hosts. Anchored on a tax-and-financial beachhead, distributed through a multi-storefront network (Etsy, Gumroad, own site), compounded by email, affiliates, and community. Designed to run 95% automated end to end.

**Live at:** [thestrledger.com](https://thestrledger.com)

## Repository layout

```
brand/
  brand-decisions.md       ← locked brand identity (name, palette, type, voice)
  assets/                  ← logo exports + Canva outputs (produced per Task 0.5)
copy/                      ← user-facing drafts (Etsy, email, blog, Pinterest, FB)
docs/
  runbooks/                ← ops procedures
  superpowers/
    specs/
      2026-04-22-str-tax-platform-design.md   ← master strategy design
    plans/
      2026-04-22-weeks-1-8-launch.md          ← weeks 1-8 execution plan
      2026-04-22-brand-substitution.md        ← brand token substitution pass
infrastructure/
  airtable/schema.md       ← Airtable base schema
  n8n/                     ← n8n workflow specs
ops/
  credentials-inventory.md
  user-manual-todo.md      ← Daniel's human action checklist
templates/                 ← Excel template briefs + specs (one folder per SKU)
```

## Current status

- **Brand:** locked — The STR Ledger / thestrledger.com
- **Niche:** Short-Term Rental hosts
- **Beachhead:** STR tax & financial templates
- **Primary persona:** Semi-Pro Sarah (3–10 properties)
- **Hub:** Influencersoft + Stripe Tax + Ghost blog at `blog.thestrledger.com`
- **SSOT:** Airtable → Postgres (Phase 3)
- **Automation:** n8n self-hosted at `n8n.thestrledger.com`, Claude over MCP
- **Launch sequence:** Etsy-MVP in Weeks 1–2, full stack by Week 8

See [the master strategy](docs/superpowers/specs/2026-04-22-str-tax-platform-design.md) and [the locked brand](brand/brand-decisions.md).
