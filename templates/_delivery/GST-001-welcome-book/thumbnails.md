# Thumbnail Specs — GST-001 Welcome Book

All 5 inherit the Task-3 thumbnail master (2000×2000, built in Vista Create). Daniel duplicates the master in Vista Create and swaps copy/mockup per image. Exports as 2000×2000 PNG.

**Reference:** `brand/canva-specs.md` Asset 3 (Thumbnail Master) — zone coordinates locked there. Zones numbered 1–6 (top strip, headline, mockup slot, sub-headline, format badge, bottom strip).

---

## Thumbnail 1 — Hero

**Vista Create steps:** Duplicate master → rename "GST-001-thumb-1-hero".

**Swaps:**
- Zone 3 (mockup slot, 1200×900): iPad-landscape mockup (Vista Create → Elements → "minimal iPad landscape mockup" tag "clean white device"). Layer a screenshot of the Welcome Book Sheet 1 PDF onto the iPad screen (Daniel first exports the xlsx → PDF, captures Sheet 1 as PNG, layers).
- Zone 2 (headline): `Welcome Book for Serious Airbnb Hosts` (Cormorant Garamond Medium ~72pt, Harbor Navy #12304E, 2 lines)
- Zone 4 (sub-headline): `Editable Excel + PDF · Instant Download` (Inter Semibold 28pt, Graphite #2B2B2B)
- Zone 5 (format badge): "EDITABLE EXCEL + PDF" — keep default Muted Gold pill

**Export:** `thumb-1.png` (2000×2000 PNG, transparent bg not required — navy/parchment strips are solid)

---

## Thumbnail 2 — What's inside (9-tab grid)

**Vista Create steps:** Duplicate master → rename "GST-001-thumb-2-tabs".

**Swaps:**
- Zone 3: 3×3 grid of 9 mini-screenshots (Daniel exports each tab to PDF, captures PNG). Labels under each in small Inter Regular 14pt pill: "Welcome", "Arrival", "WiFi + Tech", "House Rules", "Local Guide", "Trash", "Departure", "Emergency", "Host (hidden)"
- Zone 2: `9 Sections. Pre-Formatted. Editable.` (Cormorant Medium ~64pt)
- Zone 4: `Everything your guests need — on their terms` (Inter Semibold 22pt)

**Export:** `thumb-2.png`

---

## Thumbnail 3 — Before / After

**Swaps:**
- Zone 3 split vertically 50/50:
  - LEFT: screenshot of a messy, unstyled Google Doc (Daniel builds a fake "welcome book" in Google Docs — ugly, single paragraph, bad formatting, ~5 min). Overlay label "BEFORE" in Clay Rose #B5725E pill.
  - RIGHT: screenshot of Welcome Book Sheet 1 from the generated xlsx, styled. Overlay "AFTER" in Muted Gold #C9A24B pill.
- Zone 2: `Stop Emailing Guests Google Docs.` (Cormorant Medium 68pt)
- Zone 4: `You're running a business. Your welcome book should look like it.` (Inter Semibold 26pt)

**Export:** `thumb-3.png`

---

## Thumbnail 4 — Print OR digital

**Swaps:**
- Zone 3 split vertically 50/50:
  - LEFT: Vista Create "printed spiral book mockup" Element. Layer Sheet 1 onto cover.
  - RIGHT: Vista Create "iphone mockup" Element. Layer a QR code Element on the phone screen (Vista Create → Elements → QR code, set URL to `thestrledger.com/47` or leave generic for MVP).
- Zone 2: `Print It. Frame It. QR It.` (Cormorant Medium 72pt)
- Zone 4: `Use it how you want — it's your file.` (Inter Regular 26pt, Graphite #2B2B2B)

**Export:** `thumb-4.png`

---

## Thumbnail 5 — What's included (tan content card)

**Swaps:**
- Zone 3: REPLACE mockup with a tan (Clay Rose #B5725E, 70% opacity) rounded-rect card, 60px padding, containing:
  ```
  ✓ Fully editable Excel workbook (9 tabs)
  ✓ Matching PDF + print-ready layout
  ✓ Host-only reference tab (hide before sharing)
  ✓ Dropdowns + data validation built in
  ✓ QR-code-ready OR printed OR digital
  ✓ Bonus: emergency contacts worksheet
  ✓ Lifetime updates — it's yours forever
  ```
  Font: Inter Semibold 28pt, Harbor Navy #12304E text, 60px padding, 10px line-height between bullets
- Zone 2: `What You Get` (Cormorant Medium 84pt)
- Zone 4: `Opens in Excel 2016+, Excel 365, Google Sheets` (Inter Regular 22pt)

**Export:** `thumb-5.png`

---

## Preview image (optional for MVP)

Wider version — 2000×1500 (Etsy listing preview aspect). Same as thumb-1 content, re-exported from the same Vista Create design resized.

**Export:** `preview.png` — OK to skip for MVP launch; add post-first-sale.

---

## Daniel checklist

- [ ] Export Welcome Book xlsx → PDF (File → Save As → PDF, all visible tabs)
- [ ] Capture each sheet as PNG (screenshot or PDF page → PNG)
- [ ] Duplicate Task-3 thumbnail master in Vista Create 5×
- [ ] Build thumbs 1–5 per specs above (~12 min each)
- [ ] Export all 5 PNGs to `templates/_delivery/GST-001-welcome-book/`
- [ ] (Optional) Build preview image
- [ ] Commit
