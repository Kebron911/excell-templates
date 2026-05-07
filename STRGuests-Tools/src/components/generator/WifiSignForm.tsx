/**
 * WifiSignForm — picks one of three frame-ready Wi-Fi sign templates.
 */

import { useEffect, useRef, useState } from 'react';
import { buildWifiSignPdf, type WifiSignInput, type WifiSignTemplate } from '@/lib/pdf/wifi-sign';
import { buildPinPng } from '@/lib/pin';

const DEFAULTS: WifiSignInput = {
  propertyName: 'Cedar Cottage',
  ssid: 'CedarCottage_5G',
  password: 'mountain-air-2026',
  template: 'minimal',
  note: 'No connection? Text the host.',
};

const TEMPLATES: { id: WifiSignTemplate; label: string; blurb: string }[] = [
  { id: 'minimal', label: 'Minimal', blurb: 'Centered, plenty of breathing room. Frame in a modern home.' },
  { id: 'cottage', label: 'Cottage', blurb: 'Warm parchment, terracotta border. Reads as hand-printed.' },
  { id: 'modern', label: 'Modern', blurb: 'Bold blocks, high contrast. Reads from across the room.' },
];

export default function WifiSignForm() {
  const [input, setInput] = useState<WifiSignInput>(DEFAULTS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      __strguests?: {
        generatePdf: Record<string, () => Promise<Uint8Array>>;
        generatePinPng?: Record<string, () => Promise<Blob>>;
      };
    };
    if (!w.__strguests) w.__strguests = { generatePdf: {}, generatePinPng: {} };
    if (!w.__strguests.generatePinPng) w.__strguests.generatePinPng = {};
    w.__strguests.generatePdf['wifi-sign'] = () => buildWifiSignPdf(input);
    w.__strguests.generatePinPng['wifi-sign'] = () =>
      buildPinPng({
        toolSlug: 'wifi-sign',
        toolName: 'Wi-Fi Sign Generator',
        propertyName: input.propertyName,
        tagline: 'Frame-ready Wi-Fi card. Three design templates.',
      });
    return () => {
      delete w.__strguests?.generatePdf['wifi-sign'];
      delete w.__strguests?.generatePinPng?.['wifi-sign'];
    };
  }, [input]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      try {
        const bytes = await buildWifiSignPdf(input);
        if (cancelled) return;
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err) {
        console.error('[WifiSignForm] preview generation failed', err);
      }
    }, 200);
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
      <div className="space-y-4">
        <Field label="Property name">
          <input className={inputClass} value={input.propertyName} onChange={(e) => setInput((p) => ({ ...p, propertyName: e.target.value }))} />
        </Field>
        <Field label="Wi-Fi network (SSID)">
          <input className={inputClass} value={input.ssid} onChange={(e) => setInput((p) => ({ ...p, ssid: e.target.value }))} />
        </Field>
        <Field label="Password">
          <input className={inputClass} value={input.password} onChange={(e) => setInput((p) => ({ ...p, password: e.target.value }))} />
        </Field>
        <Field label="Footer note (optional)">
          <input className={inputClass} value={input.note ?? ''} onChange={(e) => setInput((p) => ({ ...p, note: e.target.value }))} />
        </Field>

        <fieldset className="border border-rule rounded-md p-3">
          <legend className="text-small text-ink-2 px-2">Template</legend>
          <div className="grid grid-cols-1 gap-2">
            {TEMPLATES.map((t) => (
              <label key={t.id} className={`block rounded-md border p-3 cursor-pointer transition-colors ${input.template === t.id ? 'border-[color:var(--accent-500)] bg-parchment-light' : 'border-rule bg-parchment hover:border-[color:var(--accent-300)]'}`}>
                <input
                  type="radio"
                  name="template"
                  className="sr-only"
                  value={t.id}
                  checked={input.template === t.id}
                  onChange={() => setInput((p) => ({ ...p, template: t.id }))}
                />
                <span className="block text-ui font-semibold text-navy">{t.label}</span>
                <span className="block text-caption text-ink-2 mt-1 leading-snug">{t.blurb}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-md border border-rule bg-parchment-light overflow-hidden">
        <div className="px-4 py-2 border-b border-rule text-small text-ink-2 bg-parchment-alt">
          Live preview
        </div>
        {previewUrl ? (
          <iframe title="Wi-Fi sign preview" src={previewUrl} className="w-full h-[640px] bg-parchment" />
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

const inputClass =
  'w-full rounded-md border border-rule bg-parchment px-3 py-2 text-ui text-navy placeholder:text-ink-3 focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus';
