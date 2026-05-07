import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateCashOnCash, COC_DEFAULTS } from '@/lib/calc/cash-on-cash';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

const TOOL = 'cash-on-cash';

type UrlState = { cf: number; cash: number; }
const DEFAULTS: UrlState = { cf: COC_DEFAULTS.annualCashFlow, cash: COC_DEFAULTS.totalCashInvested };

const BENCHMARK_BADGE: Record<string, string> = {
  strong: 'bg-[color:var(--accent-100)] text-[color:var(--accent-900)]',
  solid: 'bg-parchment-alt text-navy',
  marginal: 'bg-amber-100 text-amber-900',
  revisit: 'bg-rose-100 text-rose-900',
};

export default function CashOnCashCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);
  const result = useMemo(
    () => calculateCashOnCash({ annualCashFlow: state.cf, totalCashInvested: state.cash }),
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
          <Field id="cf" label="Annual cash flow (post-debt service)" prefix="$"
            value={state.cf} onChange={(v) => setState((s) => ({ ...s, cf: v }))} />
          <Field id="cash" label="Total cash invested" prefix="$"
            value={state.cash} onChange={(v) => setState((s) => ({ ...s, cash: v }))} />
          <p className="text-caption text-ink-3 leading-snug">
            Cash invested = down payment + closing costs + furnishing + reserves.
            Use the Year-1 cash needs calculator if you need help totaling that.
          </p>
        </div>

        <div className="result-block" aria-live="polite" aria-atomic="true">
          <p className="text-caption text-ink-3 uppercase tracking-widest">Cash-on-cash return</p>
          <p className="font-mono text-hero text-navy leading-none mt-2">{formatPercent(result.coc)}</p>
          <span className={`inline-block mt-3 rounded-pill px-3 py-1 text-caption uppercase tracking-widest ${BENCHMARK_BADGE[result.benchmark]}`}>
            {result.benchmark}
          </span>
          <p className="mt-3 text-small text-ink-2 leading-snug">{result.note}</p>

          <hr className="my-4 border-rule" />
          <Row label="Annual cash flow" value={formatCurrency(state.cf)} muted />
          <Row label="Total cash invested" value={formatCurrency(state.cash)} muted />
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
