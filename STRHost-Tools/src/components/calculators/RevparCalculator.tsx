import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateRevpar, REVPAR_DEFAULTS } from '@/lib/calc/revpar';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

type UrlState = {
  avail: number;
  booked: number;
  rev: number;
};

const DEFAULTS: UrlState = {
  avail: REVPAR_DEFAULTS.nightsAvailable,
  booked: REVPAR_DEFAULTS.nightsBooked,
  rev: REVPAR_DEFAULTS.revenue,
};

const TOOL = 'revpar-calculator';

export default function RevparCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const result = useMemo(
    () => calculateRevpar({
      nightsAvailable: s.avail,
      nightsBooked: s.booked,
      revenue: s.rev,
    }),
    [s],
  );

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [s]);

  const set = (k: keyof UrlState) => (v: number) => setS((prev) => ({ ...prev, [k]: v }));

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-3">
          <Field id="r-avail" label="Nights available" value={s.avail} onChange={set('avail')} step="1" />
          <Field id="r-booked" label="Nights booked" value={s.booked} onChange={set('booked')} step="1" />
          <Field id="r-rev" label="Revenue (period)" prefix="$" value={s.rev} onChange={set('rev')} />
          <p className="text-caption text-ink-3 leading-snug">
            Use a consistent period — typically 30 days for monthly, 365 for annual. Revenue is gross, before fees.
          </p>
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label="Occupancy" value={formatPercent(result.occupancy)} bold accent />
          <Row label="ADR (avg daily rate)" value={formatCurrency(result.adr)} bold accent />
          <Row label="RevPAR" value={formatCurrency(result.revpar)} bold accent />
          <p className="mt-3 text-caption text-ink-3 leading-snug">
            <span className="font-mono">RevPAR = ADR × Occupancy</span>. It collapses both metrics into one comparable number, so a 50%-occupancy luxury listing and a 90%-occupancy budget listing become directly comparable.
          </p>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
