import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateLodgingTax } from '@/lib/calc/lodging-tax';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

export interface LodgingTaxCalculatorProps {
  stateCode: string;
  stateRate: number;
  localMin: number;
  localMax: number;
  stateName: string;
  sourceUrl: string;
  lastVerified: string;
}

interface UrlState {
  sub: number;
  local: number;
}

const TOOL = 'lodging-tax';

export default function LodgingTaxCalculator(props: LodgingTaxCalculatorProps) {
  const defaults: UrlState = { sub: 1000, local: props.localMin };
  const [s, setS] = useState<UrlState>(defaults);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, defaults));
  }, []);

  const localClamped = Math.max(props.localMin, Math.min(props.localMax, s.local));

  const result = useMemo(
    () => calculateLodgingTax({
      subtotal: s.sub,
      stateRate: props.stateRate,
      localRate: localClamped,
    }),
    [s, localClamped, props.stateRate],
  );

  useEffect(() => {
    replaceUrlRef.current(s, defaults);
    window.gtag?.('event', 'calculator_input_changed', {
      tool: TOOL,
      state: props.stateCode,
    });
  }, [s]);

  const setSub = (v: number) => setS((prev) => ({ ...prev, sub: v }));
  const setLocal = (v: number) => setS((prev) => ({ ...prev, local: v }));

  const localRangeLabel =
    props.localMin === props.localMax
      ? formatPercent(props.localMin)
      : `${formatPercent(props.localMin)} – ${formatPercent(props.localMax)}`;

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-3">
          <Field id="lt-sub" label="Booking subtotal" prefix="$" value={s.sub} onChange={setSub} />
          <Field
            id="lt-local"
            label={`Local add-on (${localRangeLabel})`}
            value={s.local}
            onChange={setLocal}
            step="0.001"
            suffix="(0–1)"
          />
          <p className="text-caption text-ink-3 leading-snug">
            State rate: <span className="font-mono">{formatPercent(props.stateRate)}</span>
            {' · '}
            <a href={props.sourceUrl} target="_blank" rel="noopener" className="underline decoration-gold underline-offset-2">{props.stateName} Department of Revenue</a>
            {' · '}
            verified <span className="font-mono">{props.lastVerified}</span>
          </p>
        </div>

        <div
          className="space-y-2 result-block"
          aria-live="polite"
          aria-atomic="true"
        >
          <Row label="Effective rate" value={formatPercent(result.effectiveRate)} />
          <Row label="Tax amount" value={formatCurrency(result.taxAmount)} muted />
          <hr className="my-2 border-rule" />
          <Row label="Guest total" value={formatCurrency(result.guestTotal)} bold accent />
        </div>
      </div>

      <Actions tool={TOOL} />

      <p className="mt-5 text-caption text-ink-3 leading-snug border-t border-rule pt-4">
        Estimate only. State and local rates change. Confirm with the {props.stateName} Department of Revenue before relying on it for filing or pricing.
      </p>
    </section>
  );
}
