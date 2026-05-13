/**
 * Email-capture card copy keyed by magnet slug. EmailCaptureCard
 * defaults to STRGuests Welcome Book copy when these props are omitted,
 * so every STRHost placement must pass site-appropriate copy.
 */

export interface MagnetCopy {
  headline: string;
  blurb: string;
  cta: string;
}

export const MAGNET_COPY: Record<string, MagnetCopy> = {
  'str-host-income-report-2026': {
    headline: 'Free STR Host Income Report 2026 — what changed since last year',
    blurb: "We'll email you the editable income report. Real numbers across seven markets, RevPAR and fee shifts since 2025, and how hosts adjusted pricing.",
    cta: 'Email me the report',
  },
};

export function magnetCopyFor(magnet: string | undefined): MagnetCopy {
  return MAGNET_COPY[magnet ?? ''] ?? MAGNET_COPY['str-host-income-report-2026'];
}
