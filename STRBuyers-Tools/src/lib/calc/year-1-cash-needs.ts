/**
 * Year-1 Cash Needs — pure logic.
 *
 * Aggregates the all-in cash a buyer needs to land before the property starts
 * paying for itself. Captures the obvious (down + closing) plus the items
 * first-time STR buyers underestimate (furnishing, operating reserves).
 */

export interface Year1CashInput {
  purchasePrice: number;
  downPaymentPct: number;       // 0–1 decimal
  closingCostsPct: number;      // 0–1 decimal of purchase price
  furnishingBudget: number;     // dollar amount
  reserveMonths: number;        // months of operating reserve
  monthlyExpenseEstimate: number;  // mortgage + taxes + insurance + utilities
}

export interface Year1CashResult {
  downPayment: number;
  closingCosts: number;
  furnishing: number;
  operatingReserve: number;
  totalCashNeeded: number;
  /** Per-bucket share of total, useful for visualizations. */
  shares: {
    downPct: number;
    closingPct: number;
    furnishingPct: number;
    reservePct: number;
  };
}

export const YEAR_1_DEFAULTS: Year1CashInput = {
  purchasePrice: 425_000,
  downPaymentPct: 0.20,
  closingCostsPct: 0.03,
  furnishingBudget: 18_000,
  reserveMonths: 6,
  monthlyExpenseEstimate: 3_500,
};

export function calculateYear1Cash(i: Year1CashInput): Year1CashResult {
  const downPayment = i.purchasePrice * i.downPaymentPct;
  const closingCosts = i.purchasePrice * i.closingCostsPct;
  const furnishing = i.furnishingBudget;
  const operatingReserve = i.reserveMonths * i.monthlyExpenseEstimate;

  const totalCashNeeded = downPayment + closingCosts + furnishing + operatingReserve;

  const shares = totalCashNeeded > 0
    ? {
        downPct: downPayment / totalCashNeeded,
        closingPct: closingCosts / totalCashNeeded,
        furnishingPct: furnishing / totalCashNeeded,
        reservePct: operatingReserve / totalCashNeeded,
      }
    : { downPct: 0, closingPct: 0, furnishingPct: 0, reservePct: 0 };

  return { downPayment, closingCosts, furnishing, operatingReserve, totalCashNeeded, shares };
}
