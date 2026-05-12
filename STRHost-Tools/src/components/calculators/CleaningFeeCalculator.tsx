import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateCleaningFee, CLEANING_FEE_DEFAULTS } from '@/lib/calc/cleaning-fee';
import { formatCurrency, formatPercent } from '@str/format';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { Field, Row, Actions } from './ui';

type UrlState = {
  hr: number;
  rate: number;
  sup: number;
  laund: number;
  buf: number;
  stay: number;
  nightly: number;
};

const DEFAULTS: UrlState = {
  hr: CLEANING_FEE_DEFAULTS.hours,
  rate: CLEANING_FEE_DEFAULTS.hourlyRate,
  sup: CLEANING_FEE_DEFAULTS.suppliesCost,
  laund: CLEANING_FEE_DEFAULTS.laundryCost,
  buf: CLEANING_FEE_DEFAULTS.buffer,
  stay: CLEANING_FEE_DEFAULTS.avgNightsPerStay,
  nightly: CLEANING_FEE_DEFAULTS.nightlyRate,
};

const TOOL = 'cleaning-fee-calculator';

export default function CleaningFeeCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const result = useMemo(
    () => calculateCleaningFee({
      hours: s.hr,
      hourlyRate: s.rate,
      suppliesCost: s.sup,
      laundryCost: s.laund,
      buffer: s.buf,
      avgNightsPerStay: s.stay,
      nightlyRate: s.nightly,
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
          <p className="label text-navy">Cleaner labor</p>
          <Field id="cf-hr" label="Hours per turnover" value={s.hr} onChange={set('hr')} />
          <Field id="cf-rate" label="Hourly rate" prefix="$" value={s.rate} onChange={set('rate')} />

          <p className="label text-navy mt-5">Materials & buffer</p>
          <Field id="cf-sup" label="Supplies (per turnover)" prefix="$" value={s.sup} onChange={set('sup')} />
          <Field id="cf-laund" label="Laundry (per turnover)" prefix="$" value={s.laund} onChange={set('laund')} />
          <Field id="cf-buf" label="Buffer / damage allowance" prefix="$" value={s.buf} onChange={set('buf')} />

          <p className="label text-navy mt-5">Reference</p>
          <Field id="cf-stay" label="Avg nights per stay" value={s.stay} onChange={set('stay')} />
          <Field id="cf-nightly" label="Nightly rate" prefix="$" value={s.nightly} onChange={set('nightly')} />
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label="Labor cost" value={formatCurrency(result.laborCost)} muted />
          <Row label="Supplies + laundry + buffer" value={formatCurrency(result.recommendedCleaningFee - result.laborCost)} muted />
          <hr className="my-2 border-rule" />
          <Row label="Recommended cleaning fee" value={formatCurrency(result.recommendedCleaningFee)} bold accent />
          <Row label="Per night cost" value={formatCurrency(result.perNightCost)} />
          <Row label="As % of nightly rate" value={formatPercent(result.pctOfNightly)} />
          <p className="mt-3 text-caption text-ink-3 leading-snug">
            Rule of thumb: a cleaning fee above ~50% of nightly rate hurts conversion on shorter stays. If the % is high, consider raising your minimum-night requirement.
          </p>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
