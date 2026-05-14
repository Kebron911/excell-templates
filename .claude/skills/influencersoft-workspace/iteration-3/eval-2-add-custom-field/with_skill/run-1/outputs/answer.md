# Adding 'referral_source' Custom Field — Pre-Flight Checklist

## Critical Things to Know Before Adding

### 1. **Refresh Between Each Add (Gotcha #2)**
After you create the custom field, **refresh the Custom Fields page** before adding another one. InfluencerSoft holds stale validation errors in the UI and will report the WRONG collision field if you don't refresh. If you only plan to add one field, you can skip this, but it's good practice.

**Path:** `Contacts → Custom Fields` → Create field → Refresh the page when done.

### 2. **Slug Collision Risk**
IS rejects names that share a **prefix** with existing custom fields. Before adding `referral_source`, check:
- Existing fields in your account at `Contacts → Custom Fields`
- Use a distinct stem to avoid collision (e.g., if you have `referral_date`, `referral_source` shares the `referral_*` prefix, which IS may reject)

**Workaround:** If collision occurs, use a longer distinct name like `referral_traffic_source` or follow stems in the [manual-setup-guide](../../../../../../../infrastructure/influencersoft/manual-setup-guide.md) Part 2.

### 3. **Field Name Rules**
- Use **lowercase** with **underscores** (snake_case), not spaces or hyphens
- Keep it short and distinct from existing fields
- `referral_source` is good — clear, unique, no collision risk with common IS fields

### 4. **API / Tag Dictionary Alignment**
Once created, add the field name to your project's tag dictionary / field registry:
- File: `infrastructure/influencersoft/manual-setup-guide.md` Part 2 (custom field list)
- Ensures consistency across API calls, automations, and team documentation
- Prevents duplicate field creation later

### 5. **Field Type & Display**
Decide on the field type **before** creating:
- **Text** — referral source names (e.g., "Google", "Facebook", "Referral Partner Name")
- **Number** — if tracking referral ID or count
- **Dropdown** — if you have a fixed list of referral sources (recommended for consistency)

**Dropdown is cleaner** for reporting and filtering later.

### 6. **Contacts Already in System**
New custom fields are **empty by default** for existing contacts. You'll need to:
- Backfill via API (`AddUpdateLead`) with CSV/bulk import, or
- Leave empty and populate on next contact interaction

---

## Quick Checklist Before Clicking "Create"

- [ ] Check existing custom fields at `Contacts → Custom Fields`
- [ ] Confirm `referral_source` doesn't collide with existing field prefixes
- [ ] Decide: Text, Number, or Dropdown?
- [ ] Have a list of values ready (if Dropdown)
- [ ] Plan backfill strategy for existing contacts (if needed)
- [ ] Document the field in your team's tag dictionary afterward

---

## After Creation

1. **Refresh the page** (best practice, avoids Gotcha #2 on next add)
2. **Test via API** — call `AddUpdateLead` with the new field to verify it accepts data
3. **Add to documentation** — update `manual-setup-guide.md` Part 2

No other gotchas unique to custom fields — you're good to go!
