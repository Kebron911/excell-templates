const { useState } = React;

// A simple spreadsheet-grid renderer that matches the brand.
// Props: columns (array of {key, label, width}), rows (array of row objects),
// highlighted (Set of row keys to highlight in gold).
function Sheet({ columns, rows, highlighted = new Set(), frozenRows = 0 }) {
  return (
    <div style={{
      flex: 1, overflow: "auto", background: "var(--brand-paper)",
      fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-1)",
    }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={th({ width: 40, textAlign: "center" })}></th>
            {columns.map((c) => (
              <th key={c.key} style={th({ width: c.width })}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const frozen = i < frozenRows;
            const hi = highlighted.has(r.key);
            return (
              <tr key={r.key || i} style={{
                background: frozen ? "var(--brand-navy-6)" : hi ? "var(--brand-gold-10)" : "transparent",
              }}>
                <td style={rowHead(frozen)}>{i + 1}</td>
                {columns.map((c) => {
                  const v = r[c.key];
                  const isNum = typeof v === "number" || (typeof v === "string" && /^-?[\$\d,\.]+$/.test(v));
                  const isNeg = typeof v === "string" && v.startsWith("−");
                  const isFormula = typeof v === "string" && v.startsWith("=");
                  return (
                    <td key={c.key} style={{
                      ...td,
                      textAlign: isNum || isNeg ? "right" : "left",
                      fontFamily: isFormula ? "var(--font-mono)" : undefined,
                      color: isNeg ? "var(--semantic-error)" : isFormula ? "var(--fg-3)" : r.bold ? "var(--brand-navy)" : undefined,
                      fontWeight: r.bold ? 600 : 400,
                      borderTop: r.rule ? "2px solid var(--brand-navy)" : td.borderTop,
                    }}>{v ?? ""}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const th = (extra = {}) => ({
  padding: "6px 10px", background: "var(--brand-parchment-dark)",
  borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule-strong)",
  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em",
  textTransform: "uppercase", color: "var(--fg-3)", fontWeight: 500,
  textAlign: "left", position: "sticky", top: 0,
  ...extra,
});
const rowHead = (frozen) => ({
  padding: "6px 10px", background: "var(--brand-parchment-dark)",
  borderRight: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)",
  fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)",
  textAlign: "center", width: 40,
  fontWeight: frozen ? 600 : 400,
});
const td = {
  padding: "8px 10px",
  borderRight: "1px solid var(--rule)",
  borderTop: "1px solid var(--rule)",
  whiteSpace: "nowrap",
};

// Cover-sheet "sheet" that overlays a branded cover instead of a grid.
function CoverSheet() {
  return (
    <div style={{ flex: 1, background: "var(--brand-parchment)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 560, aspectRatio: "1/1.3", background: "var(--brand-paper)", border: "1px solid var(--rule-strong)", boxShadow: "0 24px 40px -20px rgba(11,28,47,0.2)", padding: "72px 60px", position: "relative" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--brand-gold)" }}>The STR Ledger · Vol. IX</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 72, letterSpacing: "-0.02em", color: "var(--brand-navy)", lineHeight: 0.98, marginTop: 28 }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>The</span><br/>
          2025<br/>Ledger<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
        <div style={{ width: 48, height: 1, background: "var(--brand-gold)", margin: "32px 0" }}/>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, lineHeight: 1.5, color: "var(--fg-2)" }}>
          A Schedule&nbsp;E workbook for hosts who treat their rentals like a real business.
        </div>
        <div style={{ position: "absolute", bottom: 60, left: 60, right: 60, display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--fg-3)" }}>
          <span>Prepared for tax year 2025</span>
          <span>Last updated · Feb 2026</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sheet, CoverSheet });
