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
    renderPages();
  }, 0);
  return el;
}

function renderPages() {
  // Stub — filled in Task 7+ per theme.
  // For now, dump the parsed Property name into page 1 to confirm data flows.
  const p1 = document.querySelector('.page[data-page="1"] .page-placeholder');
  if (p1 && appState.data) {
    const propertyName = appState.data.Property?.B8 || "(empty)";
    p1.textContent = `Property name from xlsx: ${propertyName}`;
  }
}

// Boot --------------------------------------------------------

document.addEventListener("DOMContentLoaded", render);
