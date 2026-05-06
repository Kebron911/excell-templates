export interface ManualMeta {
  sku: string;
  slug: string;
  title: string;
  shortSku: string;
  priceCents: number;
  pdfPath?: string;       // unset for bundle SKUs (assembled dynamically)
  bundleOf?: string[];    // for bundle SKUs: list of constituent SKUs
  companion: { name: string; url: string };
  nextManualSlug?: string;
}

export const MANUALS: Record<string, ManualMeta> = {
  'str-tax-loophole-playbook': {
    sku: 'str-tax-loophole-playbook',
    slug: 'tax-01',
    title: 'The STR Tax Loophole Playbook',
    shortSku: 'TAX-01',
    priceCents: 2900,
    pdfPath: 'private/manuals/str-tax-loophole-playbook/v1.pdf',
    companion: {
      name: 'TAX-002 P&L Workbook',
      url: 'https://thestrledger.com/templates/pl-single-property',
    },
    nextManualSlug: 'tax-02',
  },
  'material-participation-survival-kit': {
    sku: 'material-participation-survival-kit',
    slug: 'tax-02',
    title: 'Material Participation Survival Kit',
    shortSku: 'TAX-02',
    priceCents: 2900,
    pdfPath: 'private/manuals/material-participation-survival-kit/v1.pdf',
    companion: {
      name: 'Hours Log Template',
      url: 'https://thestrledger.com/templates/material-participation-log',
    },
    nextManualSlug: 'tax-01',
  },
  'why-bookings-down': {
    sku: 'why-bookings-down',
    slug: 'rev-01',
    title: 'Why Are My Bookings Down?',
    shortSku: 'REV-01',
    priceCents: 1900,
    pdfPath: 'private/manuals/why-bookings-down/v1.pdf',
    companion: {
      name: 'Break-Even Occupancy Workbook',
      url: 'https://thestrledger.com/templates/break-even-occupancy',
    },
    nextManualSlug: 'rev-02',
  },
  'direct-bookings-starter': {
    sku: 'direct-bookings-starter',
    slug: 'rev-02',
    title: 'Direct Bookings Starter',
    shortSku: 'REV-02',
    priceCents: 2500,
    pdfPath: 'private/manuals/direct-bookings-starter/v1.pdf',
    companion: {
      name: 'Direct-Booking Email Sequence Pack',
      url: 'https://thestrledger.com/templates/direct-booking-emails',
    },
    nextManualSlug: 'rev-01',
  },
  'permit-regulation-survival': {
    sku: 'permit-regulation-survival',
    slug: 'lgl-01',
    title: 'STR Permit & Regulation Survival Guide',
    shortSku: 'LGL-01',
    priceCents: 2500,
    pdfPath: 'private/manuals/permit-regulation-survival/v1.pdf',
    companion: {
      name: 'Permit Research Worksheet',
      url: 'https://thestrledger.com/templates/permit-research',
    },
    nextManualSlug: 'tax-01',
  },
  'str-manuals-bundle': {
    sku: 'str-manuals-bundle',
    slug: 'bundle',
    title: 'All Five Manuals (Bundle)',
    shortSku: 'BUNDLE-01',
    priceCents: 9900,
    bundleOf: [
      'str-tax-loophole-playbook',
      'material-participation-survival-kit',
      'why-bookings-down',
      'direct-bookings-starter',
      'permit-regulation-survival',
    ],
    companion: { name: 'All five companion workbooks', url: 'https://thestrledger.com' },
  },
};

const STRIPE_PRICE_TO_SKU: Record<string, string> = {
  [import.meta.env.STRIPE_PRICE_TAX_01 || 'price_strmanuals_tax01_v1']: 'str-tax-loophole-playbook',
  [import.meta.env.STRIPE_PRICE_TAX_02 || 'price_strmanuals_tax02_v1']: 'material-participation-survival-kit',
  [import.meta.env.STRIPE_PRICE_REV_01 || 'price_strmanuals_rev01_v1']: 'why-bookings-down',
  [import.meta.env.STRIPE_PRICE_REV_02 || 'price_strmanuals_rev02_v1']: 'direct-bookings-starter',
  [import.meta.env.STRIPE_PRICE_LGL_01 || 'price_strmanuals_lgl01_v1']: 'permit-regulation-survival',
  [import.meta.env.STRIPE_PRICE_BUNDLE || 'price_strmanuals_bundle01_v1']: 'str-manuals-bundle',
};

export function skuFromPriceId(priceId: string): string | null {
  return STRIPE_PRICE_TO_SKU[priceId] ?? null;
}

export function getManual(sku: string): ManualMeta | null {
  return MANUALS[sku] ?? null;
}
