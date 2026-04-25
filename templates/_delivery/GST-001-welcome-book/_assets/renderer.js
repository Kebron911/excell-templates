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
