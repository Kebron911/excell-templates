import { useEffect, useMemo, useRef, useState } from 'react';
import { scoreMarket, type RegulationStatus, type SaturationTier } from '@/lib/calc/market-score';
import { formatCurrency, formatPercent, formatNumber } from '@str/format';
import { parse, createDebouncedReplaceState } from '@str/url-state';
import { trackCalculatorRun } from '@/lib/analytics';
import { Field, SelectField, Row, Actions } from './ui';
import { getCity, type RegulationStatus as CityRegulationStatus, type SaturationTier as CitySaturationTier } from '@/data/cities';

type UrlState = {
  adr: number;
  occ: number;
  reg: RegulationStatus;
  sat: SaturationTier;
};

const DEFAULTS: UrlState = {
  adr: 220,
  occ: 0.6,
  reg: 'gray',
  sat: 'medium',
};
const TOOL = 'market-score';

// City data uses richer enums than the calculator. Map them to the
// calculator's open/gray/restricted + low/medium/high domain.
const CITY_REG_MAP: Record<CityRegulationStatus, RegulationStatus> = {
  permissive: 'open',
  moderate: 'gray',
  restrictive: 'restricted',
  banned: 'restricted',
};
const CITY_SAT_MAP: Record<CitySaturationTier, SaturationTier> = {
  A: 'low',
  B: 'medium',
  C: 'medium',
  D: 'high',
};

const TIER_TONE: Record<string, string> = {
  A: 'text-accent',
  B: 'text-navy',
  C: 'text-ink-2',
  D: 'text-ink-3',
};

export default function MarketScoreCalculator() {
  const [s, setS] = useState<UrlState>(DEFAULTS);
  const replaceUrlRef = useRef(createDebouncedReplaceState(200));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const citySlug = params.get('city');
    if (citySlug) {
      const city = getCity(citySlug);
      if (city) {
        setS({
          adr: city.adrAvg,
          occ: city.occupancyAvg,
          reg: CITY_REG_MAP[city.regulationStatus],
          sat: CITY_SAT_MAP[city.saturationTier],
        });
        return;
      }
    }
    setS(parse<UrlState>(window.location.search, DEFAULTS as never));
  }, []);

  useEffect(() => {
    replaceUrlRef.current(s as never, DEFAULTS as never);
    window.gtag?.('event', 'calculator_input_changed', { tool: TOOL });
    if (s.adr > 0 && s.occ > 0) {
      trackCalculatorRun({ tool: TOOL });
    }
  }, [s]);

  const result = useMemo(
    () =>
      scoreMarket({
        adr: s.adr,
        occupancy: s.occ,
        regulationStatus: s.reg,
        saturationTier: s.sat,
      }),
    [s],
  );

  return (
    <section className="surface-calc bg-white p-6">
      <div className="grid lg:grid-cols-2 gap-7">
        <div className="space-y-3">
          <p className="label text-navy">Market profile</p>
          <Field
            id="ms-adr"
            label="Avg ADR for the market"
            prefix="$"
            value={s.adr}
            onChange={(v) => setS((p) => ({ ...p, adr: v }))}
          />
          <Field
            id="ms-occ"
            label="Avg occupancy (0–1)"
            step="0.01"
            value={s.occ}
            onChange={(v) => setS((p) => ({ ...p, occ: v }))}
          />
          <SelectField<RegulationStatus>
            id="ms-reg"
            label="Regulation status"
            value={s.reg}
            onChange={(v) => setS((p) => ({ ...p, reg: v }))}
            options={[
              { value: 'open', label: 'Open — STR allowed by right' },
              { value: 'gray', label: 'Gray — restrictions or evolving rules' },
              { value: 'restricted', label: 'Restricted — primary-residence or banned' },
            ]}
          />
          <SelectField<SaturationTier>
            id="ms-sat"
            label="Saturation"
            value={s.sat}
            onChange={(v) => setS((p) => ({ ...p, sat: v }))}
            options={[
              { value: 'low', label: 'Low — under-supplied' },
              { value: 'medium', label: 'Medium — balanced' },
              { value: 'high', label: 'High — over-supplied' },
            ]}
          />
        </div>

        <div className="space-y-3">
          <p className="label text-navy">Score</p>
          <div className="result-block" aria-live="polite">
            <p className="text-caption text-ink-3 uppercase tracking-widest">Overall</p>
            <p className="font-mono text-5xl text-navy m-0 leading-none mt-1" data-testid="calc-result">
              {formatNumber(result.score)}
              <span className={`ml-3 text-h2 ${TIER_TONE[result.tier]}`}>{result.tier}</span>
            </p>
            <p className="mt-2 text-ui text-ink-2">{result.headline}</p>

            <hr className="my-3 border-rule" />
            <Row label="Regulation" value={`${result.breakdown.regulation} / 100`} />
            <Row label="Economics (RevPAR)" value={`${result.breakdown.economics} / 100`} />
            <Row label="Saturation" value={`${result.breakdown.saturation} / 100`} />
            <hr className="my-3 border-rule" />
            <Row label="RevPAR" value={formatCurrency(s.adr * s.occ)} />
            <Row label="Occupancy" value={formatPercent(s.occ)} muted />

            {result.flags.length > 0 && (
              <div className="mt-4">
                <p className="label text-navy mb-2">Flags</p>
                <ul className="space-y-1 text-small text-ink-2 list-disc pl-5">
                  {result.flags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Actions tool={TOOL} />
    </section>
  );
}
