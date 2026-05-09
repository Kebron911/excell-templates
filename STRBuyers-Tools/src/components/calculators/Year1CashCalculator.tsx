import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateYear1Cash } from '@/lib/calc/year-1-cash';
import { formatCurrency } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, Row, Actions } from './ui';

type UrlState = {
  price: number;
  dpPct: number;
  ccPct: number;
  furn: number;
  resMo: number;
  rampMo: number;
  carry: number;
};

const DEFAULTS: UrlState = {
  price: 400_000,
  dpPct: 0.20,
  ccPct: 0.03,
  furn: 25_000,
  resMo: 6,
  rampMo: 3,
  carry: 3000,
};
const TOOL = 'year-1-cash-needs';

export default function Year1CashCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
    if (s.price > 0) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s]);

  const result = useMemo(() => {
    const downPayment = s.price * s.dpPct;
    const closingCosts = s.price * s.ccPct;
    const reserves = s.carry * s.resMo;
    const monthsHoldingCost = s.carry * s.rampMo;
    return calculateYear1Cash({
      downPayment,
      closingCosts,
      furnishings: s.furn,
      reserves,
      monthsHoldingCost,
    });
  }, [s]);

  const set = (key: keyof UrlState) => (v: number) => setS((p) => ({ ...p, [key]: v }));

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Property + financing</p>
          <Field id="y1-price" label="Purchase price" prefix="$" value={s.price} onChange={set('price')} />
          <Field id="y1-dp" label="Down payment %" suffix="(0–1)" step="0.01" value={s.dpPct} onChange={set('dpPct')} />
          <Field id="y1-cc" label="Closing costs %" suffix="(0–1)" step="0.01" value={s.ccPct} onChange={set('ccPct')} />

          <p className="label text-navy mt-5">Setup + carry</p>
          <Field id="y1-furn" label="Furnishing & setup" prefix="$" value={s.furn} onChange={set('furn')} />
          <Field id="y1-carry" label="Monthly carry (P&I + tax + ins + util)" prefix="$" value={s.carry} onChange={set('carry')} />
          <Field id="y1-res" label="Reserves (months)" step="1" value={s.resMo} onChange={set('resMo')} />
          <Field id="y1-ramp" label="Ramp-up months" step="1" value={s.rampMo} onChange={set('rampMo')} />
        </div>

        <div className="space-y-3">
          <p className="label text-navy">Year 1 total cash needed</p>
          <div className="result-block" aria-live="polite">
            <p className="font-mono text-5xl text-navy m-0 leading-none" data-testid="calc-result">
              {formatCurrency(result.total, { maximumFractionDigits: 0 })}
            </p>
            <hr className="my-3 border-rule" />
            {result.breakdown.map((b) => (
              <Row key={b.label} label={b.label} value={formatCurrency(b.amount, { maximumFractionDigits: 0 })} />
            ))}
            <hr className="my-3 border-rule" />
            <Row label="Total" value={formatCurrency(result.total, { maximumFractionDigits: 0 })} bold accent />
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
