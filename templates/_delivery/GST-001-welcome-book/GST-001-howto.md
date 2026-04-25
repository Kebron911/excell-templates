# GST-001 Welcome Book — How to Use (v2.2)

You got three files:

1. `GST-001-welcome-book-DEMO.xlsx` — a fully-filled example you can look at to see what "done" looks like.
2. `GST-001-welcome-book-BLANK.xlsx` — what you'll fill in for your own property.
3. `welcome-book-renderer.html` — opens in your browser and turns the xlsx into a beautiful printable PDF.

**Keep all three files in the same folder** — the renderer looks for the xlsx in the same folder as itself.

---

## Step 1 — Fill the BLANK xlsx

Open `GST-001-welcome-book-BLANK.xlsx` in Excel (or Google Sheets).

- Start on the **Start** tab. Read the overview. Click `GET STARTED →` to jump to the first input tab.
- Fill the 9 input sections — Property, Arrival, WiFi + Tech, House Rules, Local Guide, Trash, Departure, Safety & Disclosures, Emergency. The Start tab tracks your progress live.
- The **Safety & Disclosures** tab covers recording devices (required by Airbnb's Host Standards), smoke + CO alarm locations, fire extinguisher, evacuation notes, hazards, and a backup host contact. Only the recording-devices field is required — the rest are optional and skipped in the rendered PDF if you leave them blank.
- When you're done, click the `Launch` tab.
- Check the **Readiness Dashboard** — three cards showing Completion %, any empty required fields (Red Flags), and a READY / MINOR / NEEDS WORK status.

When you're at READY (or at least MINOR), move to step 2.

**Save the file** before step 2.

---

## Step 2 — Render the PDF

Double-click `welcome-book-renderer.html`. It opens in your default browser.

- **Drag `GST-001-welcome-book-BLANK.xlsx` onto the drop zone.** (Or click "Try with demo data" first to see what it looks like.)
- Use the sidebar to pick:
  - A **Theme** — Magazine (default), Editorial, or Hotel.
  - A **Palette** — Harbor Navy, Cabin Green, Terracotta Sunset, or Modern Charcoal.
  - Your **Logo** — drop a PNG or SVG onto the logo panel (optional).
  - **QR codes** — toggle any of WiFi / Host phone / Address on or off. Guests scan these to auto-join WiFi, tap-to-call, or open directions.
- Review the live 3-page preview on the right.
- Hit **Ctrl+P** (or Cmd+P on Mac) → choose "Save as PDF".

That's it. You have a branded 3-page welcome book PDF.

---

## FAQ

**Does it work on Mac?** Yes. Tested on Chrome + Safari + Edge.

**Do I need internet?** No. The renderer is self-contained and works fully offline.

**Does my property data leave my computer?** No. The renderer reads the xlsx file locally in your browser. Nothing is uploaded anywhere.

**Can I print from Excel instead?** The Excel `Launch` tab prints a 1-page readiness dashboard — not the welcome book. The full 3-page welcome book only comes from the renderer.

**I moved the files apart / the OPEN button doesn't work.** Put both files in the same folder again and re-open the xlsx. Or just open `welcome-book-renderer.html` directly.

**Can I re-render after editing the xlsx?** Yes — just re-drop the file onto the renderer. Your theme/palette/logo choices are remembered.

---

_Questions? hello@thestrledger.com_
