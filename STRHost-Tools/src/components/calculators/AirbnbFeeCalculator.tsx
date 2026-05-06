import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateAirbnbFee, AIRBNB_FEE_DEFAULTS } from '@/lib/calc/airbnb-fee';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';

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

declare global {
  interface Window {
    gtag?: (cmd: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export default function AirbnbFeeCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  // Seed from URL on mount.
  useEffect(() => {
    const next = parse<UrlState>(window.location.search, DEFAULTS);
    setState(next);
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

  // Push to URL on every change (debounced 200ms).
  useEffect(() => {
    replaceUrlRef.current(state, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: 'airbnb-fee-calculator' });
  }, [state]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      window.gtag?.('event', 'share_link_copied', { tool: 'airbnb-fee-calculator' });
    } catch {
      // Clipboard may be blocked; ignore.
    }
  };

  const onPrint = () => {
    window.gtag?.('event', 'print_triggered', { tool: 'airbnb-fee-calculator' });
    window.print();
  };

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-4">
          <Field
            id="nightly"
            label="Nightly rate"
            prefix="$"
            value={state.nightly}
            onChange={(v) => setState((s) => ({ ...s, nightly: v }))}
          />
          <Field
            id="nights"
            label="Nights"
            value={state.nights}
            onChange={(v) => setState((s) => ({ ...s, nights: v }))}
          />
          <Field
            id="cleaning"
            label="Cleaning fee"
            prefix="$"
            value={state.cleaning}
            onChange={(v) => setState((s) => ({ ...s, cleaning: v }))}
          />
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

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          type="button"
          onClick={onCopy}
          className="border border-rule rounded-md bg-parchment-light px-4 py-2 text-ui text-navy hover:border-gold hover:text-navy-tint transition-colors duration-std focus:outline-none focus:shadow-focus"
        >
          Copy share link
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="border border-rule rounded-md bg-parchment-light px-4 py-2 text-ui text-navy hover:border-gold hover:text-navy-tint transition-colors duration-std focus:outline-none focus:shadow-focus"
        >
          Print
        </button>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-ui text-navy mb-1">{label}</span>
      <span className="flex items-center border border-rule rounded-md bg-parchment-light focus-within:border-gold focus-within:shadow-focus transition-shadow">
        {prefix && (
          <span className="px-3 text-ink-3 font-mono select-none" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          className="font-mono flex-1 px-2 py-2 bg-transparent outline-none text-navy"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </span>
    </label>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={[
        'flex justify-between items-baseline',
        bold ? 'font-semibold' : '',
        accent ? 'text-navy' : muted ? 'text-ink-2' : 'text-ink-1',
      ].join(' ')}
    >
      <span className={bold ? 'text-ui' : 'text-small'}>{label}</span>
      <span className={`font-mono ${bold ? 'text-h3' : 'text-body'}`}>{value}</span>
    </div>
  );
}
