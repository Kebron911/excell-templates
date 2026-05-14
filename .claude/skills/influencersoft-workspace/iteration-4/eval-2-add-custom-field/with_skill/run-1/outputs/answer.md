# Adding 'referral_source' Custom Field in InfluencerSoft

## Pre-flight checklist

Before you add this custom field, be aware of these gotchas and best practices:

### 1. **Naming convention** (critical)
   - Your proposed name `referral_source` follows the correct pattern: **lowercase, underscores for word separation**.
   - InfluencerSoft custom fields require **lowercase only** and are case-sensitive when called via API or automation.
   - If this field will be written by scripts or n8n workflows, reference the exact spelling from this documentation.

### 2. **UI refresh required**
   - After adding a custom field at `Contacts → Custom Fields`, **you MUST refresh the page** before adding another one.
   - The IS interface doesn't auto-sync the field list — stale cache can cause duplicate creation attempts or invisible failures.
   - Best practice: add field → wait 3 seconds → refresh → verify it appears in the list.

### 3. **Prefix collision check**
   - IS rejects custom field names that collide with **existing system prefixes** (e.g., `customer:*`, `product:*`, `source:*`).
   - Your name `referral_source` does NOT collide with system namespace prefixes, so it should be safe.
   - However, if you plan to use this field's value in tag-based logic (e.g., `referral_source:etsy`, `referral_source:affiliate`), consider whether those should be **separate custom fields** or **tags** instead (see section 5 below).

### 4. **Tag vs. custom field — which to use?**
   - **Use a custom field** if: you want to store free-form text (e.g., "referral_source: John Smith's newsletter"), you need to query/filter on it without creating tags, or it won't drive sequence automation.
   - **Use a tag** if: the field drives sequence triggers, you want to group contacts by predefined categories, or you need fast filtering/gating in processes.
   - **Hybrid approach:** use a custom field to capture the raw input (e.g., form submission source), then use n8n to map it to standardized tags (e.g., `source:etsy`, `source:affiliate:john-smith`).

### 5. **If this field will be automated**
   - If scripts, webhooks, or n8n will **write** to `referral_source`, add the field name as a constant to `scripts/lib/influencersoft.mjs` for consistency.
   - If it will **trigger sequences**, confirm the field value meets tag naming rules (lowercase, colon for namespace, hyphen for word separation — see `infrastructure/influencersoft/tag-dictionary.md` §6).

### 6. **API considerations**
   - Custom fields are accessible via the `AddUpdateLead` API endpoint.
   - When passing via API, use the exact field name: `referral_source` (case-sensitive).
   - If the API call fails to write the field, check that the field exists in IS first (refresh after creation).

### 7. **Backup + audit trail**
   - IS doesn't natively version custom field definitions. If you need audit history, document the add date/time in `infrastructure/influencersoft/custom-fields.md` (create if missing).
   - Deleting a custom field will orphan any data in that field for existing contacts.

---

## Recommended workflow

1. **Create the field** at `Contacts → Custom Fields`.
2. **Refresh the page** (Ctrl+Shift+R or Cmd+Shift+R).
3. **Verify** the field appears in the contacts list or edit form.
4. **If automating:** add the field name to `scripts/lib/influencersoft.mjs` + document in tag-dictionary.md if it will be used for tag-based logic.
5. **Test with one contact** to confirm data persists across page reloads.

---

## Summary

**Your proposed name `referral_source` is safe and follows conventions.** 
- No naming conflicts.
- Clear purpose.
- Easy to query and automate.

Just remember: **refresh after creation**, and clarify whether this field will be purely informational or will drive tag-based logic in sequences.
