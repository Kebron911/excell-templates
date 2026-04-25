# Web UI Kit — thestrledger.com

Hi-fi recreation of the marketing hub, product page, blog post, and lead-magnet landing page — built from the locked brand spec (the site is not yet live, so this is from-spec, not fidelity-to-existing).

## Files

- `index.html` — homepage (hero, product row, tax-season campaign, blog preview, footer)
- `product.html` — Schedule E Workbook product detail page
- `blog.html` — "47 Airbnb Tax Deductions" long-form post
- `landing.html` — `/47` lead-magnet capture page
- `components/*.jsx` — reusable pieces (Header, Hero, ProductCard, BlogCard, Footer, Wordmark, Monogram, GoldRule, Button)

All pages depend on `../../colors_and_type.css` and share the component library.

## Click-through

From `index.html`: nav → `blog.html`, `landing.html`; product row → `product.html`; footer links work as anchors.
