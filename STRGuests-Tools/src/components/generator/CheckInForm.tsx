/**
 * CheckInForm — multi-step check-in PDF builder.
 *
 * Steps are an editable array; each step can attach an optional photo via
 * native file input → FileReader → data URL. Photos are kept in component
 * state only — never uploaded.
 */

import { useEffect, useRef, useState } from 'react';
import { buildCheckInPdf, type CheckInInput, type CheckInStep } from '@/lib/pdf/check-in';

const DEFAULTS: CheckInInput = {
  propertyName: 'Cedar Cottage',
  address: '123 Pine Lane, Asheville NC',
  doorCode: '4815',
  parkingInstructions: 'Driveway on the left. Don’t block the neighbor’s mailbox.',
  hostPhone: '+1 555 555 0101',
  wifi: { ssid: 'CedarCottage_5G', password: 'mountain-air-2026' },
  steps: [
    { step: 'Find the lockbox', description: 'Mounted on the wall to the right of the front door.' },
    { step: 'Enter the code', description: 'Press firmly — the buttons need to click.' },
    { step: 'Disarm the alarm', description: 'Panel just inside the entryway. Code 0000.' },
  ],
};

const DEBOUNCE = 350;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function CheckInForm() {
  const [input, setInput] = useState<CheckInInput>(DEFAULTS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const w = window as unknown as { __strguests?: { generatePdf: Record<string, () => Promise<Uint8Array>> } };
    if (!w.__strguests) w.__strguests = { generatePdf: {} };
    w.__strguests.generatePdf['check-in-instructions'] = () => buildCheckInPdf(input);
    return () => {
      delete w.__strguests?.generatePdf['check-in-instructions'];
    };
  }, [input]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      try {
        const bytes = await buildCheckInPdf(input);
        if (cancelled) return;
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err) {
        console.error('[CheckInForm] preview generation failed', err);
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

  function updateStep(idx: number, next: CheckInStep) {
    const copy = [...input.steps];
    copy[idx] = next;
    setInput((p) => ({ ...p, steps: copy }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
      <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2">
        <Field label="Property name">
          <input className={inputClass} value={input.propertyName} onChange={(e) => setInput((p) => ({ ...p, propertyName: e.target.value }))} />
        </Field>
        <Field label="Address (optional)">
          <input className={inputClass} value={input.address ?? ''} onChange={(e) => setInput((p) => ({ ...p, address: e.target.value }))} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Door code">
            <input className={inputClass} value={input.doorCode ?? ''} onChange={(e) => setInput((p) => ({ ...p, doorCode: e.target.value }))} />
          </Field>
          <Field label="Host phone">
            <input className={inputClass} value={input.hostPhone ?? ''} onChange={(e) => setInput((p) => ({ ...p, hostPhone: e.target.value }))} />
          </Field>
        </div>
        <Field label="Parking instructions">
          <textarea className={`${inputClass} min-h-[60px]`} value={input.parkingInstructions ?? ''} onChange={(e) => setInput((p) => ({ ...p, parkingInstructions: e.target.value }))} />
        </Field>

        <fieldset className="border border-rule rounded-md p-3">
          <legend className="text-small text-ink-2 px-2">Wi-Fi</legend>
          <div className="grid grid-cols-2 gap-2">
            <input className={inputClass} placeholder="SSID" value={input.wifi?.ssid ?? ''} onChange={(e) => setInput((p) => ({ ...p, wifi: { ssid: e.target.value, password: p.wifi?.password ?? '' } }))} />
            <input className={inputClass} placeholder="Password" value={input.wifi?.password ?? ''} onChange={(e) => setInput((p) => ({ ...p, wifi: { ssid: p.wifi?.ssid ?? '', password: e.target.value } }))} />
          </div>
        </fieldset>

        <fieldset className="border border-rule rounded-md p-3">
          <legend className="text-small text-ink-2 px-2">Arrival steps</legend>
          <div className="space-y-3">
            {input.steps.map((step, idx) => (
              <div key={idx} className="rounded-md border border-rule p-3 bg-parchment">
                <input
                  className={inputClass}
                  placeholder="Step title"
                  value={step.step}
                  onChange={(e) => updateStep(idx, { ...step, step: e.target.value })}
                />
                <textarea
                  className={`${inputClass} mt-2 min-h-[60px]`}
                  placeholder="Description"
                  value={step.description}
                  onChange={(e) => updateStep(idx, { ...step, description: e.target.value })}
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="text-small"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await readFileAsDataUrl(file);
                      updateStep(idx, { ...step, photoDataUrl: url });
                    }}
                  />
                  {step.photoDataUrl && (
                    <button
                      type="button"
                      className="text-small text-[color:var(--accent-700)] hover:underline"
                      onClick={() => updateStep(idx, { ...step, photoDataUrl: undefined })}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-2 text-small text-[color:var(--accent-700)] hover:underline"
                  onClick={() => setInput((p) => ({ ...p, steps: p.steps.filter((_, i) => i !== idx) }))}
                >
                  Remove step
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-small px-3 py-1.5 rounded-md border border-rule bg-parchment hover:border-[color:var(--accent-500)]"
              onClick={() => setInput((p) => ({ ...p, steps: [...p.steps, { step: '', description: '' }] }))}
            >
              + Add step
            </button>
          </div>
        </fieldset>
      </div>

      <div className="rounded-md border border-rule bg-parchment-light overflow-hidden">
        <div className="px-4 py-2 border-b border-rule text-small text-ink-2 bg-parchment-alt">
          Live preview
        </div>
        {previewUrl ? (
          <iframe title="Check-in preview" src={previewUrl} className="w-full h-[640px] bg-parchment" />
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
