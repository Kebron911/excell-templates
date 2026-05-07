import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateMarketScore,
  MARKET_SCORE_DEFAULTS,
  type RegulationStatus,
  type SaturationTier,
} from '@/lib/calc/market-score';
import { formatCurrency, formatPercent } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Actions } from './ui';

const TOOL = 'market-score';

type UrlState = {
  adr: number;
  occ: number;
  reg: RegulationStatus;
  sat: SaturationTier;
}

const DEFAULTS: UrlState = {
  adr: MARKET_SCORE_DEFAULTS.medianADR,
  occ: MARKET_SCORE_DEFAULTS.occupancyPct,
  reg: MARKET_SCORE_DEFAULTS.regulationStatus,
  sat: MARKET_SCORE_DEFAULTS.saturationTier,
};

const LABEL_BADGE: Record<string, string> = {
  strong: 'bg-[color:var(--accent-100)] text-[color:var(--accent-900)]',
  mixed: 'bg-parchment-alt text-navy',
  marginal: 'bg-amber-100 text-amber-900',
  avoid: 'bg-rose-100 text-rose-900',
};

export default function MarketScoreCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);
  const result = useMemo(
    () => calculateMarketScore({
      medianADR: state.adr,
      occupancyPct: state.occ,
      regulationStatus: state.reg,
      saturationTier: state.sat,
    }),
    [state],
  );
  useEffect(() => {
    replaceUrlRef.current(state, DEFAULTS);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
  }, [state]);

  return (
    <section className="rounded-md border border-rule bg-white p-6">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="space-y-4">
          <Field id="adr" label="Median ADR" prefix="$"
            value={state.adr} onChange={(v) => setState((s) => ({ ...s, adr: v }))} />
          <Field id="occ" label="Occupancy" suffix="0.00–1.00" step="0.01"
            value={state.occ} onChange={(v) => setState((s) => ({ ...s, occ: v }))} />
          <label className="block">
            <span className="block text-ui text-navy mb-1">Regulation status</span>
            <select
              className="font-mono w-full px-3 py-2 border border-rule rounded-md bg-parchment-light focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              value={state.reg}
              onChange={(e) => setState((s) => ({ ...s, reg: e.target.value as RegulationStatus }))}
            >
              <option value="allowed">Allowed</option>
              <option value="restrictive">Restrictive</option>
              <option value="banned">Banned</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-ui text-navy mb-1">Saturation tier</span>
            <select
              className="font-mono w-full px-3 py-2 border border-rule rounded-md bg-parchment-light focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              value={state.sat}
              onChange={(e) => setState((s) => ({ ...s, sat: e.target.value as SaturationTier }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div className="result-block" aria-live="polite" aria-atomic="true">
          <p className="text-caption text-ink-3 uppercase tracking-widest">Market score</p>
          <p className="font-mono text-hero text-navy leading-none mt-2">{result.score}</p>
          <p className="text-caption text-ink-3 mt-1">out of 100</p>
          <span className={`inline-block mt-3 rounded-pill px-3 py-1 text-caption uppercase tracking-widest ${LABEL_BADGE[result.label]}`}>
            {result.label}
          </span>

          <div className="mt-5 space-y-1 text-small text-ink-2">
            <p>· ADR: {formatCurrency(state.adr)} → <span className="font-mono">{result.components.adr.toFixed(0)}/30</span></p>
            <p>· Occupancy: {formatPercent(state.occ)} → <span className="font-mono">{result.components.occupancy.toFixed(0)}/30</span></p>
            <p>· Regulation: {state.reg} → <span className="font-mono">{result.components.regulation}/20</span></p>
            <p>· Saturation: {state.sat} → <span className="font-mono">{result.components.saturation}/20</span></p>
          </div>

          {result.notes.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-small text-ink-2">
              {result.notes.map((n, i) => <li key={i} className="leading-snug">⚠ {n}</li>)}
            </ul>
          )}
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
