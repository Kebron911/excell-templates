import { useEffect, useMemo, useState } from 'react';
import { computeLinenPar } from '@lib/calc/linen-par';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { track, markCalcRunOnce } from '@lib/analytics';

type State = {
  bedrooms: number;
  bathrooms: number;
  sheetSetsPerBed: number;
  towelsPerBath: number;
  kingShare: number;
};
const defaults: State = {
  bedrooms: 3,
  bathrooms: 2,
  sheetSetsPerBed: 3,
  towelsPerBath: 2.5,
  kingShare: 0.5,
};

export default function LinenParCalculator() {
  const [s, setS] = useState<State>(defaults);
  const replacer = useMemo(() => createDebouncedReplaceState(200), []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setS(parse(new URLSearchParams(window.location.search), defaults));
    }
  }, []);
  useEffect(() => {
    replacer(s, defaults);
  }, [s, replacer]);

  const r = computeLinenPar(s);

  useEffect(() => {
    if (r.sheetSets > 0 && markCalcRunOnce('linen-par-calculator')) {
      track('tool_calc_run', { tool: 'linen-par-calculator' });
    }
  }, [r]);

  const num = (k: keyof State, label: string, step = 1) => (
    <label className="text-sm">
      {label}
      <input
        type="number"
        step={step}
        min={0}
        value={s[k]}
        onChange={e => setS({ ...s, [k]: Number(e.target.value) })}
        className="block w-full border border-rule px-3 py-2 num"
      />
    </label>
  );

  return (
    <div className="calculator-shell border border-rule bg-parchment p-6 my-6">
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        {num('bedrooms', 'Bedrooms')}
        {num('bathrooms', 'Bathrooms')}
        {num('sheetSetsPerBed', 'Sheet sets / bed')}
        {num('towelsPerBath', 'Towel sets / bath', 0.5)}
        {num('kingShare', 'King share (0-1)', 0.05)}
      </div>
      <div className="grid md:grid-cols-4 gap-4 text-center">
        <div className="border border-rule p-4">
          <div className="text-ink3 text-xs uppercase tracking-widest">Sheet sets</div>
          <div className="text-3xl num font-semibold mt-1">{r.sheetSets}</div>
        </div>
        <div className="border border-rule p-4">
          <div className="text-ink3 text-xs uppercase tracking-widest">Towel sets</div>
          <div className="text-3xl num font-semibold mt-1">{r.towelSets}</div>
        </div>
        <div className="border border-rule p-4">
          <div className="text-ink3 text-xs uppercase tracking-widest">King sheet sets</div>
          <div className="text-3xl num font-semibold mt-1">{r.kingSheetSets}</div>
        </div>
        <div className="border border-rule p-4">
          <div className="text-ink3 text-xs uppercase tracking-widest">Queen sheet sets</div>
          <div className="text-3xl num font-semibold mt-1">{r.queenSheetSets}</div>
        </div>
      </div>
      <div className="mt-6 flex gap-3" data-print="hide">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="border border-rule px-4 py-2 text-sm"
        >
          Copy share link
        </button>
        <button
          onClick={() => window.print()}
          className="border border-rule px-4 py-2 text-sm"
        >
          Print
        </button>
      </div>
    </div>
  );
}
