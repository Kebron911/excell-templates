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

## Sidebar vs AppSidebar

| Component | When to use |
|---|---|
| `Sidebar` | Simple nav from `siteConfig.nav`. No item-level control. |
| `AppSidebar` | Tool/page-level nav with an explicit `items` array. Supports 2-line cards and 1-line nav. |

### AppSidebar API

```astro
---
import AppSidebar from '@str/ui-chrome/AppSidebar.astro';
---

<AppSidebar
  siteConfig={siteConfig}
  items={[
    { slug: 'house-rules', label: 'House Rules', description: 'PDF generator', href: '/house-rules-pdf' },
    { slug: 'wifi-sign', label: 'Wi-Fi Sign', description: 'Print-ready PDF' },
    { slug: 'turnover-scheduler', label: 'Turnover scheduler' },
  ]}
  current="wifi-sign"
  maxItems={6}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `siteConfig` | `SiteConfig` | yes | — | Site configuration from `@str/seo` |
| `items` | `SidebarItem[]` | yes | — | Ordered list of sidebar items |
| `current` | `string` | no | — | Slug of active page; excluded from list |
| `maxItems` | `number` | no | `6` | Max items to render |

**SidebarItem shape:**

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | yes | Unique ID; matched against `current` |
| `label` | `string` | yes | Primary label (always shown) |
| `description` | `string` | no | 2nd line; omit for 1-line nav link |
| `href` | `string` | no | Explicit href; defaults to `/${slug}` |

**Render modes:**
- `description` present → 2-line card (label + description), STRGuests style
- `description` absent → 1-line nav link, STROps style
