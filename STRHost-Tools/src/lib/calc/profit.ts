/**
 * STR profitability calculator — pure logic.
 *
 * Models a multi-month P&L given booked nights, ADR, and itemized variable +
 * fixed costs. Property tax is supplied annually and prorated to the months
 * window. Management fee is a fraction of gross revenue.
 *
 *   grossRevenue   = adr * nightsBooked
 *   variableCosts  = cleaningPerTurnover * turnovers
 *                  + suppliesPerNight   * nightsBooked
 *                  + utilitiesMonthly   * months
 *                  + platformFees
 *   fixedCosts     = mortgageMonthly    * months
 *                  + insuranceMonthly   * months
 *                  + (propertyTaxAnnual * months) / 12
 *                  + hoaMonthly         * months
 *                  + managementFeeRate  * grossRevenue
 *   netProfit      = grossRevenue - variableCosts - fixedCosts
 *   profitMargin   = netProfit / grossRevenue, or 0 when grossRevenue is 0
 */

export interface ProfitInput {
  adr: number;
  nightsBooked: number;
  turnovers: number;
  cleaningPerTurnover: number;
  suppliesPerNight: number;
  utilitiesMonthly: number;
  platformFees: number;
  mortgageMonthly: number;
  insuranceMonthly: number;
  propertyTaxAnnual: number;
  hoaMonthly: number;
  managementFeeRate: number;
  months: number;
}

export interface ProfitResult {
  grossRevenue: number;
  variableCosts: number;
  fixedCosts: number;
  netProfit: number;
  profitMargin: number;
}

export const PROFIT_DEFAULTS: ProfitInput = {
  adr: 200,
  nightsBooked: 20,
  turnovers: 8,
  cleaningPerTurnover: 100,
  suppliesPerNight: 5,
  utilitiesMonthly: 250,
  platformFees: 120,
  mortgageMonthly: 1800,
  insuranceMonthly: 100,
  propertyTaxAnnual: 4800,
  hoaMonthly: 50,
  managementFeeRate: 0,
  months: 1,
};

export function calculateProfit(i: ProfitInput): ProfitResult {
  const grossRevenue = i.adr * i.nightsBooked;
  const variableCosts =
    i.cleaningPerTurnover * i.turnovers +
    i.suppliesPerNight * i.nightsBooked +
    i.utilitiesMonthly * i.months +
    i.platformFees;
  const fixedCosts =
    i.mortgageMonthly * i.months +
    i.insuranceMonthly * i.months +
    (i.propertyTaxAnnual * i.months) / 12 +
    i.hoaMonthly * i.months +
    i.managementFeeRate * grossRevenue;
  const netProfit = grossRevenue - variableCosts - fixedCosts;
  const profitMargin = grossRevenue > 0 ? netProfit / grossRevenue : 0;
  return { grossRevenue, variableCosts, fixedCosts, netProfit, profitMargin };
}
