/**
 * HouseRulesGenerator — React island for the strguests house-rules PDF tool.
 *
 * Layout: form on the left (toggleable presets + property name + custom rules),
 * preview on the right (HTML mirror of the PDF page).
 *
 * Persistence: hooks `window.__strguests.generatePdf['house-rules-pdf']` so
 * the shared <PdfDownloadButton> island can call us. Per Phase 1 contract.
 */

import { useEffect, useMemo, useState } from 'react';
import { buildHouseRulesPdf, type HouseRulesInput } from '@/lib/pdf/house-rules';
import presetsData from '@/data/house-rules-presets.json';

type Preset = { id: string; label: string; default: boolean };
const PRESETS: Preset[] = presetsData.presets as Preset[];

const TOOL_SLUG = 'house-rules-pdf';

export default function HouseRulesGenerator() {
  const [propertyName, setPropertyName] = useState('Your Property');
  const [hostName, setHostName] = useState('');
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PRESETS.map((p) => [p.id, p.default])),
  );
  const [custom, setCustom] = useState('');

  const rules = useMemo(() => {
    const fromPresets = PRESETS.filter((p) => enabled[p.id]).map((p) => p.label);
    const fromCustom = custom
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    return [...fromPresets, ...fromCustom];
  }, [enabled, custom]);

  const input: HouseRulesInput = useMemo(
    () => ({ propertyName: propertyName.trim() || 'Your Property', hostName: hostName.trim() || undefined, rules }),
    [propertyName, hostName, rules],
  );

  // Register the PDF generator on the window so PdfDownloadButton can pick it up.
  useEffect(() => {
    const w = window as any;
    w.__strguests = w.__strguests ?? {};
    w.__strguests.generatePdf = w.__strguests.generatePdf ?? {};
    w.__strguests.generatePdf[TOOL_SLUG] = () => buildHouseRulesPdf(input);
    return () => {
      if (w.__strguests?.generatePdf?.[TOOL_SLUG]) {
        delete w.__strguests.generatePdf[TOOL_SLUG];
      }
    };
  }, [input]);

  const togglePreset = (id: string) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      {/* ---- Form ---------------------------------------------------------- */}
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Customize your rules</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          Toggle the presets that fit your property, then add anything specific in the
          custom rules box. The preview updates as you type.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Property name
            <input
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              placeholder="Cozy Cabin on Fox Ridge"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Host name (optional)
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              placeholder="Daniel"
            />
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="text-caption text-ink-2 uppercase tracking-widest">
            Preset rules ({PRESETS.length})
          </legend>
          <ul className="mt-3 space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {PRESETS.map((p) => (
              <li key={p.id}>
                <label className="flex items-start gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-parchment-alt">
                  <input
                    type="checkbox"
                    checked={enabled[p.id] ?? false}
                    onChange={() => togglePreset(p.id)}
                    className="mt-0.5 h-4 w-4 accent-[color:var(--accent-500)]"
                  />
                  <span className="text-ui text-graphite leading-snug">{p.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <label className="mt-6 flex flex-col text-caption text-ink-2 uppercase tracking-widest">
          Custom rules (one per line)
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            rows={4}
            className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus font-sans"
            placeholder={'Please leave the back gate latched\nDishes go in the dishwasher, not the sink'}
          />
        </label>
      </section>

      {/* ---- Preview ------------------------------------------------------- */}
      <section
        aria-label="PDF preview"
        className="generator-preview rounded-md border border-rule bg-white p-7 shadow-card"
      >
        <header className="border-b border-rule pb-4">
          <h3 className="font-serif text-h3 text-navy m-0">House Rules</h3>
          <p className="mt-1 text-small text-ink-2">{input.propertyName}</p>
          <hr className="accent-rule mt-3" />
        </header>

        <ol className="mt-5 space-y-2.5 list-none p-0">
          {rules.length === 0 ? (
            <li className="text-small text-ink-3 italic">
              No rules selected — toggle presets or add custom rules to populate the PDF.
            </li>
          ) : (
            rules.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-3 w-3 border border-ink-2 rounded-[1px] shrink-0"
                />
                <span className="text-ui text-graphite leading-snug">{r}</span>
              </li>
            ))
          )}
        </ol>

        {input.hostName && (
          <p className="mt-7 text-small font-semibold text-navy">— {input.hostName}</p>
        )}

        <footer className="mt-9 pt-3 border-t border-rule text-caption text-ink-3 text-center font-mono">
          Generated {new Date().toISOString().slice(0, 10)} · strguests.tools
        </footer>
      </section>
    </div>
  );
}
