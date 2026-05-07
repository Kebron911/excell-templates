import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateDscr, DSCR_DEFAULTS } from '@/lib/calc/dscr';
import { formatCurrency } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

type UrlState = { rent: number; pitia: number; }
const DEFAULTS: UrlState = { rent: DSCR_DEFAULTS.monthlyRent, pitia: DSCR_DEFAULTS.monthlyPitia };
const TOOL = 'dscr-calculator';

const TIER_BADGE: Record<string, string> = {
  strong: 'bg-[color:var(--accent-100)] text-[color:var(--accent-900)]',
  qualifying: 'bg-parchment-alt text-navy',
  short: 'bg-rose-100 text-rose-900',
};

export default function DscrCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);
  const result = useMemo(
    () => calculateDscr({ monthlyRent: state.rent, monthlyPitia: state.pitia }),
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
          <Field id="rent" label="Expected monthly gross rent" prefix="$"
            value={state.rent} onChange={(v) => setState((s) => ({ ...s, rent: v }))} />
          <Field id="pitia" label="Monthly PITIA payment" prefix="$"
            value={state.pitia} onChange={(v) => setState((s) => ({ ...s, pitia: v }))} />
          <p className="text-caption text-ink-3 leading-snug">
            PITIA = Principal + Interest + Taxes + Insurance + HOA/Association.
            Rent should reflect the lender's 1007 form / market rent letter.
          </p>
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label="Annualized rent" value={formatCurrency(state.rent * 12)} muted />
          <Row label="Annualized PITIA" value={formatCurrency(state.pitia * 12)} muted />
          <hr className="my-2 border-rule" />
          <div className="flex justify-between items-baseline">
            <span className="text-ui font-semibold">DSCR ratio</span>
            <span className="font-mono text-h3 text-navy">{result.ratio.toFixed(2)}</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block rounded-pill px-3 py-1 text-caption uppercase tracking-widest ${TIER_BADGE[result.tier]}`}>
              {result.tier}
            </span>
          </div>
          <p className="mt-2 text-small text-ink-2 leading-snug">{result.note}</p>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
