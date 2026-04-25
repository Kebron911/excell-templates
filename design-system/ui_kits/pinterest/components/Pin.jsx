// All pins are 1000×1500 (2:3). We render them scaled via CSS transform in index.html.

function PinFrame({ children, tint = "parchment", style = {} }) {
  const bg = tint === "navy" ? "var(--brand-navy)"
           : tint === "gold" ? "var(--brand-gold)"
           : tint === "paper" ? "var(--brand-paper)"
           : "var(--brand-parchment)";
  const fg = tint === "navy" ? "var(--brand-parchment)" : "var(--brand-navy)";
  return (
    <div style={{
      width: 1000, height: 1500, background: bg, color: fg,
      position: "relative", overflow: "hidden", ...style,
    }}>{children}</div>
  );
}

function Watermark({ tint = "parchment" }) {
  const color = tint === "navy" ? "var(--brand-parchment)" : "var(--brand-navy)";
  const subColor = tint === "navy" ? "var(--fg-on-navy-muted)"
                : tint === "gold" ? "var(--brand-navy)"
                : "var(--fg-3)";
  const goldDot = tint === "gold" ? "var(--brand-parchment)" : "var(--brand-gold)";
  return (
    <div style={{ position: "absolute", bottom: 60, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontFamily: "var(--font-display)", color, fontSize: 30, fontWeight: 500, letterSpacing: "-0.01em", display: "inline-flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: 22 }}>The</span>
        <span>STR Ledger<span style={{ color: goldDot }}>.</span></span>
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.22em", textTransform: "uppercase", color: subColor }}>thestrledger.com</span>
    </div>
  );
}

// ---- 1) BigNumber — navy-dominant stat pin -----------------------------
function PinBigNumber({ number = "$4,200", label = "left on the table every April", sub = "47 deductions most Airbnb hosts miss" }) {
  return (
    <PinFrame tint="navy">
      {/* Top cartouche */}
      <div style={{ position: "absolute", top: 70, left: 80, right: 80, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.3em", color: "var(--brand-gold)" }}>N<span style={{ color: "var(--brand-parchment)" }}>o.</span> 01</span>
        <span style={{ flex: 1, height: 1, background: "var(--brand-gold)" }}/>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--brand-parchment)" }}>Tax · Airbnb Hosts</span>
      </div>

      <div style={{ padding: "180px 80px 0" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 240, lineHeight: 0.95, letterSpacing: "-0.03em", color: "var(--brand-parchment)", marginTop: 20 }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>{number}</span><span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
        <div style={{ width: 100, height: 2, background: "var(--brand-gold)", margin: "44px 0" }}/>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 60, lineHeight: 1.15, letterSpacing: "-0.01em", color: "var(--brand-parchment)", maxWidth: 760, marginTop: 4 }}>
          {label}<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 36, lineHeight: 1.4, color: "var(--fg-on-navy-muted)", marginTop: 44, maxWidth: 720 }}>{sub}</div>
      </div>

      {/* Ledger receipt — parchment card on navy; the light object the eye lands on */}
      <div style={{
        position: "absolute", left: 80, right: 80, bottom: 220,
        background: "var(--brand-parchment)",
        padding: "36px 44px",
        boxShadow: "0 20px 40px -16px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--fg-3)" }}>Line items · 2025 return</div>
        {[
          ["Phone (pro-rata)", "$1,140"],
          ["Welcome-basket goods", "$612"],
          ["Mileage · 6,000 mi @ 70¢", "$4,200"],
          ["The rest", "+ 44 more"],
        ].map(([k, v], i) => (
          <div key={k} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            borderTop: i === 0 ? "1px solid var(--rule)" : "1px dashed rgba(11,28,47,0.15)",
            padding: "18px 0",
            fontFamily: "var(--font-display)",
          }}>
            <span style={{ fontSize: 28, color: "var(--brand-navy)" }}>{k}</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: i === 2 ? "var(--brand-gold)" : "var(--brand-navy)", letterSpacing: "-0.01em" }}>
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>{v}</span>
            </span>
          </div>
        ))}
      </div>
      <Watermark tint="navy"/>
    </PinFrame>
  );
}

// ---- 2) ListPromise — the "47 X that Y" pin ----------------------------
function PinListPromise() {
  const items = ["Welcome-basket goods", "Phone (pro-rata)", "The drive to Costco", "Your dynamic-pricing app", "Proper insurance premium", "CPA fee (40% allocable)", "The paint you used last April", "One weekend-cleaning round trip"];
  return (
    <PinFrame tint="navy">
      <div style={{ padding: "120px 80px 0" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--brand-gold)" }}>The Ledger · Free Guide</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 150, lineHeight: 0.96, letterSpacing: "-0.02em", color: "var(--brand-parchment)", marginTop: 36 }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>47</span><br/>deductions<br/>your CPA<br/>forgets<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
        <div style={{ width: 100, height: 2, background: "var(--brand-gold)", margin: "44px 0 36px" }}/>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40, rowGap: 14 }}>
          {items.map(i => (
            <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: 24, color: "var(--brand-parchment)", paddingLeft: 28, position: "relative", lineHeight: 1.4 }}>
              <span style={{ position: "absolute", left: 0, color: "var(--brand-gold)", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24 }}>✓</span>
              {i}
            </li>
          ))}
          <li style={{ gridColumn: "1 / -1", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 30, color: "var(--brand-gold)", marginTop: 12 }}>+ 39 more, with the IRS cite on each →</li>
        </ul>
      </div>
      <Watermark tint="navy"/>
    </PinFrame>
  );
}

// ---- 3) Quote — stat-led testimonial pin --------------------------------
function PinQuote() {
  return (
    <PinFrame tint="parchment">
      {/* Top cartouche */}
      <div style={{ position: "absolute", top: 70, left: 90, right: 90, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.3em", color: "var(--brand-gold)" }}>N<span style={{ color: "var(--brand-navy)" }}>o.</span> 03</span>
        <span style={{ flex: 1, height: 1, background: "var(--brand-gold)" }}/>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.3em", color: "var(--brand-navy)", textTransform: "uppercase" }}>Host Results · 2025</span>
      </div>

      {/* HERO: the stat, not the quote */}
      <div style={{ padding: "160px 90px 0" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--fg-3)" }}>Sarah K., year one</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 260, lineHeight: 0.92, letterSpacing: "-0.03em", color: "var(--brand-navy)", marginTop: 28 }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>$6,842</span><span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
        <div style={{ width: 100, height: 2, background: "var(--brand-gold)", margin: "36px 0" }}/>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 58, lineHeight: 1.15, letterSpacing: "-0.01em", color: "var(--brand-navy)", maxWidth: 760 }}>
          found in deductions her CPA missed<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
      </div>

      {/* Supporting pull-quote on navy — demoted to a footnote band */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 220,
        background: "var(--brand-navy)", color: "var(--brand-parchment)",
        padding: "36px 90px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, fontSize: 120, lineHeight: 0.6, color: "var(--brand-gold)", flexShrink: 0, marginTop: 14 }}>"</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, fontSize: 30, lineHeight: 1.35, color: "var(--brand-parchment)", maxWidth: 720 }}>
              My CPA asked where I got it. She's recommending it to her other Airbnb clients now.
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--fg-on-navy-muted)", marginTop: 16 }}>
              — Sarah K. · 4 properties · Smoky Mountains
            </div>
          </div>
        </div>
      </div>
      <Watermark/>
    </PinFrame>
  );
}

// ---- 4) Comparison — navy-dominant before/after pin --------------------
function PinComparison() {
  return (
    <PinFrame tint="navy">
      <div style={{ padding: "120px 70px 0" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--brand-gold)" }}>Before · After</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 120, lineHeight: 0.98, letterSpacing: "-0.02em", color: "var(--brand-parchment)", marginTop: 28 }}>
          Your taxes<br/><span style={{ fontStyle: "italic", fontWeight: 400 }}>before</span> and <span style={{ fontStyle: "italic", fontWeight: 400 }}>after</span> The Ledger<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 680, left: 70, right: 70, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[
          { tint: "paper", tag: "Before", body: "Receipts in a shoebox. Screenshots in Notes. The annual April panic call to your CPA.", fig: "—$4,200", hero: false },
          { tint: "parchment", tag: "After",  body: "One workbook. 47 deductions, pre-wired. A hand-off PDF your CPA will smile at.", fig: "+$4,200", hero: true },
        ].map((b, i) => (
          <div key={i} style={{
            background: b.tint === "paper" ? "var(--brand-paper)" : "var(--brand-parchment)",
            color: "var(--brand-navy)",
            padding: "44px 40px", minHeight: 540,
            boxShadow: b.hero ? "0 24px 48px -16px rgba(0,0,0,0.5)" : "0 12px 24px -12px rgba(0,0,0,0.3)",
            opacity: b.hero ? 1 : 0.92,
            position: "relative",
          }}>
            {b.hero && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "var(--brand-gold)" }}/>}
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, letterSpacing: "0.28em", textTransform: "uppercase", color: b.hero ? "var(--brand-gold)" : "var(--fg-3)" }}>{b.tag}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 88, letterSpacing: "-0.02em", lineHeight: 1, marginTop: 24, color: "var(--brand-navy)" }}>
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>{b.fig.slice(0,1)}</span>{b.fig.slice(1)}<span style={{ color: "var(--brand-gold)" }}>.</span>
            </div>
            <div style={{ width: 60, height: 2, background: "var(--brand-gold)", margin: "28px 0" }}/>
            <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 26, lineHeight: 1.45, color: "var(--fg-2)" }}>{b.body}</div>
          </div>
        ))}
      </div>
      <Watermark tint="navy"/>
    </PinFrame>
  );
}

// ---- 5) StackedWords — editorial typographic pin ------------------------
function PinStackedWords() {
  return (
    <PinFrame tint="parchment">
      {/* Top cartouche — matches pins 01 & 03 */}
      <div style={{ position: "absolute", top: 70, left: 80, right: 80, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.3em", color: "var(--brand-gold)" }}>N<span style={{ color: "var(--brand-navy)" }}>o.</span> 05</span>
        <span style={{ flex: 1, height: 1, background: "var(--brand-gold)" }}/>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--brand-navy)" }}>For Airbnb &amp; VRBO Hosts</span>
      </div>

      {/* Broken composition: asymmetric two-column with a floated italic flourish.
          Scale variation + hanging italics + gold index-line replaces the rigid tower. */}
      <div style={{ padding: "170px 80px 0", position: "relative" }}>
        {/* Gold vertical accent that runs beside the tower */}
        <div style={{ position: "absolute", left: 80, top: 210, width: 2, height: 700, background: "var(--brand-gold)" }}/>

        <div style={{ paddingLeft: 46, maxWidth: 780 }}>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            color: "var(--brand-navy)", letterSpacing: "-0.025em",
          }}>
            {/* Line 1 — big */}
            <div style={{ fontSize: 156, lineHeight: 0.92 }}>Run</div>
            {/* Line 2 — hang italic off the left, smaller, offset right */}
            <div style={{ fontSize: 112, lineHeight: 1, marginLeft: 120, marginTop: 4, fontStyle: "italic", fontWeight: 400, color: "var(--brand-navy)" }}>your</div>
            {/* Line 3 — biggest, the subject */}
            <div style={{ fontSize: 180, lineHeight: 0.9, marginTop: 8 }}>rentals<span style={{ color: "var(--brand-gold)" }}>.</span></div>

            {/* Hairline break — gives the eye a landing */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "40px 0 32px" }}>
              <span style={{ width: 60, height: 1, background: "var(--brand-navy)" }}/>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--brand-navy)" }}>not the other way</span>
            </div>

            {/* Line 4 — smaller, italic, gold — the turn */}
            <div style={{ fontSize: 104, lineHeight: 1, fontStyle: "italic", fontWeight: 400, color: "var(--brand-gold)" }}>before they</div>
            {/* Line 5 — back to navy, smaller still, offset */}
            <div style={{ fontSize: 132, lineHeight: 0.95, marginLeft: 80, marginTop: 4 }}>
              run <span style={{ fontStyle: "italic", fontWeight: 400 }}>you</span><span style={{ color: "var(--brand-gold)" }}>.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pull-strap retained but quieter — single tagline, no competing CTA block */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 220,
        background: "var(--brand-navy)", color: "var(--brand-parchment)",
        padding: "30px 80px",
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 40,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 30, color: "var(--brand-parchment)" }}>
          Business-grade Excel workbooks<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--brand-gold)", flexShrink: 0 }}>Get the guide →</div>
      </div>

      <Watermark/>
    </PinFrame>
  );
}

// ---- 6) WorkbookMock — editorial ledger-page pin ------------------------
function PinWorkbookMock() {
  const rows = [
    ["01", "Cleaning (turnover)",       "Sch. E · 7",  "$8,400"],
    ["02", "Mileage · 6,000 mi",        "Sch. E · 6",  "$4,200"],
    ["03", "Welcome-basket goods",      "Sch. E · 15", "$612"],
    ["04", "Property insurance",        "Sch. E · 9",  "$1,840"],
    ["05", "Phone (business %)",        "Sch. E · 18", "$1,140"],
    ["06", "CPA fee (allocable)",       "Sch. E · 10", "$680"],
    ["07", "Airbnb service fees",       "Sch. E · 11", "$2,960"],
    ["08", "Depreciation · furniture",  "Form 4562",   "$1,280"],
  ];
  return (
    <PinFrame tint="parchment">
      {/* Top cartouche */}
      <div style={{ position: "absolute", top: 70, left: 80, right: 80, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.3em", color: "var(--brand-gold)" }}>N<span style={{ color: "var(--brand-navy)" }}>o.</span> 06</span>
        <span style={{ flex: 1, height: 1, background: "var(--brand-gold)" }}/>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--brand-navy)" }}>Inside the Ledger</span>
      </div>

      {/* Headline */}
      <div style={{ padding: "150px 80px 0" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 92, lineHeight: 0.98, letterSpacing: "-0.02em", color: "var(--brand-navy)" }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>This</span> is what<br/>your Schedule E<br/>should look like<span style={{ color: "var(--brand-gold)" }}>.</span>
        </div>
      </div>

      {/* Workbook panel — the "screenshot" stand-in */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 640,
        background: "var(--brand-parchment)",
        boxShadow: "0 24px 48px -20px rgba(11,28,47,0.3)",
        border: "1px solid var(--rule)",
      }}>
        {/* Tab strip — like a spreadsheet tab bar but editorial */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--rule)", background: "var(--brand-paper)" }}>
          {[
            { label: "Schedule E", active: true },
            { label: "Deductions" },
            { label: "Mileage" },
            { label: "Depreciation" },
          ].map((t, i) => (
            <div key={t.label} style={{
              padding: "14px 22px",
              fontFamily: "var(--font-mono)", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase",
              color: t.active ? "var(--brand-navy)" : "var(--fg-3)",
              background: t.active ? "var(--brand-parchment)" : "transparent",
              borderBottom: t.active ? "2px solid var(--brand-gold)" : "none",
              fontWeight: t.active ? 600 : 400,
            }}>{t.label}</div>
          ))}
        </div>

        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "60px 1fr 180px 160px",
          padding: "14px 32px",
          fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase",
          color: "var(--fg-3)", borderBottom: "1px solid var(--rule)", background: "var(--brand-parchment-alt, #F2E9D5)",
        }}>
          <span>#</span><span>Line item</span><span>Maps to</span><span style={{ textAlign: "right" }}>Amount</span>
        </div>

        {/* Rows */}
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "60px 1fr 180px 160px",
            padding: "14px 32px",
            fontFamily: "var(--font-display)", fontSize: 22, color: "var(--brand-navy)",
            background: i % 2 === 1 ? "var(--brand-paper)" : "var(--brand-parchment)",
            alignItems: "baseline",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-3)", letterSpacing: "0.2em" }}>{r[0]}</span>
            <span>{r[1]}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-2)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{r[2]}</span>
            <span style={{ textAlign: "right", fontWeight: 500, letterSpacing: "-0.01em" }}>
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>{r[3]}</span>
            </span>
          </div>
        ))}

        {/* Total row — gold highlight */}
        <div style={{
          display: "grid", gridTemplateColumns: "60px 1fr 160px",
          padding: "22px 32px",
          background: "var(--brand-navy)", color: "var(--brand-parchment)",
          alignItems: "baseline",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--brand-gold)", letterSpacing: "0.2em" }}>Σ</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "-0.01em" }}>
            Total deductions, 2025 return
          </span>
          <span style={{ textAlign: "right", fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 500, color: "var(--brand-gold)", letterSpacing: "-0.02em" }}>
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>$21,112</span><span style={{ color: "var(--brand-parchment)" }}>.</span>
          </span>
        </div>
      </div>

      <Watermark/>
    </PinFrame>
  );
}

Object.assign(window, { PinBigNumber, PinListPromise, PinQuote, PinComparison, PinStackedWords, PinWorkbookMock });
