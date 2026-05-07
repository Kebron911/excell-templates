/**
 * LinenParCalculator — hydrated island. Number inputs round-trip via URL.
 */

import { useEffect, useMemo, useState } from 'react';
import { computeLinenPar } from '@/lib/calc/linen-par';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';

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
    if (typeof window !== 'undefined') setS(parse(window.location.search, defaults));
  }, []);

  useEffect(() => {
    replacer(s, defaults);
  }, [s, replacer]);

  const r = useMemo(() => computeLinenPar(s), [s]);

  function field(key: keyof State, label: string, hint: string, step = 1, min = 0, max = 99) {
    return (
      <label className="text-small block">
        <span className="block text-ink-2 mb-1">{label}</span>
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={s[key]}
          onChange={e => setS({ ...s, [key]: Number(e.target.value) || 0 })}
          className="block w-full border border-rule rounded-md bg-parchment px-3 py-2 num focus:outline-none focus:border-accent focus:shadow-focus"
        />
        <span className="block mt-1 text-caption text-ink-3 leading-snug">{hint}</span>
      </label>
    );
  }

  return (
    <div className="surface-calc p-6 my-6">
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        {field('bedrooms', 'Bedrooms', 'Total bedrooms in the property.')}
        {field('bathrooms', 'Bathrooms', 'Full + 3/4 baths. Half baths optional.')}
        {field('sheetSetsPerBed', 'Sets per bed', 'Default 3: one on, one washing, one in closet.', 0.5, 1, 6)}
        {field('towelsPerBath', 'Towel sets per bath', 'Default 2.5 (covers hand + bath).', 0.5, 1, 5)}
        {field('kingShare', 'King share (0–1)', '0 = all queen; 1 = all king. 0.5 = half king.', 0.05, 0, 1)}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-2">
        <div>
          <p className="label text-navy mb-2">Sheets</p>
          <ul className="text-body text-ink-2 space-y-1.5">
            <li><span className="num text-navy text-h3 font-mono">{r.sheetSets}</span> total sheet sets</li>
            <li><span className="num text-navy font-mono">{r.kingSheetSets}</span> king · <span className="num text-navy font-mono">{r.queenSheetSets}</span> queen</li>
          </ul>
        </div>
        <div>
          <p className="label text-navy mb-2">Towels</p>
          <ul className="text-body text-ink-2 space-y-1.5">
            <li><span className="num text-navy text-h3 font-mono">{r.towelSets}</span> total towel sets</li>
            <li className="text-caption text-ink-3">Each set = 1 bath, 1 hand, 1 washcloth.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex gap-3 print:hidden">
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
          className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui hover:border-accent hover:shadow-card transition-all duration-std focus:outline-none focus:shadow-focus"
        >
          Copy share link
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-rule bg-parchment px-4 py-2 text-ui hover:border-accent hover:shadow-card transition-all duration-std focus:outline-none focus:shadow-focus"
        >
          Print
        </button>
      </div>
    </div>
  );
}
