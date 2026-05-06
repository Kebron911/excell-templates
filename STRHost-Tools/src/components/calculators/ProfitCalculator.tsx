import { useEffect, useMemo, useState, useRef } from 'react';
import { calculateProfit, PROFIT_DEFAULTS } from '@/lib/calc/profit';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

// URL keys -> ProfitInput keys. Short URL keys keep shared links compact.
type UrlState = {
  adr: number;
  nights: number;
  turn: number;
  clean: number;
  sup: number;
  util: number;
  pf: number;
  mort: number;
  ins: number;
  tax: number;
  hoa: number;
  mgmt: number;
  m: number;
};

const DEFAULTS: UrlState = {
  adr: PROFIT_DEFAULTS.adr,
  nights: PROFIT_DEFAULTS.nightsBooked,
  turn: PROFIT_DEFAULTS.turnovers,
  clean: PROFIT_DEFAULTS.cleaningPerTurnover,
  sup: PROFIT_DEFAULTS.suppliesPerNight,
  util: PROFIT_DEFAULTS.utilitiesMonthly,
  pf: PROFIT_DEFAULTS.platformFees,
  mort: PROFIT_DEFAULTS.mortgageMonthly,
  ins: PROFIT_DEFAULTS.insuranceMonthly,
  tax: PROFIT_DEFAULTS.propertyTaxAnnual,
  hoa: PROFIT_DEFAULTS.hoaMonthly,
  mgmt: PROFIT_DEFAULTS.managementFeeRate,
  m: PROFIT_DEFAULTS.months,
};

const TOOL = 'profit-calculator';

export default function ProfitCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const result = useMemo(
    () =>
      calculateProfit({
        adr: s.adr,
        nightsBooked: s.nights,
        turnovers: s.turn,
        cleaningPerTurnover: s.clean,
        suppliesPerNight: s.sup,
        utilitiesMonthly: s.util,
        platformFees: s.pf,
        mortgageMonthly: s.mort,
        insuranceMonthly: s.ins,
        propertyTaxAnnual: s.tax,
        hoaMonthly: s.hoa,
        managementFeeRate: s.mgmt,
        months: s.m,
      }),
    [s],
  );

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [s]);

  const set = (key: keyof UrlState) => (v: number) => setS((prev) => ({ ...prev, [key]: v }));

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        {/* Revenue + variable costs */}
        <div className="space-y-3">
          <p className="label text-navy">Revenue</p>
          <Field id="p-adr" label="ADR (avg nightly rate)" prefix="$" value={s.adr} onChange={set('adr')} />
          <Field id="p-nights" label="Nights booked" value={s.nights} onChange={set('nights')} />
          <Field id="p-m" label="Months in window" value={s.m} onChange={set('m')} step="1" />

          <p className="label text-navy mt-5">Variable costs</p>
          <Field id="p-turn" label="Turnovers" value={s.turn} onChange={set('turn')} step="1" />
          <Field id="p-clean" label="Cleaning per turnover" prefix="$" value={s.clean} onChange={set('clean')} />
          <Field id="p-sup" label="Supplies per night" prefix="$" value={s.sup} onChange={set('sup')} />
          <Field id="p-util" label="Utilities / month" prefix="$" value={s.util} onChange={set('util')} />
          <Field id="p-pf" label="Platform fees (window)" prefix="$" value={s.pf} onChange={set('pf')} />
        </div>

        {/* Fixed costs + result */}
        <div className="space-y-3">
          <p className="label text-navy">Fixed costs</p>
          <Field id="p-mort" label="Mortgage / month" prefix="$" value={s.mort} onChange={set('mort')} />
          <Field id="p-ins" label="Insurance / month" prefix="$" value={s.ins} onChange={set('ins')} />
          <Field id="p-tax" label="Property tax / year" prefix="$" value={s.tax} onChange={set('tax')} />
          <Field id="p-hoa" label="HOA / month" prefix="$" value={s.hoa} onChange={set('hoa')} />
          <Field id="p-mgmt" label="Management fee rate" suffix="(0–1)" value={s.mgmt} onChange={set('mgmt')} step="0.01" />

          <hr className="my-3 border-rule" />

          <div
            className="space-y-2 result-block"
            aria-live="polite"
            aria-atomic="true"
          >
            <Row label="Gross revenue" value={formatCurrency(result.grossRevenue)} />
            <Row label="Variable costs" value={`-${formatCurrency(result.variableCosts)}`} muted />
            <Row label="Fixed costs" value={`-${formatCurrency(result.fixedCosts)}`} muted />
            <hr className="my-2 border-rule" />
            <Row label="Net profit" value={formatCurrency(result.netProfit)} bold accent />
            <Row label="Profit margin" value={formatPercent(result.profitMargin)} bold />
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
