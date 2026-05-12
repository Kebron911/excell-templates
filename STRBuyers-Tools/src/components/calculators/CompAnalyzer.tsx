import { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeComps } from '@/lib/calc/comp-analyzer';
import { formatCurrency, formatPercent } from '@str/format';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, Row, Actions } from './ui';

// Three rows × three numeric fields = nine URL keys.
type UrlState = {
  a1: string; d1: number; o1: number;
  a2: string; d2: number; o2: number;
  a3: string; d3: number; o3: number;
};

const DEFAULTS: UrlState = {
  a1: 'Comp A', d1: 220, o1: 0.65,
  a2: 'Comp B', d2: 235, o2: 0.62,
  a3: 'Comp C', d3: 245, o3: 0.58,
};
const TOOL = 'comp-analyzer';

export default function CompAnalyzer() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS));
  }, []);

  useEffect(() => {
    replaceUrlRef.current(s, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [s]);

  useEffect(() => {
    if (s.d1 > 0 && s.d2 > 0 && s.d3 > 0) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s.d1, s.d2, s.d3]);

  const result = useMemo(
    () =>
      analyzeComps([
        { label: s.a1, adr: s.d1, occupancy: s.o1 },
        { label: s.a2, adr: s.d2, occupancy: s.o2 },
        { label: s.a3, adr: s.d3, occupancy: s.o3 },
      ]),
    [s],
  );

  const set = (key: keyof UrlState) => (v: number | string) =>
    setS((p) => ({ ...p, [key]: v as never }));

  const isAdrOut = (i: number) => result.outliers.adr.includes(i);
  const isOccOut = (i: number) => result.outliers.occupancy.includes(i);
  const isRevparOut = (i: number) => result.outliers.revPar.includes(i);

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-5">
          <p className="label text-navy">Paste 3 comparable listings</p>
          {[1, 2, 3].map((n) => {
            const labelKey = `a${n}` as keyof UrlState;
            const adrKey = `d${n}` as keyof UrlState;
            const occKey = `o${n}` as keyof UrlState;
            return (
              <div key={n} className="rounded-md border border-rule p-3 space-y-2">
                <label className="block">
                  <span className="block text-ui text-navy mb-1">Listing {n} label</span>
                  <input
                    type="text"
                    value={s[labelKey] as string}
                    onChange={(e) => set(labelKey)(e.target.value)}
                    className="font-mono w-full border border-rule rounded-md bg-parchment-light px-3 py-2 text-navy focus:outline-none focus:border-accent focus:shadow-focus"
                  />
                </label>
                <Field
                  id={`comp-adr-${n}`}
                  label="ADR (avg nightly rate)"
                  prefix="$"
                  value={s[adrKey] as number}
                  onChange={set(adrKey) as (v: number) => void}
                />
                <Field
                  id={`comp-occ-${n}`}
                  label="Occupancy (0–1)"
                  step="0.01"
                  value={s[occKey] as number}
                  onChange={set(occKey) as (v: number) => void}
                />
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <p className="label text-navy">Averages</p>
          <div className="result-block" aria-live="polite" data-testid="calc-result">
            <Row label="Avg ADR" value={formatCurrency(result.avgAdr)} bold accent />
            <Row label="Avg occupancy" value={formatPercent(result.avgOcc)} />
            <Row label="Avg RevPAR" value={formatCurrency(result.avgRevpar)} bold accent />
          </div>

          <p className="label text-navy mt-5">Per-listing breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-rule text-ink-2">
                  <th className="text-left py-2 px-2 text-ui">Listing</th>
                  <th className="text-right py-2 px-2 text-ui">ADR</th>
                  <th className="text-right py-2 px-2 text-ui">Occ</th>
                  <th className="text-right py-2 px-2 text-ui">RevPAR</th>
                </tr>
              </thead>
              <tbody>
                {result.listings.map((row, i) => (
                  <tr key={i} className="border-b border-rule/60">
                    <td className="py-2 px-2 text-navy">{row.label}</td>
                    <td className={`py-2 px-2 text-right font-mono ${isAdrOut(i) ? 'text-accent font-bold' : 'text-navy'}`}>
                      {formatCurrency(row.adr)}{isAdrOut(i) && ' ⚠'}
                    </td>
                    <td className={`py-2 px-2 text-right font-mono ${isOccOut(i) ? 'text-accent font-bold' : 'text-navy'}`}>
                      {formatPercent(row.occupancy)}{isOccOut(i) && ' ⚠'}
                    </td>
                    <td className={`py-2 px-2 text-right font-mono ${isRevparOut(i) ? 'text-accent font-bold' : 'text-navy'}`}>
                      {formatCurrency(row.revPar)}{isRevparOut(i) && ' ⚠'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-caption text-ink-3">
              ⚠ flags rows that deviate &gt; 25% from the mean — investigate before relying on them as a comp.
            </p>
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
