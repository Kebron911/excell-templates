import { useEffect, useMemo, useRef, useState } from 'react';
import { calcDscr, DSCR_DEFAULTS } from '@/lib/calc/dscr';
import { formatCurrency, formatNumber } from '@str/format';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, Row, Actions } from './ui';

type UrlState = {
  rent: number;
  opex: number;
  loan: number;
  rate: number;
  term: number;
};

const DEFAULTS: UrlState = {
  rent: DSCR_DEFAULTS.monthlyRent,
  opex: DSCR_DEFAULTS.annualOpex,
  loan: DSCR_DEFAULTS.loanAmount,
  rate: DSCR_DEFAULTS.rateBps,
  term: DSCR_DEFAULTS.termYears,
};

const TOOL = 'dscr-calculator';

const TIER_LABEL: Record<string, string> = {
  A: 'A-tier — best DSCR rate sheet',
  B: 'B-tier — standard DSCR rate',
  rejected: 'Below 1.10x — most lenders will pass',
};

export default function DscrCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const result = useMemo(
    () =>
      calcDscr({
        monthlyRent: s.rent,
        annualOpex: s.opex,
        loanAmount: s.loan,
        rateBps: s.rate,
        termYears: s.term,
      }),
    [s],
  );

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
    if (Number.isFinite(result.dscr) && result.dscr > 0) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s, result.dscr]);

  const set = (key: keyof UrlState) => (v: number) => setS((p) => ({ ...p, [key]: v }));

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Property cash flow</p>
          <Field id="d-rent" label="Monthly STR revenue" prefix="$" value={s.rent} onChange={set('rent')} />
          <Field id="d-opex" label="Annual operating expenses" prefix="$" value={s.opex} onChange={set('opex')} />

          <p className="label text-navy mt-5">Loan terms</p>
          <Field id="d-loan" label="Loan amount" prefix="$" value={s.loan} onChange={set('loan')} />
          <Field id="d-rate" label="Rate (bps, 825 = 8.25%)" value={s.rate} onChange={set('rate')} step="1" />
          <Field id="d-term" label="Term (years)" value={s.term} onChange={set('term')} step="1" />
        </div>

        <div className="space-y-3">
          <p className="label text-navy">DSCR result</p>
          <div className="result-block" aria-live="polite" aria-atomic="true">
            <p className="text-caption text-ink-3 uppercase tracking-widest">DSCR</p>
            <p className="font-mono text-5xl text-navy m-0 leading-none mt-1" data-testid="calc-result">
              {Number.isFinite(result.dscr) ? formatNumber(result.dscr, { decimals: 2 }) + 'x' : '—'}
            </p>
            <p
              className={`mt-2 text-ui ${
                result.lenderTier === 'A'
                  ? 'text-accent'
                  : result.lenderTier === 'B'
                  ? 'text-navy'
                  : 'text-ink-3'
              }`}
            >
              {TIER_LABEL[result.lenderTier]}
            </p>

            <hr className="my-3 border-rule" />
            <Row label="Annual NOI" value={formatCurrency(result.annualNOI)} />
            <Row label="Monthly P&I" value={formatCurrency(result.monthlyPayment)} />
            <Row label="Annual debt service" value={formatCurrency(result.annualDebtService)} muted />

            <hr className="my-3 border-rule" />
            <div className="flex flex-col gap-1 text-small">
              <span className={result.qualifies10 ? 'text-navy' : 'text-ink-3'}>
                {result.qualifies10 ? '✓' : '·'} ≥ 1.00x (qualifies)
              </span>
              <span className={result.qualifies125 ? 'text-navy' : 'text-ink-3'}>
                {result.qualifies125 ? '✓' : '·'} ≥ 1.25x (standard rate)
              </span>
              <span className={result.qualifies150 ? 'text-navy' : 'text-ink-3'}>
                {result.qualifies150 ? '✓' : '·'} ≥ 1.50x (best rate)
              </span>
            </div>
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
