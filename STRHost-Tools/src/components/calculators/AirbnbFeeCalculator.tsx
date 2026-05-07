import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateAirbnbFee, AIRBNB_FEE_DEFAULTS } from '@/lib/calc/airbnb-fee';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

interface UrlState {
  nightly: number;
  nights: number;
  cleaning: number;
}

const DEFAULTS: UrlState = {
  nightly: AIRBNB_FEE_DEFAULTS.nightlyRate,
  nights: AIRBNB_FEE_DEFAULTS.nights,
  cleaning: AIRBNB_FEE_DEFAULTS.cleaningFee,
};

const TOOL = 'airbnb-fee-calculator';

export default function AirbnbFeeCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setState(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const result = useMemo(
    () =>
      calculateAirbnbFee({
        nightlyRate: state.nightly,
        nights: state.nights,
        cleaningFee: state.cleaning,
        hostFeeRate: AIRBNB_FEE_DEFAULTS.hostFeeRate,
        guestFeeRate: AIRBNB_FEE_DEFAULTS.guestFeeRate,
      }),
    [state],
  );

  useEffect(() => {
    replaceUrlRef.current(state, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [state]);

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-4">
          <Field id="nightly" label="Nightly rate" prefix="$"
            value={state.nightly} onChange={(v) => setState((s) => ({ ...s, nightly: v }))} />
          <Field id="nights" label="Nights"
            value={state.nights} onChange={(v) => setState((s) => ({ ...s, nights: v }))} />
          <Field id="cleaning" label="Cleaning fee" prefix="$"
            value={state.cleaning} onChange={(v) => setState((s) => ({ ...s, cleaning: v }))} />
          <p className="text-caption text-ink-3 leading-snug">
            Host fee {formatPercent(AIRBNB_FEE_DEFAULTS.hostFeeRate)} · guest service fee {formatPercent(AIRBNB_FEE_DEFAULTS.guestFeeRate)}.
            Defaults reflect the host-only fee structure used by most hosts.
          </p>
        </div>

        <div
          className="space-y-2 result-block"
          aria-live="polite"
          aria-atomic="true"
        >
          <Row label="Subtotal" value={formatCurrency(result.subtotal)} />
          <Row label={`Host fee (${formatPercent(AIRBNB_FEE_DEFAULTS.hostFeeRate)})`} value={`-${formatCurrency(result.hostFee)}`} muted />
          <Row label="Guest service fee" value={formatCurrency(result.guestServiceFee)} muted />
          <hr className="my-2 border-rule" />
          <Row label="Guest pays" value={formatCurrency(result.guestTotal)} bold />
          <Row label="You receive" value={formatCurrency(result.hostPayout)} bold accent />
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
