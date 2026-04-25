const { useState } = React;

// ---- Brand atoms --------------------------------------------------------

function Wordmark({ reverse = false, compact = false }) {
  const color = reverse ? "var(--brand-parchment)" : "var(--brand-navy)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "baseline", gap: "7px",
      fontFamily: "var(--font-display)", color, lineHeight: 1,
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      <span style={{ fontStyle: "italic", fontWeight: 400, fontSize: compact ? 14 : 17 }}>The</span>
      <span style={{ fontWeight: 500, fontSize: compact ? 22 : 28, letterSpacing: "-0.01em" }}>
        STR Ledger<span style={{ color: "var(--brand-gold)" }}>.</span>
      </span>
    </span>
  );
}

function Monogram({ size = 36, reverse = false }) {
  const bg = reverse ? "transparent" : "var(--brand-navy)";
  const fg = reverse ? "var(--brand-navy)" : "var(--brand-parchment)";
  const border = reverse ? "1.5px solid var(--brand-navy)" : "none";
  return (
    <span style={{
      width: size, height: size, borderRadius: "999px", background: bg, border,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-display)", fontWeight: 500, fontSize: size * 0.56,
      letterSpacing: "-0.02em", lineHeight: 1,
    }}>
      <span style={{ color: fg }}>S</span>
      <span style={{ color: "var(--brand-gold)" }}>L</span>
    </span>
  );
}

function GoldRule({ width = 48, align = "left", my = 16 }) {
  return <div style={{
    width, height: 1, background: "var(--brand-gold)",
    marginLeft: align === "center" ? "auto" : 0,
    marginRight: align === "center" ? "auto" : 0,
    marginTop: my, marginBottom: my,
  }}/>;
}

function Eyebrow({ children, onNavy = false }) {
  return <div style={{
    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: onNavy ? "var(--brand-gold)" : "var(--brand-gold)",
  }}>{children}</div>;
}

function Button({ variant = "primary", children, onClick, full, size="md" }) {
  const base = {
    fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.02em",
    border: 0, borderRadius: 2, cursor: "pointer", transition: "background 200ms",
    padding: size === "lg" ? "14px 28px" : "12px 22px",
    fontSize: size === "lg" ? 15 : 14,
    width: full ? "100%" : "auto",
    whiteSpace: "nowrap",
  };
  const styles = {
    primary: { background: "var(--brand-navy)", color: "var(--brand-parchment)" },
    secondary: { background: "transparent", color: "var(--brand-navy)", border: "1px solid var(--brand-navy)" },
    gold: { background: "var(--brand-gold)", color: "var(--brand-navy)" },
    ghost: { background: "transparent", color: "var(--brand-navy)", padding: "8px 0", textDecoration: "underline", textDecorationColor: "var(--brand-gold)", textUnderlineOffset: 3 },
  };
  return <button onClick={onClick} style={{ ...base, ...styles[variant] }}>{children}</button>;
}

// ---- Header / Footer ----------------------------------------------------

function Header({ active = "home" }) {
  const [scrolled, setScrolled] = useState(false);
  const nav = [
    { id: "templates", label: "Templates", href: "#" },
    { id: "bundles", label: "Bundles", href: "#" },
    { id: "blog", label: "Blog", href: "blog.html" },
    { id: "about", label: "About", href: "#" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 10, background: "var(--brand-parchment)",
      borderBottom: "1px solid var(--rule)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "18px 48px",
        display: "flex", alignItems: "center", gap: 32,
      }}>
        <a href="index.html" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          <Wordmark/>
        </a>
        <nav style={{ display: "flex", gap: 28, marginLeft: "auto", alignItems: "center" }}>
          {nav.map(n => (
            <a key={n.id} href={n.href} style={{
              fontFamily: "var(--font-body)", fontSize: 14, fontWeight: active === n.id ? 600 : 500,
              color: "var(--brand-navy)", textDecoration: "none",
              borderBottom: active === n.id ? "1px solid var(--brand-gold)" : "1px solid transparent",
              paddingBottom: 2,
            }}>{n.label}</a>
          ))}
          <Button variant="primary" size="md">Get the guide</Button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: "var(--brand-navy)", color: "var(--brand-parchment)", padding: "80px 48px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <Wordmark reverse/>
            <p style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18,
              color: "var(--brand-parchment)", marginTop: 20, maxWidth: 340, lineHeight: 1.4,
            }}>Run your rentals before they run you.</p>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 13,
              color: "var(--fg-on-navy-muted)", marginTop: 24, maxWidth: 340, lineHeight: 1.6,
            }}>Business-grade Excel systems for Airbnb &amp; VRBO hosts who treat their portfolio like a real business.</p>
          </div>
          {[
            ["Templates", ["Tax workbooks", "Operations", "Guest experience", "Pricing"]],
            ["Resources", ["The 47 guide", "Blog", "Inner Circle group", "Podcast"]],
            ["Company", ["About", "Contact", "Affiliate", "Terms & refunds"]],
          ].map(([title, items]) => (
            <div key={title}>
              <div style={{
                fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.22em",
                color: "var(--brand-gold)", textTransform: "uppercase", marginBottom: 18,
              }}>{title}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map(i => <li key={i}><a href="#" style={{
                  fontFamily: "var(--font-body)", fontSize: 14, color: "var(--brand-parchment)",
                  textDecoration: "none",
                }}>{i}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "var(--brand-gold)", width: 48, margin: "56px 0 20px" }}/>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "var(--fg-on-navy-muted)",
        }}>
          <span>© 2026 The STR Ledger · hello@thestrledger.com</span>
          <span>Not tax advice · consult your CPA</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Wordmark, Monogram, GoldRule, Eyebrow, Button, Header, Footer });
