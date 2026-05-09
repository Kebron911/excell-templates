import { useEffect, useMemo, useRef, useState } from 'react';
import { calculateFurnishingBudget, type Tier } from '@/lib/calc/furnishing-budget';
import { formatCurrency } from '@/lib/format';
import { parse, createDebouncedReplaceState } from '@/lib/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, SelectField, Row, Actions } from './ui';

type UrlState = {
  beds: number;
  baths: number;
  sqft: number;
  tier: Tier;
};

const DEFAULTS: UrlState = { beds: 3, baths: 2, sqft: 1500, tier: 'mid' };
const TOOL = 'furnishing-budget';

export default function FurnishingBudgetCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    setS(parse<UrlState>(window.location.search, DEFAULTS as never));
  }, []);

  useEffect(() => {
    replaceUrlRef.current(s as never, DEFAULTS as never);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
    if (s.sqft > 0 && s.beds > 0) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s]);

  const result = useMemo(
    () =>
      calculateFurnishingBudget({
        bedrooms: s.beds,
        bathrooms: s.baths,
        squareFootage: s.sqft,
        tier: s.tier,
      }),
    [s],
  );

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Property</p>
          <Field id="fb-beds" label="Bedrooms" step="1" value={s.beds} onChange={(v) => setS((p) => ({ ...p, beds: v }))} />
          <Field id="fb-baths" label="Bathrooms" step="1" value={s.baths} onChange={(v) => setS((p) => ({ ...p, baths: v }))} />
          <Field id="fb-sqft" label="Square footage" value={s.sqft} onChange={(v) => setS((p) => ({ ...p, sqft: v }))} />
          <SelectField<Tier>
            id="fb-tier"
            label="Tier"
            value={s.tier}
            onChange={(v) => setS((p) => ({ ...p, tier: v }))}
            options={[
              { value: 'budget', label: 'Budget — Wayfair / Amazon flat-pack' },
              { value: 'mid', label: 'Mid — Article / West Elm + stager' },
              { value: 'luxury', label: 'Luxury — designer-curated trade goods' },
            ]}
          />
        </div>

        <div className="space-y-3">
          <p className="label text-navy">Furnishing budget</p>
          <div className="result-block" aria-live="polite">
            <p className="font-mono text-5xl text-navy m-0 leading-none" data-testid="calc-result">
              {formatCurrency(result.total, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-2 text-ui text-ink-2">
              ≈ {formatCurrency(result.perSqFt, { maximumFractionDigits: 2 })} / sqft
            </p>

            <hr className="my-3 border-rule" />
            <Row label="Bedrooms" value={formatCurrency(result.breakdown.bedrooms, { maximumFractionDigits: 0 })} />
            <Row label="Bathrooms" value={formatCurrency(result.breakdown.bathrooms, { maximumFractionDigits: 0 })} />
            <Row label="Living room" value={formatCurrency(result.breakdown.livingRoom, { maximumFractionDigits: 0 })} />
            <Row label="Kitchen" value={formatCurrency(result.breakdown.kitchen, { maximumFractionDigits: 0 })} />
            <Row label="Decor & accents (15%)" value={formatCurrency(result.breakdown.decor, { maximumFractionDigits: 0 })} muted />
            <hr className="my-3 border-rule" />
            <Row label="Total" value={formatCurrency(result.total, { maximumFractionDigits: 0 })} bold accent />
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
