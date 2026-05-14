# Adding 'referral_source' Custom Field to InfluencerSoft

## Critical things to know BEFORE you add this field:

### 1. **InfluencerSoft uses POSITIONAL indexing (not named indexing)**
- Custom fields are referenced in email merge tags as `{$leadExfield[N]}` where N is the field's **position** in the Contacts → Custom Fields admin list
- Example: if `referral_source` is the 8th custom field, it becomes `{$leadExfield[8]}`

### 2. **DELETING OR RE-ADDING A FIELD SILENTLY BREAKS ALL EMAIL TEMPLATES THAT REFERENCE IT**
- When you delete a custom field and re-add it, it gets a NEW position/index
- Every email template using the old `{$leadExfield[N]}` tag will now reference the wrong field (or nothing)
- **Mitigation:** Only ADD new fields at the END of the list. NEVER delete and re-add.

### 3. **Add at the end of the current list**
Currently (verified 2026-05-13) you have 7 custom fields:
1. `sku_code`
2. `sku_label`
3. `bought_on`
4. `order_ref`
5. `xsell_name`
6. `xsell_url`
7. `pack_name`

Your `referral_source` will be **index 8**.

### 4. **Update the custom-fields.yaml source of truth**
Once you add `referral_source` in the UI:
- Add it to `infrastructure/influencersoft/custom-fields.yaml` with `index: 8`
- Document the type (text? dropdown? boolean?)
- Record the `is_token` and `liquid_token` format
- Add an example value (e.g., "organic-search", "paid-ad", "referral", "direct")

### 5. **Is referral_source already needed in any sequences?**
Check your email sequence drafts (`copy/email-sequences/`) for any reference to a referral/source field:
- If yes, be sure to test the merge tag after adding the field
- If you're adding it just for future tracking (and it's not used in current sequences), no merge-tag risk — but still update the YAML

### 6. **Data type matters for filtering and reporting**
Decide upfront:
- **Text:** "organic-search", "paid-linkedin-ad", "twitter-referral" (freeform, flexible)
- **Dropdown:** Pre-defined options in UI, cleaner for reporting and filtering
- **Text + use tags instead:** Tag the contact with `source:organic-search` instead of a custom field (integrates better with InfluencerSoft's tag-based automation)

### 7. **Test the merge tag before using it in production sequences**
If you plan to use `{$leadExfield[8]}` or equivalent in email templates:
1. Create a test contact with a value for `referral_source`
2. Paste it into a draft email
3. Preview to confirm it renders correctly (IS sometimes silently renders empty if the field key doesn't match)

## Checklist before adding:

- [ ] Confirm you're adding at **index 8** (end of current list)
- [ ] Decide: text field, dropdown, or use tags instead?
- [ ] After adding in UI, update `infrastructure/influencersoft/custom-fields.yaml`
- [ ] Check if any sequences need this field as a merge tag
- [ ] Test with a contact if using it in email templates
- [ ] **Never delete this field later** — if you no longer need it, leave it empty but keep it in position

## Reference: Current custom-fields.yaml (as of 2026-05-13)
See `infrastructure/influencersoft/custom-fields.yaml` — it's the source of truth and will need the new entry appended.
