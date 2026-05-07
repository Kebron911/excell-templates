/**
 * WelcomeBookForm — React island for the multi-page Welcome Book PDF.
 *
 * Editor pattern: structured arrays (sections, picks, emergency contacts)
 * with add/remove controls. Live preview re-renders the PDF on debounce.
 */

import { useEffect, useRef, useState } from 'react';
import { buildWelcomeBookPdf, type WelcomeBookInput } from '@/lib/pdf/welcome-book';

const DEFAULTS: WelcomeBookInput = {
  propertyName: 'Cedar Cottage',
  hostName: 'Daniel Harrison',
  hostBio: 'Local since 2017. Happy to help with anything during your stay — text me anytime.',
  wifi: { ssid: 'CedarCottage', password: 'mountain-air-2026' },
  checkout: '11:00 AM',
  sections: [
    {
      heading: 'Getting in',
      body: 'Lockbox code 1234. The front door sticks — push firmly while turning. Heat & A/C pad is on the wall in the entryway.',
    },
    {
      heading: 'House notes',
      body: 'Quiet hours start at 10pm. Trash pickup is Tuesday morning — please move bins to the curb Monday night.',
    },
  ],
  localPicks: [
    { name: 'River Arts Cafe', category: 'Coffee · Breakfast', note: 'Try the cardamom bun. Walking distance.' },
    { name: 'Hop Trail Brewery', category: 'Beer · Pizza', note: '5 minute drive — kid friendly.' },
  ],
  emergency: [
    { label: 'Fire / Police', value: '911' },
    { label: 'Property manager', value: '+1 555 555 0101' },
  ],
};

const DEBOUNCE = 350;

export default function WelcomeBookForm() {
  const [input, setInput] = useState<WelcomeBookInput>(DEFAULTS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const w = window as unknown as { __strguests?: { generatePdf: Record<string, () => Promise<Uint8Array>> } };
    if (!w.__strguests) w.__strguests = { generatePdf: {} };
    w.__strguests.generatePdf['welcome-book'] = () => buildWelcomeBookPdf(input);
    return () => {
      delete w.__strguests?.generatePdf['welcome-book'];
    };
  }, [input]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      try {
        const bytes = await buildWelcomeBookPdf(input);
        if (cancelled) return;
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err) {
        console.error('[WelcomeBookForm] preview generation failed', err);
      }
    }, DEBOUNCE);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [input]);

  useEffect(() => () => {
    if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
      <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
        <Field label="Property name">
          <input
            className={inputClass}
            value={input.propertyName}
            onChange={(e) => setInput((p) => ({ ...p, propertyName: e.target.value }))}
          />
        </Field>
        <Field label="Host name">
          <input
            className={inputClass}
            value={input.hostName}
            onChange={(e) => setInput((p) => ({ ...p, hostName: e.target.value }))}
          />
        </Field>
        <Field label="Host bio (optional)">
          <textarea
            className={`${inputClass} min-h-[64px]`}
            value={input.hostBio ?? ''}
            onChange={(e) => setInput((p) => ({ ...p, hostBio: e.target.value }))}
          />
        </Field>

        <fieldset className="border border-rule rounded-md p-3">
          <legend className="text-small text-ink-2 px-2">Wi-Fi</legend>
          <div className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              placeholder="SSID"
              value={input.wifi?.ssid ?? ''}
              onChange={(e) => setInput((p) => ({ ...p, wifi: { ssid: e.target.value, password: p.wifi?.password ?? '' } }))}
            />
            <input
              className={inputClass}
              placeholder="Password"
              value={input.wifi?.password ?? ''}
              onChange={(e) => setInput((p) => ({ ...p, wifi: { ssid: p.wifi?.ssid ?? '', password: e.target.value } }))}
            />
          </div>
        </fieldset>

        <Field label="Checkout time">
          <input
            className={inputClass}
            value={input.checkout ?? ''}
            onChange={(e) => setInput((p) => ({ ...p, checkout: e.target.value }))}
          />
        </Field>

        <ArrayEditor
          legend="Sections"
          items={input.sections}
          onChange={(sections) => setInput((p) => ({ ...p, sections }))}
          empty={() => ({ heading: '', body: '' })}
          render={(section, update) => (
            <>
              <input
                className={inputClass}
                placeholder="Heading"
                value={section.heading}
                onChange={(e) => update({ ...section, heading: e.target.value })}
              />
              <textarea
                className={`${inputClass} min-h-[80px] mt-2`}
                placeholder="Body"
                value={section.body}
                onChange={(e) => update({ ...section, body: e.target.value })}
              />
            </>
          )}
        />

        <ArrayEditor
          legend="Local picks"
          items={input.localPicks ?? []}
          onChange={(localPicks) => setInput((p) => ({ ...p, localPicks }))}
          empty={() => ({ name: '', category: '', note: '' })}
          render={(pick, update) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} placeholder="Name" value={pick.name} onChange={(e) => update({ ...pick, name: e.target.value })} />
                <input className={inputClass} placeholder="Category" value={pick.category} onChange={(e) => update({ ...pick, category: e.target.value })} />
              </div>
              <input className={`${inputClass} mt-2`} placeholder="Note (optional)" value={pick.note ?? ''} onChange={(e) => update({ ...pick, note: e.target.value })} />
            </>
          )}
        />

        <ArrayEditor
          legend="Emergency contacts"
          items={input.emergency ?? []}
          onChange={(emergency) => setInput((p) => ({ ...p, emergency }))}
          empty={() => ({ label: '', value: '' })}
          render={(e, update) => (
            <div className="grid grid-cols-2 gap-2">
              <input className={inputClass} placeholder="Label" value={e.label} onChange={(ev) => update({ ...e, label: ev.target.value })} />
              <input className={inputClass} placeholder="Value" value={e.value} onChange={(ev) => update({ ...e, value: ev.target.value })} />
            </div>
          )}
        />
      </div>

      <div className="rounded-md border border-rule bg-parchment-light overflow-hidden">
        <div className="px-4 py-2 border-b border-rule text-small text-ink-2 bg-parchment-alt">
          Live preview
        </div>
        {previewUrl ? (
          <iframe title="Welcome book preview" src={previewUrl} className="w-full h-[640px] bg-parchment" />
        ) : (
          <div className="p-6 text-ink-2 text-small">Generating preview…</div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-small text-ink-2 mb-1">{label}</span>
      {children}
    </label>
  );
}

interface ArrayEditorProps<T> {
  legend: string;
  items: T[];
  onChange: (next: T[]) => void;
  empty: () => T;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
}

function ArrayEditor<T>({ legend, items, onChange, empty, render }: ArrayEditorProps<T>) {
  return (
    <fieldset className="border border-rule rounded-md p-3">
      <legend className="text-small text-ink-2 px-2">{legend}</legend>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-md border border-rule p-3 bg-parchment">
            {render(item, (next) => {
              const copy = [...items];
              copy[idx] = next;
              onChange(copy);
            })}
            <button
              type="button"
              className="mt-2 text-small text-[color:var(--accent-700)] hover:underline"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-small px-3 py-1.5 rounded-md border border-rule bg-parchment hover:border-[color:var(--accent-500)]"
          onClick={() => onChange([...items, empty()])}
        >
          + Add
        </button>
      </div>
    </fieldset>
  );
}

const inputClass =
  'w-full rounded-md border border-rule bg-parchment px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus';
