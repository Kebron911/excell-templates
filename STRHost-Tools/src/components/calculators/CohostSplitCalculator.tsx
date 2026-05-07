import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateCohostSplit, COHOST_DEFAULTS, type CohostMode } from '@/lib/calc/cohost-split';
import { formatCurrency } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

type UrlState = {
  mode: string;     // 'percent' | 'flat'
  adr: number;
  nights: number;
  pt: number;
  pct: number;
  fee: number;
  pn: number;
  bk: number;
};

const DEFAULTS: UrlState = {
  mode: COHOST_DEFAULTS.mode,
  adr: COHOST_DEFAULTS.adr,
  nights: COHOST_DEFAULTS.nightsBooked,
  pt: COHOST_DEFAULTS.passThroughCosts,
  pct: COHOST_DEFAULTS.cohostPct,
  fee: COHOST_DEFAULTS.flatFeePerBooking,
  pn: COHOST_DEFAULTS.perNightFee,
  bk: COHOST_DEFAULTS.bookings,
};

const TOOL = 'cohost-split-calculator';

export default function CohostSplitCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const mode: CohostMode = s.mode === 'flat' ? 'flat' : 'percent';

  const result = useMemo(
    () => calculateCohostSplit({
      mode,
      adr: s.adr,
      nightsBooked: s.nights,
      passThroughCosts: s.pt,
      cohostPct: s.pct,
      flatFeePerBooking: s.fee,
      perNightFee: s.pn,
      bookings: s.bk,
    }),
    [s, mode],
  );

  // URL serialization for the mode field needs string handling -- url-state
  // serialize/parse handle it generically since DEFAULTS exposes mode as a string.
  useEffect(() => {
    replaceUrlRef.current(s as Record<string, string | number>, DEFAULTS as Record<string, string | number>);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [s]);

  const set = (k: keyof UrlState) => (v: number) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const setMode = (next: CohostMode) =>
    setS((prev) => ({ ...prev, mode: next }));

  // Round share to 2dp for display fairness (no $0.01 ghost differences).
  const ownerPct = result.netRevenue > 0 ? result.ownerShare / result.netRevenue : 0;
  const cohostPctEffective = result.netRevenue > 0 ? result.cohostShare / result.netRevenue : 0;

  return (
    <section className="surface-calc bg-white p-6">
      {/* Mode toggle */}
      <fieldset className="mb-5">
        <legend className="label text-navy mb-2">Split mode</legend>
        <div className="inline-flex border border-rule rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('percent')}
            aria-pressed={mode === 'percent'}
            className={`px-4 py-2 text-ui transition-colors duration-std focus:outline-none focus:shadow-focus ${
              mode === 'percent'
                ? 'bg-navy text-parchment'
                : 'bg-parchment-light text-ink-2 hover:text-navy'
            }`}
          >
            Percent of net
          </button>
          <button
            type="button"
            onClick={() => setMode('flat')}
            aria-pressed={mode === 'flat'}
            className={`px-4 py-2 text-ui transition-colors duration-std focus:outline-none focus:shadow-focus ${
              mode === 'flat'
                ? 'bg-navy text-parchment'
                : 'bg-parchment-light text-ink-2 hover:text-navy'
            }`}
          >
            Flat fees
          </button>
        </div>
      </fieldset>

      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Revenue</p>
          <Field id="cs-adr" label="ADR (avg nightly rate)" prefix="$" value={s.adr} onChange={set('adr')} />
          <Field id="cs-nights" label="Nights booked" value={s.nights} onChange={set('nights')} step="1" />
          <Field id="cs-pt" label="Pass-through costs (cleaning, supplies)" prefix="$" value={s.pt} onChange={set('pt')} />

          {mode === 'percent' ? (
            <>
              <p className="label text-navy mt-5">Cohost terms (percent)</p>
              <Field id="cs-pct" label="Cohost share" suffix="(0–1)" value={s.pct} onChange={set('pct')} step="0.01" />
            </>
          ) : (
            <>
              <p className="label text-navy mt-5">Cohost terms (flat)</p>
              <Field id="cs-fee" label="Per-booking fee" prefix="$" value={s.fee} onChange={set('fee')} />
              <Field id="cs-pn" label="Per-night fee" prefix="$" value={s.pn} onChange={set('pn')} />
              <Field id="cs-bk" label="Bookings (in window)" value={s.bk} onChange={set('bk')} step="1" />
            </>
          )}
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label="Gross revenue" value={formatCurrency(result.grossRevenue)} />
          <Row label="Pass-through costs" value={`-${formatCurrency(s.pt)}`} muted />
          <hr className="my-2 border-rule" />
          <Row label="Net revenue" value={formatCurrency(result.netRevenue)} />
          <hr className="my-2 border-rule" />
          <Row
            label={`Cohost share (${(cohostPctEffective * 100).toFixed(0)}%)`}
            value={formatCurrency(result.cohostShare)}
            bold
          />
          <Row
            label={`Owner share (${(ownerPct * 100).toFixed(0)}%)`}
            value={formatCurrency(result.ownerShare)}
            bold accent
          />
          <p className="mt-3 text-caption text-ink-3 leading-snug">
            "Net revenue" is gross minus pass-through costs (cleaning, supplies, etc.). The split runs on net so the cohost isn't paid on dollars they never controlled.
          </p>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
