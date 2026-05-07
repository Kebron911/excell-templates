import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateYear1Cash, YEAR_1_DEFAULTS } from '@/lib/calc/year-1-cash-needs';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

const TOOL = 'year-1-cash-needs';

type UrlState = {
  price: number; downPct: number; closingPct: number;
  furnishing: number; months: number; mexp: number;
}
const DEFAULTS: UrlState = {
  price: YEAR_1_DEFAULTS.purchasePrice,
  downPct: YEAR_1_DEFAULTS.downPaymentPct,
  closingPct: YEAR_1_DEFAULTS.closingCostsPct,
  furnishing: YEAR_1_DEFAULTS.furnishingBudget,
  months: YEAR_1_DEFAULTS.reserveMonths,
  mexp: YEAR_1_DEFAULTS.monthlyExpenseEstimate,
};

export default function Year1CashCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);
  const result = useMemo(
    () => calculateYear1Cash({
      purchasePrice: state.price,
      downPaymentPct: state.downPct,
      closingCostsPct: state.closingPct,
      furnishingBudget: state.furnishing,
      reserveMonths: state.months,
      monthlyExpenseEstimate: state.mexp,
    }),
    [state],
  );
  useEffect(() => {
    replaceUrlRef.current(state, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [state]);

  return (
    <section className="rounded-md border border-rule bg-white p-6">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-4">
          <Field id="price" label="Purchase price" prefix="$"
            value={state.price} onChange={(v) => setState((s) => ({ ...s, price: v }))} />
          <Field id="downPct" label="Down payment" suffix="0.00–1.00" step="0.01"
            value={state.downPct} onChange={(v) => setState((s) => ({ ...s, downPct: v }))} />
          <Field id="closingPct" label="Closing costs % of price" suffix="0.00–0.10" step="0.005"
            value={state.closingPct} onChange={(v) => setState((s) => ({ ...s, closingPct: v }))} />
          <Field id="furnishing" label="Furnishing budget" prefix="$"
            value={state.furnishing} onChange={(v) => setState((s) => ({ ...s, furnishing: v }))} />
          <Field id="months" label="Reserve months"
            value={state.months} onChange={(v) => setState((s) => ({ ...s, months: v }))} />
          <Field id="mexp" label="Monthly operating expense estimate" prefix="$"
            value={state.mexp} onChange={(v) => setState((s) => ({ ...s, mexp: v }))} />
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label={`Down (${formatPercent(state.downPct)})`} value={formatCurrency(result.downPayment)} muted />
          <Row label={`Closing costs (${formatPercent(state.closingPct)})`} value={formatCurrency(result.closingCosts)} muted />
          <Row label="Furnishing" value={formatCurrency(result.furnishing)} muted />
          <Row label={`Reserves (${state.months} mo × ${formatCurrency(state.mexp)})`} value={formatCurrency(result.operatingReserve)} muted />
          <hr className="my-2 border-rule" />
          <Row label="Total Year-1 cash" value={formatCurrency(result.totalCashNeeded)} bold accent />

          <div className="mt-4 grid grid-cols-2 gap-1 text-caption text-ink-3">
            <span>Down: {formatPercent(result.shares.downPct)}</span>
            <span>Close: {formatPercent(result.shares.closingPct)}</span>
            <span>Furnish: {formatPercent(result.shares.furnishingPct)}</span>
            <span>Reserve: {formatPercent(result.shares.reservePct)}</span>
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
