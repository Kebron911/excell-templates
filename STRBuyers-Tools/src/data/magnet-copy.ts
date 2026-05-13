/**
 * Email-capture card copy keyed by magnet slug. EmailCaptureCard
 * defaults to STRGuests Welcome Book copy when these props are omitted,
 * so every STRBuyers placement must pass site-appropriate copy.
 */

export interface MagnetCopy {
  headline: string;
  blurb: string;
  cta: string;
}

export const MAGNET_COPY: Record<string, MagnetCopy> = {
  'str-buyer-playbook': {
    headline: "Free STR Buyer's Playbook — pre-purchase math, before you sign",
    blurb: "We'll email you the editable playbook. DSCR ratios, down-payment-by-loan-type, Year 1 cash reserves, comp ranges — every number you'd hand to a lender or partner.",
    cta: 'Email me the playbook',
  },
  'buyer-checklist': {
    headline: "Free STR Buyer's Checklist — every question to ask before you buy",
    blurb: "We'll email you the editable buyer checklist. Regulation, financing, market, property, insurance — the full pre-offer audit on one printable.",
    cta: 'Email me the checklist',
  },
};

const CITY_PREFIX = 'city-deep-dive-';

const CITY_DEFAULT: MagnetCopy = {
  headline: 'Free STR market deep-dive — see this market through a buyer’s eyes',
  blurb: "We'll email you the editable deep-dive for this market. Regulation status, average ADR, saturation tier, and the questions that decide whether to make an offer.",
  cta: 'Email me the deep-dive',
};

export function magnetCopyFor(magnet: string | undefined): MagnetCopy {
  if (magnet?.startsWith(CITY_PREFIX)) return CITY_DEFAULT;
  return MAGNET_COPY[magnet ?? ''] ?? MAGNET_COPY['str-buyer-playbook'];
}
