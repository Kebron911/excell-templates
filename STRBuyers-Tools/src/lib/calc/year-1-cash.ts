/**
 * Year-1 cash needs — every dollar that has to be on the table before
 * keys, plus the holding cost during ramp-up. Most STR buyers
 * underestimate the ramp; this calculator forces it onto the page.
 */

export interface Year1Inputs {
  downPayment: number;
  closingCosts: number;
  furnishings: number;
  reserves: number;
  monthsHoldingCost: number;
}

export interface Year1Result {
  total: number;
  breakdown: { label: string; amount: number }[];
}

export function calculateYear1Cash(i: Year1Inputs): Year1Result {
  const total =
    i.downPayment + i.closingCosts + i.furnishings + i.reserves + i.monthsHoldingCost;
  return {
    total,
    breakdown: [
      { label: 'Down payment', amount: i.downPayment },
      { label: 'Closing costs', amount: i.closingCosts },
      { label: 'Furnishing & setup', amount: i.furnishings },
      { label: 'Reserves', amount: i.reserves },
      { label: 'Ramp-up holding cost', amount: i.monthsHoldingCost },
    ],
  };
}
