const { useState } = React;

// Etsy's own colour system — neutral host chrome so the brand isn't fighting two
// identities. Etsy orange for CTAs, warm-gray nav, white canvas.
const ETSY = {
  orange: "#F1641E",
  orangeDark: "#C25117",
  nav: "#FFFFFF",
  navBorder: "#E1E3DF",
  navHover: "#F8F8F7",
  text: "#222222",
  text2: "#595959",
  text3: "#8F8F8F",
  rule: "#E1E3DF",
  canvas: "#FFFFFF",
  search: "#F8F8F7",
};

function EtsyTopNav({ cart = 2 }) {
  return (
    <div style={{ background: ETSY.nav, borderBottom: "1px solid " + ETSY.navBorder }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20 }}>
        {/* Etsy wordmark */}
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 28, color: ETSY.orange, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1 }}>Etsy</span>

        {/* Search */}
        <div style={{ flex: 1, display: "flex", alignItems: "stretch", maxWidth: 720 }}>
          <input placeholder="Search for anything" style={{
            flex: 1, padding: "12px 16px", fontSize: 14, fontFamily: "Helvetica, Arial, sans-serif",
            border: "2px solid " + ETSY.text, borderRight: 0, borderRadius: "40px 0 0 40px",
            outline: "none", background: ETSY.nav, color: ETSY.text,
          }} defaultValue="airbnb tax template"/>
          <button style={{
            background: ETSY.text, color: "white", border: 0, padding: "0 20px",
            borderRadius: "0 40px 40px 0", cursor: "pointer", fontSize: 14,
          }}>🔍</button>
        </div>

        {/* Right nav */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 12, color: ETSY.text2, fontFamily: "Helvetica, Arial, sans-serif" }}>
          <span>Sign in</span>
          <span>♡</span>
          <span>🎁</span>
          <span style={{ position: "relative" }}>🛒 {cart > 0 && <span style={{ position: "absolute", top: -6, right: -10, background: ETSY.orange, color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{cart}</span>}</span>
        </div>
      </div>
      {/* Category row */}
      <div style={{ borderTop: "1px solid " + ETSY.navBorder, padding: "10px 24px", display: "flex", gap: 24, maxWidth: 1280, margin: "0 auto", fontSize: 13, fontFamily: "Helvetica, Arial, sans-serif", color: ETSY.text2 }}>
        {["Gifts", "Fashion finds", "Home favorites", "Registry", "Sale", "Editors' picks", "Anniversary gifts"].map(c => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </div>
  );
}

function ShopBanner() {
  // The STR Ledger's brand banner dropped into Etsy's 1200×300 banner slot
  return (
    <div style={{ background: "var(--brand-navy)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 48px", position: "relative" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--brand-gold)" }}>Digital downloads · Est. 2025</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 56, letterSpacing: "-0.015em", color: "var(--brand-parchment)", margin: "14px 0 0", lineHeight: 1.05 }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>The</span> STR Ledger<span style={{ color: "var(--brand-gold)" }}>.</span>
        </h1>
        <div style={{ width: 56, height: 1, background: "var(--brand-gold)", margin: "20px 0" }}/>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, color: "var(--brand-parchment)", margin: 0, maxWidth: 520, lineHeight: 1.5 }}>
          Business-grade Excel workbooks for Airbnb &amp; VRBO hosts. Run your rentals before they run you.
        </p>
      </div>
    </div>
  );
}

function ShopOwnerBlock() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px", display: "flex", alignItems: "center", gap: 24, borderBottom: "1px solid " + ETSY.rule }}>
      {/* Monogram avatar */}
      <div style={{
        width: 88, height: 88, borderRadius: "50%", background: "var(--brand-navy)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em",
      }}>
        <span style={{ color: "var(--brand-parchment)" }}>S</span>
        <span style={{ color: "var(--brand-gold)" }}>L</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 22, fontWeight: 700, color: ETSY.text }}>TheSTRLedger</div>
        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, color: ETSY.text2, marginTop: 4 }}>
          <span style={{ color: "#111", fontWeight: 600 }}>4.9 ★</span> · 287 reviews · Smoky Mountains, TN · On Etsy since 2026
        </div>
        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13, color: ETSY.text2, marginTop: 4 }}>
          Tax and operations workbooks for STR hosts who treat their portfolio like a real business.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ padding: "10px 20px", fontSize: 14, border: "1px solid " + ETSY.text, background: "white", borderRadius: 22, cursor: "pointer", fontWeight: 600 }}>Contact</button>
        <button style={{ padding: "10px 22px", fontSize: 14, border: 0, background: ETSY.text, color: "white", borderRadius: 22, cursor: "pointer", fontWeight: 600 }}>★ Favorite shop</button>
      </div>
    </div>
  );
}

function Announcement() {
  return (
    <div style={{ background: "#FFF8EB", borderBottom: "1px solid " + ETSY.rule }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 48px", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, color: ETSY.text2, lineHeight: 1.5 }}>
        <strong style={{ color: ETSY.text }}>Announcement:</strong> Tax season is here. All five workbooks bundled at $97 (save $48) through April 15 —
        <a href="#" style={{ color: ETSY.orange, marginLeft: 6 }}>The Tax-Season Bundle →</a>
      </div>
    </div>
  );
}

function ShopNav({ active = "all" }) {
  const items = [
    { k: "all", label: "All items", count: 7 },
    { k: "tax", label: "Tax templates", count: 3 },
    { k: "ops", label: "Operations", count: 2 },
    { k: "guest", label: "Guest experience", count: 1 },
    { k: "bundle", label: "Bundles", count: 1 },
    { k: "reviews", label: "Reviews (287)" },
    { k: "about", label: "About" },
    { k: "policies", label: "Policies" },
  ];
  return (
    <nav style={{ borderBottom: "1px solid " + ETSY.rule }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px", display: "flex", gap: 28 }}>
        {items.map(i => (
          <button key={i.k} style={{
            padding: "18px 0", background: "transparent", border: 0, cursor: "pointer",
            fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14,
            color: i.k === active ? ETSY.text : ETSY.text2,
            borderBottom: i.k === active ? "2px solid " + ETSY.text : "2px solid transparent",
            fontWeight: i.k === active ? 600 : 400,
          }}>
            {i.label}{i.count !== undefined && <span style={{ color: ETSY.text3, marginLeft: 4 }}>({i.count})</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* A listing thumbnail — square (2000×2000), brand-styled, no photography */
function ListingThumb({ sku, cat, title, subtitle, price, strike, tint = "parchment", icon }) {
  const bg = tint === "navy" ? "var(--brand-navy)" : "var(--brand-parchment)";
  const fg = tint === "navy" ? "var(--brand-parchment)" : "var(--brand-navy)";
  const muted = tint === "navy" ? "var(--fg-on-navy-muted)" : "var(--fg-2)";
  const accent = "var(--brand-gold)";
  return (
    <div style={{
      aspectRatio: "1 / 1", background: bg, color: fg, padding: "36px 32px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative",
    }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: accent }}>{sku} · {cat}</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 34, letterSpacing: "-0.015em", lineHeight: 1.08, marginTop: 14 }}>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>The</span><br/>{title}<span style={{ color: accent }}>.</span>
        </div>
      </div>
      <div>
        <div style={{ width: 40, height: 1, background: accent, marginBottom: 14 }}/>
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, color: muted, lineHeight: 1.45, maxWidth: 280 }}>{subtitle}</div>
      </div>
    </div>
  );
}

function ListingCard({ sku, cat, title, subtitle, etsyTitle, price, strike, reviews, fav, tint }) {
  const [h, setH] = useState(false);
  return (
    <a href="listing.html" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      textDecoration: "none", color: ETSY.text, display: "block",
      transform: h ? "translateY(-2px)" : "none", transition: "transform 200ms",
    }}>
      <div style={{ position: "relative" }}>
        <ListingThumb sku={sku} cat={cat} title={title} subtitle={subtitle} tint={tint}/>
        <button style={{
          position: "absolute", top: 10, right: 10,
          width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.95)",
          border: 0, cursor: "pointer", fontSize: 16,
        }}>♡</button>
        {strike && (
          <div style={{
            position: "absolute", bottom: 10, left: 10,
            background: ETSY.orange, color: "white",
            padding: "4px 10px", fontSize: 11, fontWeight: 700,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}>Bestseller</div>
        )}
      </div>
      <div style={{ padding: "12px 4px" }}>
        <div style={{
          fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 500,
          color: ETSY.text, lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", textOverflow: "ellipsis", minHeight: 38,
        }}>{etsyTitle}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
          <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 700, color: ETSY.text }}>${price}</span>
          {strike && <span style={{ fontSize: 13, color: ETSY.text3, textDecoration: "line-through" }}>${strike}</span>}
          {strike && <span style={{ fontSize: 12, color: "#217A42", fontWeight: 600 }}>Sale</span>}
        </div>
        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, color: ETSY.text2, marginTop: 4 }}>
          <span style={{ color: "#111" }}>★</span> {reviews ? `(${reviews})` : ""} · {fav} favorites
        </div>
      </div>
    </a>
  );
}

Object.assign(window, { EtsyTopNav, ShopBanner, ShopOwnerBlock, Announcement, ShopNav, ListingThumb, ListingCard, ETSY });
