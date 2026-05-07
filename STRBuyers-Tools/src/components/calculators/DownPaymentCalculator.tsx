import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateDownPayment, DOWN_PAYMENT_DEFAULTS, type LoanTypeKey } from '@/lib/calc/down-payment';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';
import loanTypes from '@/data/loan-types.json';

type UrlState = { price: number; loan: LoanTypeKey; }
const DEFAULTS: UrlState = { price: DOWN_PAYMENT_DEFAULTS.purchasePrice, loan: DOWN_PAYMENT_DEFAULTS.loanType };
const TOOL = 'down-payment-calculator';

const LOAN_OPTIONS = Object.entries(loanTypes) as Array<[LoanTypeKey, { label: string }]>;

export default function DownPaymentCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);
  const result = useMemo(
    () => calculateDownPayment({ purchasePrice: state.price, loanType: state.loan }),
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
          <label className="block">
            <span className="block text-ui text-navy mb-1">Loan type</span>
            <select
              className="font-mono w-full px-3 py-2 border border-rule rounded-md bg-parchment-light focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              value={state.loan}
              onChange={(e) => setState((s) => ({ ...s, loan: e.target.value as LoanTypeKey }))}
            >
              {LOAN_OPTIONS.map(([key, lt]) => (
                <option key={key} value={key}>{lt.label}</option>
              ))}
            </select>
          </label>
          <p className="text-caption text-ink-3 leading-snug">{result.note}</p>
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label={`Min down (${formatPercent(result.minDownPct)})`} value={formatCurrency(result.downPayment)} muted />
          <Row label="Loan amount" value={formatCurrency(result.loanAmount)} muted />
          <Row label={`Estimated rate (${formatPercent(result.estimatedRatePct)})`} value={`${result.termYears}y term`} muted />
          <hr className="my-2 border-rule" />
          <Row label="Estimated monthly P&I" value={formatCurrency(result.estimatedMonthlyPI)} bold accent />
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
