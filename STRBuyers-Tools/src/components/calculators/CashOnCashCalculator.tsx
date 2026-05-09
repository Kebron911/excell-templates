import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateCashOnCash } from '@/lib/calc/cash-on-cash';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, Row, Actions } from './ui';

type UrlState = { cf: number; cash: number };
const DEFAULTS: UrlState = { cf: 8000, cash: 120_000 };
const TOOL = 'cash-on-cash';

const TIER_COPY: Record<string, { label: string; tone: string }> = {
  excellent: { label: 'Excellent — top decile of STR returns', tone: 'text-accent' },
  good: { label: 'Good — solid return for an STR investor', tone: 'text-navy' },
  marginal: { label: 'Marginal — close to long-term-rental returns', tone: 'text-ink-2' },
  reject: { label: 'Reject — capital is better deployed elsewhere', tone: 'text-ink-3' },
};

export default function CashOnCashCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
    if (s.cash > 0 && Number.isFinite(s.cf)) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s]);

  const result = useMemo(
    () => calculateCashOnCash({ annualCashFlow: s.cf, totalCashInvested: s.cash }),
    [s],
  );
  const tone = TIER_COPY[result.tier];

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Inputs</p>
          <Field
            id="coc-cf"
            label="Annual cash flow (NOI − debt service)"
            prefix="$"
            value={s.cf}
            onChange={(v) => setS((p) => ({ ...p, cf: v }))}
          />
          <Field
            id="coc-cash"
            label="Total cash invested (down + closing + furnish + reserves)"
            prefix="$"
            value={s.cash}
            onChange={(v) => setS((p) => ({ ...p, cash: v }))}
          />
        </div>

        <div className="space-y-3">
          <p className="label text-navy">Cash-on-cash return</p>
          <div className="result-block" aria-live="polite">
            <p className="font-mono text-5xl text-navy m-0 leading-none" data-testid="calc-result">
              {formatPercent(result.cocReturn, { decimals: 2 })}
            </p>
            <p className={`mt-2 text-ui ${tone.tone}`}>{tone.label}</p>

            <hr className="my-3 border-rule" />
            <Row label="Annual cash flow" value={formatCurrency(s.cf)} />
            <Row label="Total cash invested" value={formatCurrency(s.cash)} muted />

            <hr className="my-3 border-rule" />
            <p className="label text-navy mb-2">Tier reference</p>
            <ul className="space-y-1 text-small text-ink-2">
              <li>≥ 8.00% — excellent</li>
              <li>5.00 – 8.00% — good</li>
              <li>2.00 – 5.00% — marginal</li>
              <li>&lt; 2.00% — reject</li>
            </ul>
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
