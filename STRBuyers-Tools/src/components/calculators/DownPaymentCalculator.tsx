import { useEffect, useMemo, useRef, useState } from 'react';
import { compareLoans } from '@/lib/calc/down-payment';
import { LOAN_TYPES } from '@/lib/calc/loan-types';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, Actions } from './ui';

type UrlState = { price: number };
const DEFAULTS: UrlState = { price: 500_000 };
const TOOL = 'down-payment-calculator';

export default function DownPaymentCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  const rows = useMemo(() => compareLoans(s.price, LOAN_TYPES), [s.price]);

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
    if (rows.length > 0 && s.price > 0) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s, rows.length]);

  return (
    <section className="surface-calc bg-white p-6">
      <div className="max-w-md mb-6">
        <Field
          id="dp-price"
          label="Purchase price"
          prefix="$"
          value={s.price}
          onChange={(v) => setS({ price: v })}
        />
      </div>

      <div className="overflow-x-auto" data-testid="calc-result">
        <table className="w-full text-small">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left py-2 px-3 text-ui text-navy">Loan type</th>
              <th className="text-right py-2 px-3 text-ui text-navy">Min down</th>
              <th className="text-right py-2 px-3 text-ui text-navy">Down payment</th>
              <th className="text-right py-2 px-3 text-ui text-navy">Loan amount</th>
              <th className="text-right py-2 px-3 text-ui text-navy">Est. P&amp;I</th>
              <th className="text-right py-2 px-3 text-ui text-navy">Est. rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.loanType} className="border-b border-rule/60">
                <td className="py-3 px-3 text-navy">{r.label}</td>
                <td className="py-3 px-3 text-right font-mono text-ink-2">
                  {formatPercent(r.downPaymentPct)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-navy">
                  {formatCurrency(r.downPayment, { maximumFractionDigits: 0 })}
                </td>
                <td className="py-3 px-3 text-right font-mono text-ink-2">
                  {formatCurrency(r.loanAmount, { maximumFractionDigits: 0 })}
                </td>
                <td className="py-3 px-3 text-right font-mono text-navy">
                  {formatCurrency(r.monthlyPayment, { maximumFractionDigits: 0 })}
                </td>
                <td className="py-3 px-3 text-right font-mono text-ink-2">
                  {formatNumber(r.rateEstimateBps / 100, { decimals: 2 })}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
