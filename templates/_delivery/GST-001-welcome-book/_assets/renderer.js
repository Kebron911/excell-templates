// Renderer app core — parses an xlsx via SheetJS into the v2.1 data contract.
// See spec §5 for cell addresses. v2.1 layout: first input at B8 per tab.

const DATA_CONTRACT = {
  "Property":     ["B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"],
  "Arrival":      ["B8", "B9", "B10", "B11", "B12", "B13", "B14"],
  "WiFi + Tech":  ["B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15"],
  "House Rules":  ["B8", "B9", "B10", "B11", "B12", "B13", "B14"],
  "Trash":        ["B8", "B9", "B10", "B11", "B12", "B13", "B14"],
  "Departure":    ["B8", "B9", "B10", "B11", "B12", "B13", "B16"],
  "Emergency":    ["B8", "B9", "B10", "B11", "B12", "B13", "B14", "B15", "B16"],
};

// Local Guide — table layout, rows 10..29, cols A..E.
const LOCAL_GUIDE_ROWS = 20;
const LOCAL_GUIDE_START_ROW = 10;

function parseWorkbook(workbook) {
  const data = {};
  for (const [sheetName, cells] of Object.entries(DATA_CONTRACT)) {
    const ws = workbook.Sheets[sheetName];
    if (!ws) {
      console.warn(`Missing sheet: ${sheetName}`);
      data[sheetName] = {};
      continue;
    }
    data[sheetName] = {};
    for (const addr of cells) {
      const cell = ws[addr];
      data[sheetName][addr] = cell ? String(cell.v ?? "") : "";
    }
  }
  // Local Guide — read the table
  const lg = workbook.Sheets["Local Guide"];
  data["Local Guide"] = [];
  if (lg) {
    for (let i = 0; i < LOCAL_GUIDE_ROWS; i++) {
      const r = LOCAL_GUIDE_START_ROW + i;
      data["Local Guide"].push({
        cat:   lg[`A${r}`]?.v ?? "",
        name:  lg[`B${r}`]?.v ?? "",
        dist:  lg[`C${r}`]?.v ?? "",
        phone: lg[`D${r}`]?.v ?? "",
        notes: lg[`E${r}`]?.v ?? "",
      });
    }
  }
  return data;
}

function parseDemoData(json) {
  // Demo JSON already uses the cell-address schema. Pass-through.
  return json;
}

// File handling ----------------------------------------------

function setupDropZone(element, onDataReady) {
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
  ["dragenter", "dragover", "dragleave", "drop"].forEach(ev =>
    element.addEventListener(ev, prevent)
  );
  element.addEventListener("dragover",  () => element.classList.add("drag-over"));
  element.addEventListener("dragleave", () => element.classList.remove("drag-over"));
  element.addEventListener("drop", async (e) => {
    element.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      alert("Please drop an .xlsx file. Got: " + file.name);
      return;
    }
    const buf = await file.arrayBuffer();
    const workbook = XLSX.read(buf, { type: "array" });
    const data = parseWorkbook(workbook);
    onDataReady(data, file.name);
  });
}

async function loadDemoData(url, onDataReady) {
  const r = await fetch(url);
  if (!r.ok) {
    alert(`Couldn't load demo data from ${url}`);
    return;
  }
  const json = await r.json();
  onDataReady(parseDemoData(json), "demo-data.json");
}

// App state --------------------------------------------------

const defaultState = {
  data: null,        // parsed workbook
  dataSource: null,  // filename
  theme: "magazine", // "magazine" | "editorial" | "hotel"
  palette: "harbor", // "harbor" | "cabin" | "terracotta" | "charcoal"
  logo: null,        // data URL, or null
  qr: { wifi: true, phone: true, address: true },
};

let appState = { ...defaultState };

function setState(partial) {
  appState = { ...appState, ...partial };
  render();
}

// Rendering --------------------------------------------------

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  if (!appState.data) {
    app.appendChild(renderLanding());
  } else {
    app.appendChild(renderWorkspace());
  }
}

function renderLanding() {
  const el = document.createElement("div");
  el.innerHTML = `
    <div id="drop-zone" class="drop-zone">
      <h2>Drop your filled xlsx here</h2>
      <p>Or —</p>
      <button id="demo-btn">Try with demo data</button>
      <p class="hint">GST-001 · Welcome Book Renderer · works offline</p>
    </div>
  `;
  setTimeout(() => {
    const onReady = (data, src) => setState({ data, dataSource: src });
    setupDropZone(el.querySelector("#drop-zone"), onReady);
    el.querySelector("#demo-btn").addEventListener("click", () =>
      loadDemoData("demo-data.json", onReady)
    );
  }, 0);
  return el;
}

function renderWorkspace() {
  const el = document.createElement("div");
  el.className = "workspace";
  el.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-inner">
        <div class="logo-bar">THE STR LEDGER</div>
        <section class="panel"><h3>Theme</h3>
          <div id="theme-picker" class="picker">
            <em class="picker-stub">Theme picker — Task 9</em>
          </div></section>
        <section class="panel"><h3>Palette</h3>
          <div id="palette-picker" class="picker">
            <em class="picker-stub">Palette picker — Task 8</em>
          </div></section>
        <section class="panel"><h3>Logo</h3>
          <div id="logo-slot">
            <em class="picker-stub">Logo upload — Task 10</em>
          </div></section>
        <section class="panel"><h3>QR codes</h3>
          <div id="qr-toggles">
            <em class="picker-stub">QR toggles — Task 11</em>
          </div></section>
        <section class="panel">
          <button id="print-btn" class="primary-btn">Print / Save as PDF</button>
        </section>
        <section class="panel">
          <button id="reset-btn" class="secondary-btn">← Drop a different file</button>
        </section>
      </div>
    </aside>
    <main class="canvas">
      <div class="canvas-inner" id="pages">
        <section class="page" data-page="1">
          <div class="page-placeholder">Page 1 — themes land in Tasks 7-9</div>
        </section>
        <section class="page" data-page="2">
          <div class="page-placeholder">Page 2</div>
        </section>
        <section class="page" data-page="3">
          <div class="page-placeholder">Page 3</div>
        </section>
      </div>
    </main>
  `;
  setTimeout(() => {
    el.querySelector("#print-btn").addEventListener("click", () => window.print());
    el.querySelector("#reset-btn").addEventListener("click", () =>
      setState({ data: null, dataSource: null })
    );
    wirePalettePicker(el.querySelector("#palette-picker"));
    wireThemePicker(el.querySelector("#theme-picker"));
    renderPages();
  }, 0);
  return el;
}

function wireThemePicker(el) {
  const themes = [
    { id: "magazine", label: "Magazine", hint: "Navy hero + cards" },
    { id: "editorial", label: "Editorial", hint: "Typography only" },
    { id: "hotel",     label: "Hotel", hint: "Foil-stamp hero" },
  ];
  el.className = "picker theme-picker";
  el.innerHTML = themes.map(t =>
    `<div class="theme-card${appState.theme===t.id?' selected':''}"
          data-theme="${t.id}">
       <div class="theme-thumb theme-thumb-${t.id}"></div>
       <div class="theme-label">${t.label}</div>
     </div>`
  ).join("");
  el.querySelectorAll(".theme-card").forEach(card =>
    card.addEventListener("click", () =>
      setState({ theme: card.dataset.theme })
    )
  );
}

function wirePalettePicker(el) {
  const palettes = ["harbor", "cabin", "terracotta", "charcoal"];
  el.className = "picker palette-picker";
  el.innerHTML = palettes.map(p =>
    `<div class="palette-dot${appState.palette===p?' selected':''}"
          data-palette="${p}" title="${p.charAt(0).toUpperCase()+p.slice(1)}"></div>`
  ).join("");
  el.querySelectorAll(".palette-dot").forEach(dot => {
    dot.addEventListener("click", () =>
      setState({ palette: dot.dataset.palette })
    );
  });
}

function renderPages() {
  const root = document.getElementById("pages");
  if (!root) return;
  root.className = `canvas-inner theme-${appState.theme} palette-${appState.palette}`;
  const pages = {
    magazine: renderMagazineTheme,
    editorial: renderEditorialTheme,
    hotel: renderHotelTheme,
  };
  const fn = pages[appState.theme] || renderMagazineTheme;
  root.innerHTML = "";
  fn(appState.data, root);
}

function renderEditorialTheme(d, root) {
  const P = d.Property || {};
  const A = d.Arrival || {};
  const W = d["WiFi + Tech"] || {};
  const R = d["House Rules"] || {};
  const T = d.Trash || {};
  const D = d.Departure || {};
  const E = d.Emergency || {};
  const L = (d["Local Guide"] || []).filter(r => r.name && String(r.name).trim()).slice(0, 10);

  root.innerHTML = `
  <section class="page" data-page="1">
    <div class="masthead">
      <div class="sku">THE STR LEDGER · GST-001 · GUEST EDITION</div>
      <div class="title">Welcome to ${orDash(P.B8)}.</div>
      <div class="sub">A few notes to make your stay effortless.</div>
    </div>

    <h3 class="section">Host &amp; Stay</h3>
    <dl class="facts">
      <dt>Host:</dt><dd>${orDash(P.B9)} · ${orDash(P.B10)}</dd>
      <dt>Check-in:</dt><dd>${orDash(A.B13)}</dd>
      <dt>Check-out:</dt><dd>${orDash(D.B8)}</dd>
    </dl>

    <h3 class="section">Arrival</h3>
    <dl class="facts">
      <dt>Address:</dt><dd>${orDash(A.B8)}</dd>
      <dt>Entry:</dt><dd>${orDash(A.B9)}</dd>
      <dt>Door / lock code:</dt><dd>${orDash(A.B10)}</dd>
      <dt>Parking:</dt><dd>${orDash(A.B11)}</dd>
    </dl>

    <div class="wifi-callout">
      <div><span class="big">WiFi:</span> ${orDash(W.B8)}</div>
      <div><span class="big">Password:</span> ${orDash(W.B9)}</div>
    </div>
  </section>

  <section class="page" data-page="2">
    <h3 class="section">House Rules</h3>
    <dl class="facts">
      <dt>Quiet hours:</dt><dd>${orDash(R.B8)}</dd>
      <dt>Max guests:</dt><dd>${orDash(R.B9)}</dd>
      <dt>Smoking:</dt><dd>${orDash(R.B10)}</dd>
      <dt>Pets:</dt><dd>${orDash(R.B11)}</dd>
      <dt>Events:</dt><dd>${orDash(R.B12)}</dd>
      <dt>Shoes:</dt><dd>${orDash(R.B13)}</dd>
    </dl>

    <h3 class="section">Local Guide — Top 10</h3>
    <table class="local">
      ${L.map(r => `<tr>
        <td class="cat">${esc(r.cat)}</td>
        <td>${esc(r.name)}</td>
        <td>${orDash(r.dist)}</td>
        <td>${orDash(r.phone)}</td>
      </tr>`).join("")}
    </table>
  </section>

  <section class="page" data-page="3">
    <h3 class="section">Trash &amp; Maintenance</h3>
    <dl class="facts">
      <dt>Pickup day:</dt><dd>${orDash(T.B8)}</dd>
      <dt>Bin location:</dt><dd>${orDash(T.B9)}</dd>
      <dt>Sorting:</dt><dd>${orDash(T.B11)}</dd>
    </dl>

    <h3 class="section">Checkout</h3>
    <dl class="facts">
      <dt>Time:</dt><dd>${orDash(D.B8)}</dd>
      <dt>Linens:</dt><dd>${orDash(D.B10)}</dd>
      <dt>Key return:</dt><dd>${orDash(D.B13)}</dd>
    </dl>

    <div class="emergency">
      <h4>Emergency — 911 first</h4>
      <p>Hospital: ${orDash(E.B8)} · ${orDash(E.B9)}</p>
      <p>Urgent care: ${orDash(E.B11)} · ${orDash(E.B12)}</p>
      <p>Host phone: ${orDash(P.B10)}</p>
      <p>Poison: ${orDash(E.B14)}</p>
    </div>
  </section>
  `;
}

function renderHotelTheme(d, root) {
  const P = d.Property || {};
  const A = d.Arrival || {};
  const W = d["WiFi + Tech"] || {};
  const R = d["House Rules"] || {};
  const T = d.Trash || {};
  const D = d.Departure || {};
  const E = d.Emergency || {};
  const L = (d["Local Guide"] || []).filter(r => r.name && String(r.name).trim()).slice(0, 10);

  root.innerHTML = `
  <section class="page" data-page="1">
    <div class="cover">
      <div class="cover-mark">THE STR LEDGER</div>
      <div class="cover-body">
        <div class="cover-pre">The house at</div>
        <div class="cover-name">${orDash(P.B8)}</div>
        <div class="cover-rule"></div>
        <div class="cover-tag">GUEST EDITION · 2026</div>
      </div>
    </div>
    <div class="page-inner">
      <div class="subhead">WELCOME</div>
      <h3 class="section">A few notes</h3>
      <dl class="facts">
        <dt>Host</dt><dd>${orDash(P.B9)} · ${orDash(P.B10)}</dd>
        <dt>Arrival</dt><dd>${orDash(A.B8)}</dd>
        <dt>Check-in / Check-out</dt><dd>${orDash(A.B13)} → ${orDash(D.B8)}</dd>
        <dt>Parking</dt><dd>${orDash(A.B11)}</dd>
      </dl>
      <div class="wifi-engraved">
        <div class="pre">WIFI</div>
        <div class="val">${orDash(W.B8)} &nbsp; · &nbsp; ${orDash(W.B9)}</div>
      </div>
    </div>
  </section>

  <section class="page" data-page="2">
    <div class="page-inner">
      <div class="subhead">HOUSE</div>
      <h3 class="section">Rules of the Home</h3>
      <dl class="facts">
        <dt>Quiet Hours</dt><dd>${orDash(R.B8)}</dd>
        <dt>Max Guests</dt><dd>${orDash(R.B9)}</dd>
        <dt>Smoking</dt><dd>${orDash(R.B10)}</dd>
        <dt>Pets</dt><dd>${orDash(R.B11)}</dd>
        <dt>Events</dt><dd>${orDash(R.B12)}</dd>
      </dl>
      <div class="subhead">NEARBY</div>
      <h3 class="section">Local Favorites</h3>
      <table class="local">
        ${L.map(r => `<tr>
          <td class="cat">${esc(r.cat)}</td>
          <td><strong>${esc(r.name)}</strong></td>
          <td>${orDash(r.dist)}</td>
          <td>${orDash(r.notes)}</td>
        </tr>`).join("")}
      </table>
    </div>
  </section>

  <section class="page" data-page="3">
    <div class="page-inner">
      <div class="subhead">DEPARTURE</div>
      <h3 class="section">On your way out</h3>
      <dl class="facts">
        <dt>Checkout Time</dt><dd>${orDash(D.B8)}</dd>
        <dt>Linens</dt><dd>${orDash(D.B10)}</dd>
        <dt>Key Return</dt><dd>${orDash(D.B13)}</dd>
        <dt>Trash</dt><dd>${orDash(T.B8)} — ${orDash(T.B9)}</dd>
      </dl>

      <div class="emergency">
        <h4>Emergency — Call 911 first</h4>
        <p>Hospital · ${orDash(E.B8)} · ${orDash(E.B9)}</p>
        <p>Urgent care · ${orDash(E.B11)} · ${orDash(E.B12)}</p>
        <p>Host · ${orDash(P.B10)}</p>
        <p>Poison Control · ${orDash(E.B14)}</p>
      </div>
    </div>
  </section>
  `;
}

// Helpers
function esc(x) {
  return String(x ?? "—").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}
function orDash(x) {
  return x && String(x).trim() ? esc(x) : "—";
}

// --- Tier 2 Magazine theme ----------------------------------

function renderMagazineTheme(d, root) {
  const P = d.Property || {};
  const A = d.Arrival || {};
  const W = d["WiFi + Tech"] || {};
  const R = d["House Rules"] || {};
  const T = d.Trash || {};
  const D = d.Departure || {};
  const E = d.Emergency || {};
  const L = (d["Local Guide"] || [])
    .filter(r => r.name && String(r.name).trim());
  const topLocal = L.slice(0, 10);

  root.innerHTML = `
  <section class="page" data-page="1">
    <div class="hero">
      <div class="hero-mono">THE STR LEDGER · GUEST EDITION</div>
      <div class="hero-title">Welcome to<br>${orDash(P.B8)}.</div>
      <div class="hero-sub">A few notes to make your stay effortless.</div>
      <div class="hero-pagenum">PAGE 1 OF 3</div>
    </div>
    <div class="page-inner">
      <div class="info-strip">
        <div class="info-card"><div class="label">HOST</div>
          <div class="value">${orDash(P.B9)}</div></div>
        <div class="info-card"><div class="label">TEXT</div>
          <div class="value">${orDash(P.B10)}</div></div>
        <div class="info-card"><div class="label">CHECK-IN</div>
          <div class="value">${orDash(A.B13)}</div></div>
      </div>
      <p class="pull-quote">Your stay is ${orDash(P.B9)}'s priority.
        Text anytime at ${orDash(P.B10)} — we'd rather hear from you
        than the morning-after emergency.</p>

      <h3 class="section">Arrival</h3>
      <dl class="facts">
        <dt>Address</dt><dd>${orDash(A.B8)}</dd>
        <dt>Entry method</dt><dd>${orDash(A.B9)}</dd>
        <dt>Door / lock code</dt><dd>${orDash(A.B10)}</dd>
        <dt>Parking</dt><dd>${orDash(A.B11)}</dd>
      </dl>

      <div class="wifi-big">
        <div><span class="label">NETWORK</span>${orDash(W.B8)}</div>
        <div><span class="label">PASSWORD</span>${orDash(W.B9)}</div>
      </div>
    </div>
  </section>

  <section class="page" data-page="2">
    <div class="page-inner">
      <h3 class="section">House Rules</h3>
      <dl class="facts">
        <dt>Quiet hours</dt><dd>${orDash(R.B8)}</dd>
        <dt>Max guests</dt><dd>${orDash(R.B9)}</dd>
        <dt>Smoking</dt><dd>${orDash(R.B10)}</dd>
        <dt>Pets</dt><dd>${orDash(R.B11)}</dd>
        <dt>Events</dt><dd>${orDash(R.B12)}</dd>
        <dt>Shoes</dt><dd>${orDash(R.B13)}</dd>
        ${R.B14 ? `<dt>Additional</dt><dd>${esc(R.B14)}</dd>` : ""}
      </dl>

      <h3 class="section">Local Guide — Our Top 10</h3>
      <table class="local">
        <thead><tr>
          <th>CATEGORY</th><th>NAME</th><th>DISTANCE</th>
          <th>PHONE</th><th>NOTES</th>
        </tr></thead>
        <tbody>
          ${topLocal.map(r => `
            <tr>
              <td class="cat">${esc(r.cat)}</td>
              <td>${esc(r.name)}</td>
              <td>${orDash(r.dist)}</td>
              <td>${orDash(r.phone)}</td>
              <td>${orDash(r.notes)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </section>

  <section class="page" data-page="3">
    <div class="page-inner">
      <h3 class="section">Trash &amp; Maintenance</h3>
      <dl class="facts">
        <dt>Pickup day</dt><dd>${orDash(T.B8)}</dd>
        <dt>Bin location</dt><dd>${orDash(T.B9)}</dd>
        <dt>Sorting rules</dt><dd>${orDash(T.B11)}</dd>
      </dl>

      <h3 class="section">Checkout</h3>
      <dl class="facts">
        <dt>Time</dt><dd>${orDash(D.B8)}</dd>
        <dt>Linens</dt><dd>${orDash(D.B10)}</dd>
        <dt>Key return</dt><dd>${orDash(D.B13)}</dd>
        ${D.B16 ? `<dt>Custom</dt><dd>${esc(D.B16)}</dd>` : ""}
      </dl>

      <div class="emergency">
        <h4>Emergency — Call 911 first</h4>
        <p><strong>Hospital:</strong> ${orDash(E.B8)}  ·  ${orDash(E.B9)}</p>
        <p><strong>Urgent care:</strong> ${orDash(E.B11)}  ·  ${orDash(E.B12)}</p>
        <p><strong>Host phone:</strong> ${orDash(P.B10)}</p>
        <p><strong>Poison control:</strong> ${orDash(E.B14)}</p>
      </div>
    </div>
  </section>
  `;
}

// Boot --------------------------------------------------------

document.addEventListener("DOMContentLoaded", render);
