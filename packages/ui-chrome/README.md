# @str/ui-chrome

Site shell components shared across STR-Tools apps: Header, Footer, Sidebar, Layout, Wordmark, FunnelBand.

## Usage

```astro
---
import Header from '@str/ui-chrome/Header.astro';
import Layout from '@str/ui-chrome/Layout.astro';
import { siteConfig } from '@/data/site.config';
---

<Layout siteConfig={siteConfig} title="Page title">
  <Header siteConfig={siteConfig} />
  <slot />
</Layout>
```

## Per-site customization

Components accept a `siteConfig: SiteConfig` prop (from `@str/seo`). All site-specific values
(brand name, nav items, footer links, canonical URL) are read from siteConfig. Slots are
provided for genuinely site-unique cases:

- `<slot name="header-cta" />` — replace the default header CTA
- `<slot name="footer-extra" />` — append to footer
- `<slot name="funnel-banner-override" />` — replace FunnelBand entirely (e.g., STRBuyers's 38-line variant)
