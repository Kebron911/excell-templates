const { useState } = React;

// ---- Hero --------------------------------------------------------------

function Hero() {
  return (
    <section style={{
      background: "var(--brand-parchment)", padding: "96px 48px 112px",
      borderBottom: "1px solid var(--rule)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <Eyebrow>For Airbnb &amp; VRBO Hosts</Eyebrow>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 68,
            lineHeight: 1.12, letterSpacing: "-0.015em", color: "var(--brand-navy)",
            margin: "24px 0 40px", maxWidth: 620,
          }}>
            Run your rentals<br/>
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>before they run you<span style={{ color: "var(--brand-gold)" }}>.</span></span>
          </h1>
          <GoldRule width={56} my={28}/>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.6,
            color: "var(--fg-2)", maxWidth: 520, margin: 0,
          }}>Business-grade Excel workbooks for hosts who want their books in order before their CPA asks twice. No fluff, no subscriptions — just spreadsheets that actually balance.</p>
          <div style={{ display: "flex", gap: 16, marginTop: 36 }}>
            <Button variant="primary" size="lg">Browse the templates</Button>
            <Button variant="ghost" size="lg">See the 47 deductions →</Button>
          </div>
          <div style={{
            marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--rule)",
            display: "flex", gap: 48,
          }}>
            {[
              ["2,847", "hosts on the ledger"],
              ["$4.2M", "deductions surfaced"],
              ["4.9★", "CPA-verified reviews"],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 500, color: "var(--brand-navy)", letterSpacing: "-0.01em" }}>{n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--fg-3)", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Workbook placeholder illustration */}
        <div style={{ position: "relative", aspectRatio: "4/5", background: "var(--brand-navy)", padding: 28 }}>
          <div style={{
            position: "absolute", inset: 20, background: "var(--brand-parchment)",
            boxShadow: "0 40px 60px -30px rgba(11,28,47,0.6)",
            padding: "44px 36px",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--brand-gold)" }}>Schedule E · Line 19</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, letterSpacing: "-0.01em", color: "var(--brand-navy)", marginTop: 8, lineHeight: 1.15 }}>
              <span style={{ fontStyle: "italic", fontWeight: 400 }}>The</span> 2025 Ledger<span style={{ color: "var(--brand-gold)" }}>.</span>
            </div>
            <div style={{ height: 1, background: "var(--brand-gold)", width: 32, margin: "18px 0" }}/>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 10, columnGap: 12, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-2)" }}>
              {[
                ["Gross rents", "$142,880"],
                ["Cleaning", "−$18,420"],
                ["Supplies", "−$6,115"],
                ["Mortgage int.", "−$41,204"],
                ["Depreciation", "−$22,960"],
                ["Management", "−$14,288"],
              ].map(([k, v]) => (
                <React.Fragment key={k}>
                  <span>{k}</span>
                  <span style={{ textAlign: "right", color: "var(--brand-navy)" }}>{v}</span>
                </React.Fragment>
              ))}
              <div style={{ gridColumn: "1 / -1", height: 1, background: "var(--rule-strong)", margin: "8px 0" }}/>
              <span style={{ color: "var(--brand-navy)", fontWeight: 600 }}>Net income</span>
              <span style={{ textAlign: "right", color: "var(--semantic-success)", fontWeight: 600 }}>$39,893</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Product Card ------------------------------------------------------

function ProductCard({ tag, title, price, body, badge }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="product.html" style={{ textDecoration: "none" }}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: "var(--brand-paper)",
        border: "1px solid var(--rule)",
        padding: "32px 28px",
        position: "relative",
        transition: "border-color 200ms, box-shadow 200ms, transform 200ms",
        borderColor: hover ? "var(--brand-navy)" : "var(--rule)",
        boxShadow: hover ? "0 18px 30px -18px rgba(11,28,47,0.18)" : "none",
        transform: hover ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}>
        {badge && (
          <span style={{
            position: "absolute", top: 20, right: 20,
            fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--brand-gold)",
          }}>{badge}</span>
        )}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--fg-3)" }}>{tag}</div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24,
          letterSpacing: "-0.01em", color: "var(--brand-navy)",
          margin: "14px 0 10px", lineHeight: 1.2,
        }}>{title}</h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg-2)", margin: 0, lineHeight: 1.55, minHeight: 64 }}>{body}</p>
        <div style={{ height: 1, background: "var(--rule)", margin: "24px 0 16px" }}/>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22, color: "var(--brand-navy)" }}>${price}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--brand-navy)", borderBottom: hover ? "1px solid var(--brand-gold)" : "1px solid transparent", transition: "border 200ms" }}>View details →</span>
        </div>
      </div>
    </a>
  );
}

// ---- Blog card -----------------------------------------------------------

function BlogCard({ category, title, excerpt, date, feature }) {
  return (
    <a href="blog.html" style={{ textDecoration: "none", display: "block" }}>
      <article style={{
        borderTop: "1px solid var(--rule-strong)",
        padding: feature ? "36px 0" : "28px 0",
        display: "grid",
        gridTemplateColumns: feature ? "1fr 1fr" : "160px 1fr",
        gap: feature ? 48 : 32,
      }}>
        <div style={{
          background: "var(--brand-navy)", aspectRatio: feature ? "4/3" : "1/1",
          display: "flex", alignItems: "flex-end", padding: feature ? 28 : 14,
        }}>
          <Eyebrow>The Ledger Note</Eyebrow>
        </div>
        <div>
          <Eyebrow>{category}</Eyebrow>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: feature ? 36 : 22, letterSpacing: "-0.01em",
            color: "var(--brand-navy)", margin: "14px 0 12px", lineHeight: 1.18,
          }}>{title}</h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: feature ? 17 : 14, color: "var(--fg-2)", margin: 0, lineHeight: 1.6, maxWidth: 520 }}>{excerpt}</p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--fg-3)", marginTop: feature ? 24 : 16 }}>{date}</div>
        </div>
      </article>
    </a>
  );
}

Object.assign(window, { Hero, ProductCard, BlogCard });
