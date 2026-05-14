# Adding 'referral_source' Custom Field in InfluencerSoft

## Yes — critical things to know:

### 1. **Prefix-Slug Collision Risk** (CRITICAL)
InfluencerSoft rejects custom field names that share a **prefix** with any existing field. Your name `referral_source` is safe IF no other field starts with `referral_`.

**Existing fields in your instance:**
- `sku_code`, `sku_label`, `bought_on`, `order_ref`, `xsell_name`, `xsell_url`, `pack_name`

None of these start with `referral_`, so you're clear. However, if you add more fields in future, use **short distinct stems** to avoid collisions.

### 2. **Stale UI Error Bug**
If you try to add a field and hit a collision error, the form will hold that error even after you fix the name and try again. The error message may not reflect your current attempt — it shows the LAST collision instead.

**Fix:** Always **refresh the Custom Fields page** between each field addition attempt.

### 3. **Menu Path**
Go to: **Contacts → Custom Fields** (in IS UI)

### 4. **Convention: Short Stems**
The project standardizes on short, distinct stems: `sku_`, `bought_`, `order_`, `xsell_`, `pack_`. Your `referral_source` is longer than the convention. Consider:
- `ref_src` (matches the short-stem style)
- `source_ref` (alternative prefix)

The longer name is valid, but shorter stems reduce future collision risk if you add `referral_status`, `referral_date`, etc. later.

### 5. **If You Rename Later**
Custom field names map to API tokens across all email sequences and automation scripts. If you ever rename this field, you'll need to update:
- All `.md` files in `copy/email-sequences/`
- Every reference in `scripts/is-*.mjs`

**Recommendation:** Pick the name carefully now.

---

## Summary
**Before adding `referral_source`:**
- ✅ Check for prefix collisions (you're safe with existing fields)
- ✅ Decide if you want the shorter `ref_src` instead
- ✅ Plan for field naming consistency if you'll add related fields later

**When adding:**
- Use **Contacts → Custom Fields**
- Refresh the page between attempts if you hit an error
- Test that it's accessible in the contact record
