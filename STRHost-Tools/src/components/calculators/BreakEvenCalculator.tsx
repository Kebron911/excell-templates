import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateBreakEven, BREAK_EVEN_DEFAULTS } from '@/lib/calc/break-even';
import { formatCurrency, formatPercent } from '@str/format';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { Field, Row, Actions } from './ui';

type UrlState = {
  mort: number;
  ins: number;
  tax: number;
  hoa: number;
  util: number;
  other: number;
  adr: number;
  fee: number;
  clean: number;
  varn: number;
};

const DEFAULTS: UrlState = {
  mort: BREAK_EVEN_DEFAULTS.mortgage,
  ins: BREAK_EVEN_DEFAULTS.insurance,
  tax: BREAK_EVEN_DEFAULTS.propertyTaxAnnual,
  hoa: BREAK_EVEN_DEFAULTS.hoa,
  util: BREAK_EVEN_DEFAULTS.utilities,
  other: BREAK_EVEN_DEFAULTS.otherFixed,
  adr: BREAK_EVEN_DEFAULTS.adr,
  fee: BREAK_EVEN_DEFAULTS.feeRate,
  clean: BREAK_EVEN_DEFAULTS.cleaningPerTurnover,
  varn: BREAK_EVEN_DEFAULTS.variablePerNight,
};

const TOOL = 'break-even-calculator';

export default function BreakEvenCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const result = useMemo(
    () => calculateBreakEven({
      mortgage: s.mort,
      insurance: s.ins,
      propertyTaxAnnual: s.tax,
      hoa: s.hoa,
      utilities: s.util,
      otherFixed: s.other,
      adr: s.adr,
      feeRate: s.fee,
      cleaningPerTurnover: s.clean,
      variablePerNight: s.varn,
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
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Monthly fixed costs</p>
          <Field id="be-mort" label="Mortgage" prefix="$" value={s.mort} onChange={set('mort')} />
          <Field id="be-ins" label="Insurance" prefix="$" value={s.ins} onChange={set('ins')} />
          <Field id="be-tax" label="Property tax (annual)" prefix="$" value={s.tax} onChange={set('tax')} />
          <Field id="be-hoa" label="HOA" prefix="$" value={s.hoa} onChange={set('hoa')} />
          <Field id="be-util" label="Utilities" prefix="$" value={s.util} onChange={set('util')} />
          <Field id="be-other" label="Other fixed" prefix="$" value={s.other} onChange={set('other')} />

          <p className="label text-navy mt-5">Per-night economics</p>
          <Field id="be-adr" label="ADR (avg nightly rate)" prefix="$" value={s.adr} onChange={set('adr')} />
          <Field id="be-fee" label="Platform fee rate" suffix="(0–1)" value={s.fee} onChange={set('fee')} step="0.01" />
          <Field id="be-clean" label="Cleaning per turnover" prefix="$" value={s.clean} onChange={set('clean')} />
          <Field id="be-var" label="Variable per night" prefix="$" value={s.varn} onChange={set('varn')} />
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label="Monthly fixed costs" value={formatCurrency(result.monthlyCosts)} />
          <Row label="Net per night" value={formatCurrency(result.netPerNight)} muted={result.feasible} />
          <hr className="my-2 border-rule" />

          {result.feasible ? (
            <>
              <Row
                label="Break-even nights / mo"
                value={result.breakEvenNights.toFixed(1)}
                bold accent
              />
              <Row
                label="Break-even occupancy"
                value={formatPercent(result.breakEvenOccupancy)}
                bold accent
              />
              <p className="mt-3 text-caption text-ink-3 leading-snug">
                You need this many booked nights — or this occupancy rate — to cover monthly fixed costs at your current ADR. Below this line, you're losing money. Above this line, every booked night is profit.
              </p>
            </>
          ) : (
            <div className="rounded-md bg-parchment-alt border border-rule p-4 mt-2">
              <p className="text-ui font-semibold text-error">Not feasible at this ADR</p>
              <p className="mt-1 text-small text-ink-2 leading-snug">
                Cleaning + fees + variable costs exceed your nightly rate, so every booked night loses money. Either raise the ADR, shorten cleaning per turnover by raising minimum-night stay, or rethink the property.
              </p>
            </div>
          )}
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
