import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateFurnishing, FURNISHING_DEFAULTS, type FurnishingTier } from '@/lib/calc/furnishing-budget';
import { formatCurrency } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { Field, Row, Actions } from './ui';

const TOOL = 'furnishing-budget';

type UrlState = { bedrooms: number; tier: FurnishingTier; }
const DEFAULTS: UrlState = { bedrooms: FURNISHING_DEFAULTS.bedrooms, tier: FURNISHING_DEFAULTS.tier };

export default function FurnishingCalculator() {
  const [state, setState] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => { setState(parse<UrlState>(window.location.search, DEFAULTS)); }, []);
  const result = useMemo(
    () => calculateFurnishing({ bedrooms: state.bedrooms, tier: state.tier }),
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
          <Field id="bedrooms" label="Bedrooms" suffix="1–4" step="1" min={1}
            value={state.bedrooms} onChange={(v) => setState((s) => ({ ...s, bedrooms: v }))} />
          <fieldset className="border border-rule rounded-md p-3">
            <legend className="text-small text-ink-2 px-2">Tier</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['basic', 'mid', 'luxury'] as FurnishingTier[]).map((t) => (
                <label key={t} className={`block text-center rounded-md border px-2 py-3 cursor-pointer transition-colors ${state.tier === t ? 'border-[color:var(--accent-500)] bg-parchment-light text-navy' : 'border-rule bg-parchment text-ink-2 hover:border-[color:var(--accent-300)]'}`}>
                  <input type="radio" name="tier" className="sr-only" value={t}
                    checked={state.tier === t}
                    onChange={() => setState((s) => ({ ...s, tier: t }))}
                  />
                  <span className="block text-ui font-semibold capitalize">{t}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="text-caption text-ink-3 leading-snug">
            Basic = IKEA + Wayfair sales · Mid = mid-market with statement pieces · Luxury = Article + West Elm + custom.
            Bathrooms estimated 1:1 with bedrooms.
          </p>
        </div>

        <div className="space-y-2 result-block" aria-live="polite" aria-atomic="true">
          <Row label="Living room" value={formatCurrency(result.byCategory.livingRoom)} muted />
          <Row label={`Bedrooms (${result.bedrooms})`} value={formatCurrency(result.byCategory.bedrooms)} muted />
          <Row label="Kitchen" value={formatCurrency(result.byCategory.kitchen)} muted />
          <Row label="Dining room" value={formatCurrency(result.byCategory.diningRoom)} muted />
          <Row label="Bathrooms" value={formatCurrency(result.byCategory.bathrooms)} muted />
          <Row label="Decor & art" value={formatCurrency(result.byCategory.decorAndArt)} muted />
          <Row label="Contingency" value={formatCurrency(result.byCategory.contingency)} muted />
          <hr className="my-2 border-rule" />
          <Row label={`Total — ${result.bedrooms}br ${result.tier}`} value={formatCurrency(result.total)} bold accent />
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
