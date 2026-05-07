/**
 * Airbnb fee calculator — pure logic.
 *
 * Models the host-only fee structure (now default for most hosts):
 *   subtotal           = nightlyRate * nights + cleaningFee
 *   hostFee            = subtotal * hostFeeRate          (default 3%)
 *   guestServiceFee    = subtotal * guestFeeRate         (default 14%)
 *   guestTotal         = subtotal + guestServiceFee
 *   hostPayout         = subtotal - hostFee
 *
 * Lodging tax is NOT modeled here — see /lodging-tax for state-by-state rates.
 */

export interface AirbnbFeeInput {
  nightlyRate: number;
  nights: number;
  cleaningFee: number;
  hostFeeRate: number;   // 0.03 default (host-only fee structure)
  guestFeeRate: number;  // 0.14 default (typical, varies by trip)
}

export interface AirbnbFeeResult {
  subtotal: number;
  hostFee: number;
  guestServiceFee: number;
  guestTotal: number;
  hostPayout: number;
}

export const AIRBNB_FEE_DEFAULTS = {
  nightlyRate: 200,
  nights: 3,
  cleaningFee: 100,
  hostFeeRate: 0.03,
  guestFeeRate: 0.14,
} as const;

export function calculateAirbnbFee(i: AirbnbFeeInput): AirbnbFeeResult {
  const subtotal = i.nightlyRate * i.nights + i.cleaningFee;
  const hostFee = subtotal * i.hostFeeRate;
  const guestServiceFee = subtotal * i.guestFeeRate;
  return {
    subtotal,
    hostFee,
    guestServiceFee,
    guestTotal: subtotal + guestServiceFee,
    hostPayout: subtotal - hostFee,
  };
}
