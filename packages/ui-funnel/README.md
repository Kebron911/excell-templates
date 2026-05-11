# @str/ui-funnel

Conversion-focused components: EmailCaptureCard, STRLedgerCTA, ClusterFunnelBlock, AdSlot.

All components accept a `siteConfig: SiteConfig` prop (from `@str/seo`) for parameterization.

## Usage

```astro
---
import EmailCaptureCard from '@str/ui-funnel/EmailCaptureCard.astro';
import STRLedgerCTA from '@str/ui-funnel/STRLedgerCTA.astro';
import ClusterFunnelBlock from '@str/ui-funnel/ClusterFunnelBlock.astro';
import AdSlot from '@str/ui-funnel/AdSlot.astro';
import { siteConfig } from '@/data/site.config';
---

<EmailCaptureCard
  siteConfig={siteConfig}
  magnet="house-rules-pdf"
  endpoint="/api/email-gate"
/>

<STRLedgerCTA
  siteConfig={siteConfig}
  tool="house-rules-pdf"
/>

<ClusterFunnelBlock
  siteConfig={siteConfig}
  currentCluster="guest-xp"
/>

<AdSlot
  siteConfig={siteConfig}
  location="in-content"
  slotId="1234567890"
/>
```

## Components

### EmailCaptureCard

Inline content-styled email capture card. Posts to an ESP webhook from the static client.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `siteConfig` | `SiteConfig` | yes | Site configuration |
| `magnet` | `string` | yes | ESP magnet identifier for subscription tagging |
| `toolSlug` | `string` | no | Tool slug for UTM attribution (default: `'unknown'`) |
| `headline` | `string` | no | Card headline copy |
| `blurb` | `string` | no | Card body copy |
| `cta` | `string` | no | Submit button label |
| `endpoint` | `string` | no | Webhook URL (see email-gate decoupling below) |

### STRLedgerCTA

Deep-links to a matching SKU on thestrledger.com with UTM tracking. Copy defaults per tool slug.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `siteConfig` | `SiteConfig` | yes | Site configuration (used for UTM source) |
| `tool` | `string` | yes | Generator slug for copy + SKU lookup |
| `headline` | `string` | no | Override headline |
| `blurb` | `string` | no | Override blurb |
| `cta` | `string` | no | Override CTA label |
| `skuPath` | `string` | no | Override SKU path on thestrledger.com |

### ClusterFunnelBlock

Cross-cluster funnel links. Renders links to the other 3 STR cluster sites (hides current).

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `siteConfig` | `SiteConfig` | yes | Site configuration |
| `currentCluster` | `'acquisition' \| 'math' \| 'operations' \| 'guest-xp'` | yes | Current site cluster (excluded from links) |

### AdSlot

Pre-AdSense placeholder; flips to `<ins class="adsbygoogle">` when approved.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `siteConfig` | `SiteConfig` | yes | Site configuration |
| `location` | `'in-content' \| 'footer'` | yes | Placement slot |
| `slotId` | `string` | no | AdSense slot ID once approved |

## Email-gate decoupling

`EmailCaptureCard` accepts an `endpoint` prop. The site is responsible for the server endpoint
that handles the POST. This decouples the UI from any specific email-gate backend (ESP webhook,
`@str/email-gate` MySQL, ConvertKit, etc.).

```astro
<!-- Pass explicit endpoint — decoupled from env var -->
<EmailCaptureCard
  siteConfig={siteConfig}
  magnet="house-rules-pdf"
  endpoint="/api/email-gate"
/>

<!-- Omit endpoint — falls back to PUBLIC_ESP_WEBHOOK env var (backward compat) -->
<EmailCaptureCard
  siteConfig={siteConfig}
  magnet="house-rules-pdf"
/>
```

The ESP webhook **payload shape is preserved** for backward compatibility:

```json
{
  "email": "user@example.com",
  "magnet": "house-rules-pdf",
  "source": "guests-tools",
  "tool": "house-rules-pdf",
  "utm_source": "guests-tools",
  "utm_medium": "email-capture",
  "utm_content": "house-rules-pdf",
  "ts": 1715000000000
}
```

Existing webhook handlers keep working at Task 8 wire-up without changes.
