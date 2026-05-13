/**
 * Email-capture card copy keyed by magnet slug. The shared
 * EmailCaptureCard component defaults to STRGuests Welcome Book copy
 * when these props are omitted, so every STROps placement must pass
 * site-appropriate copy.
 */

export interface MagnetCopy {
  headline: string;
  blurb: string;
  cta: string;
}

export const MAGNET_COPY: Record<string, MagnetCopy> = {
  'cleaner-sop': {
    headline: 'Free STR Cleaner SOP — printable, edit once, hand to every cleaner',
    blurb: "We'll email you the editable Cleaner SOP master template. Turn-by-turn checklist your cleaners actually follow.",
    cta: 'Email me the SOP',
  },
  'maintenance-checklist': {
    headline: 'Free STR Maintenance Checklist — per-turn, monthly, quarterly, annual',
    blurb: "We'll email you the editable maintenance checklist. Four cadences in one printable, calibrated for short-term rental wear.",
    cta: 'Email me the checklist',
  },
  'supply-par': {
    headline: 'Free STR Supply Par-Level Sheet — never run out, never overbuy',
    blurb: "We'll email you the editable supply par sheet. Per-bedroom par levels for every consumable in your closet.",
    cta: 'Email me the par sheet',
  },
};

export function magnetCopyFor(magnet: string | undefined): MagnetCopy {
  return MAGNET_COPY[magnet ?? ''] ?? MAGNET_COPY['cleaner-sop'];
}
