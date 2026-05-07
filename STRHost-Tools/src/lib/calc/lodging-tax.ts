/**
 * Lodging tax calculator — pure logic.
 *
 *   effectiveRate = stateRate + localRate
 *   taxAmount     = subtotal * effectiveRate
 *   guestTotal    = subtotal + taxAmount
 *
 * State rate comes from src/data/lodging-tax-by-state.json (50 states + DC).
 * Local rate is supplied by the user within [localAddOnRange[0], localAddOnRange[1]]
 * since rates vary by city/county within most states.
 */

export interface LodgingTaxInput {
  subtotal: number;
  stateRate: number;
  localRate: number;
}

export interface LodgingTaxResult {
  effectiveRate: number;
  taxAmount: number;
  guestTotal: number;
}

export function calculateLodgingTax(i: LodgingTaxInput): LodgingTaxResult {
  const effectiveRate = i.stateRate + i.localRate;
  const taxAmount = i.subtotal * effectiveRate;
  return { effectiveRate, taxAmount, guestTotal: i.subtotal + taxAmount };
}
