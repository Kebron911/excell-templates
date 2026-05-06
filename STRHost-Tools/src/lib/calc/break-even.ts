/**
 * Break-even occupancy — pure logic.
 *
 *   monthlyCosts        = mortgage + insurance + propertyTaxAnnual/12
 *                       + hoa + utilities + otherFixed
 *   netPerNight         = adr * (1 - feeRate)
 *                       - cleaningPerTurnover - variablePerNight
 *   breakEvenNights     = monthlyCosts / netPerNight   (Infinity if net <= 0)
 *   breakEvenOccupancy  = breakEvenNights / 30         (Infinity if not feasible)
 *   feasible            = netPerNight > 0
 *
 * If the property cannot break even at the given ADR (cleaning + fees + variable
 * costs exceed the booking price), feasibility is false and downstream metrics
 * are non-finite. Callers should render "not feasible at this ADR" copy.
 */

export interface BreakEvenInput {
  mortgage: number;
  insurance: number;
  propertyTaxAnnual: number;
  hoa: number;
  utilities: number;
  otherFixed: number;
  adr: number;
  feeRate: number;
  cleaningPerTurnover: number;
  variablePerNight: number;
}

export interface BreakEvenResult {
  monthlyCosts: number;
  netPerNight: number;
  breakEvenNights: number;
  breakEvenOccupancy: number;
  feasible: boolean;
}

export const BREAK_EVEN_DEFAULTS: BreakEvenInput = {
  mortgage: 1800,
  insurance: 100,
  propertyTaxAnnual: 4800,
  hoa: 50,
  utilities: 250,
  otherFixed: 0,
  adr: 200,
  feeRate: 0.03,
  cleaningPerTurnover: 100,
  variablePerNight: 5,
};

export function calculateBreakEven(i: BreakEvenInput): BreakEvenResult {
  const monthlyCosts =
    i.mortgage +
    i.insurance +
    i.propertyTaxAnnual / 12 +
    i.hoa +
    i.utilities +
    i.otherFixed;
  const netPerNight = i.adr * (1 - i.feeRate) - i.cleaningPerTurnover - i.variablePerNight;
  const feasible = netPerNight > 0;
  const breakEvenNights = feasible ? monthlyCosts / netPerNight : Infinity;
  const breakEvenOccupancy = feasible ? breakEvenNights / 30 : Infinity;
  return { monthlyCosts, netPerNight, breakEvenNights, breakEvenOccupancy, feasible };
}
