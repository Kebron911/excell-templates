import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateComp, COMP_DEFAULTS } from '@/lib/calc/comp-analyzer';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

const TOOL = 'comp-analyzer';

// Encode 3 listings as a single URL state by flattening to a 9-field tuple.
type UrlState = {
  r1: number; o1: number; c1: number;
  r2: number; o2: number; c2: number;
  r3: number; o3: number; c3: number;
}

const DEFAULTS: UrlState = {
  r1: COMP_DEFAULTS[0].nightlyRate, o1: COMP_DEFAULTS[0].occupancyPct, c1: COMP_DEFAULTS[0].cleaningFee,
  r2: COMP_DEFAULTS[1].nightlyRate, o2: COMP_DEFAULTS[1].occupancyPct, c2: COMP_DEFAULTS[1].cleaningFee,
  r3: COMP_DEFAULTS[2].nightlyRate, o3: COMP_DEFAULTS[2].occupancyPct, c3: COMP_DEFAULTS[2].cleaningFee,
};

const SPREAD_LABEL_COPY: Record<string, string> = {
  single: 'Add at least two listings to see spread analysis.',
  tight: 'Tight spread — comps agree. Confidence in projected revenue.',
  moderate: 'Moderate spread. Look at what differs (location, amenities, season).',
  wide: 'Wide spread — at least one outlier. Investigate before pricing.',
};

export default function CompAnalyzer() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);

  const result = useMemo(
    () => calculateComp([
      { nightlyRate: state.r1, occupancyPct: state.o1, cleaningFee: state.c1 },
      { nightlyRate: state.r2, occupancyPct: state.o2, cleaningFee: state.c2 },
      { nightlyRate: state.r3, occupancyPct: state.o3, cleaningFee: state.c3 },
    ]),
    [state],
  );

  useEffect(() => {
    replaceUrlRef.current(state, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [state]);

  function listingFields(idx: 1 | 2 | 3) {
    const rk = `r${idx}` as keyof UrlState;
    const ok = `o${idx}` as keyof UrlState;
    const ck = `c${idx}` as keyof UrlState;
    return (
      <fieldset className="border border-rule rounded-md p-4">
        <legend className="text-small text-navy px-2 font-semibold">Listing {idx}</legend>
        <div className="space-y-3">
          <Field id={`r${idx}`} label="Nightly rate" prefix="$"
            value={state[rk]} onChange={(v) => setState((s) => ({ ...s, [rk]: v }))} />
          <Field id={`o${idx}`} label="Occupancy" suffix="0.00–1.00" step="0.01"
            value={state[ok]} onChange={(v) => setState((s) => ({ ...s, [ok]: v }))} />
          <Field id={`c${idx}`} label="Cleaning fee" prefix="$"
            value={state[ck]} onChange={(v) => setState((s) => ({ ...s, [ck]: v }))} />
        </div>
      </fieldset>
    );
  }

  return (
    <section className="rounded-md border border-rule bg-white p-6">
      <div className="grid md:grid-cols-3 gap-4">
        {listingFields(1)}
        {listingFields(2)}
        {listingFields(3)}
      </div>

      <hr className="my-6 border-rule" />

      <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.perListing.map((p, i) => (
            <div key={i} className="rounded-md bg-parchment-light p-3">
              <p className="text-caption text-ink-3 uppercase tracking-widest">Listing {i + 1}</p>
              <p className="font-mono text-h3 text-navy mt-1">{formatCurrency(p.annualGross)}</p>
              <p className="text-caption text-ink-2 mt-1">{Math.round(p.bookedNights)} nights · {formatCurrency(p.annualRent)} rent</p>
            </div>
          ))}
        </div>

        <hr className="my-2 border-rule" />
        <Row label="Average annual gross" value={formatCurrency(result.averageGross)} bold accent />
        <Row label="Spread (max − min)" value={`${formatCurrency(result.maxGross - result.minGross)} (${formatPercent(result.spreadPct)})`} />
        <p className="mt-3 text-small text-ink-2 leading-snug">{SPREAD_LABEL_COPY[result.spreadLabel]}</p>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
