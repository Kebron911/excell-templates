/**
 * HouseRulesForm — React island for the house rules PDF generator.
 *
 * Lives client-side only (Astro `client:load`). Captures form input,
 * registers a `window.__strguests.generatePdf['house-rules-pdf']`
 * function the PdfDownloadButton can call, and renders a live preview
 * iframe by re-generating the PDF on every input change (debounced).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildHouseRulesPdf, type HouseRulesInput } from '@/lib/pdf/house-rules';

const DEFAULTS: HouseRulesInput = {
  propertyName: 'Cedar Cottage',
  address: '123 Pine Lane, Asheville NC',
  rules: [
    'Quiet hours from 10pm to 8am.',
    'No smoking anywhere on the property, including the porch.',
    'Maximum 4 guests; no unregistered visitors overnight.',
    'No parties or events.',
    'Please clean dishes and start the dishwasher before checkout.',
  ],
  checkInTime: '3:00 PM',
  checkOutTime: '11:00 AM',
  hostName: '',
  contactPhone: '',
  signatureLine: false,
};

const PDF_DEBOUNCE_MS = 300;

export default function HouseRulesForm() {
  const [input, setInput] = useState<HouseRulesInput>(DEFAULTS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  // Register the global generator function for PdfDownloadButton.
  useEffect(() => {
    const w = window as unknown as { __strguests?: { generatePdf: Record<string, () => Promise<Uint8Array>> } };
    if (!w.__strguests) w.__strguests = { generatePdf: {} };
    w.__strguests.generatePdf['house-rules-pdf'] = () => buildHouseRulesPdf(input);
    return () => {
      delete w.__strguests?.generatePdf['house-rules-pdf'];
    };
  }, [input]);

  // Live preview: regenerate PDF on input change (debounced) → iframe src.
  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      try {
        const bytes = await buildHouseRulesPdf(input);
        if (cancelled) return;
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
        lastUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err) {
        console.error('[HouseRulesForm] preview generation failed', err);
      }
    }, PDF_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [input]);

  useEffect(() => {
    return () => {
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    };
  }, []);

  const rulesText = useMemo(() => input.rules.join('\n'), [input.rules]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
      <div className="space-y-4">
        <Field label="Property name">
          <input
            type="text"
            value={input.propertyName}
            onChange={(e) => setInput((p) => ({ ...p, propertyName: e.target.value }))}
            className={inputClass}
          />
        </Field>

        <Field label="Address">
          <input
            type="text"
            value={input.address ?? ''}
            onChange={(e) => setInput((p) => ({ ...p, address: e.target.value }))}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Check-in time">
            <input
              type="text"
              value={input.checkInTime ?? ''}
              onChange={(e) => setInput((p) => ({ ...p, checkInTime: e.target.value }))}
              className={inputClass}
              placeholder="3:00 PM"
            />
          </Field>
          <Field label="Check-out time">
            <input
              type="text"
              value={input.checkOutTime ?? ''}
              onChange={(e) => setInput((p) => ({ ...p, checkOutTime: e.target.value }))}
              className={inputClass}
              placeholder="11:00 AM"
            />
          </Field>
        </div>

        <Field label="Rules (one per line)">
          <textarea
            value={rulesText}
            onChange={(e) =>
              setInput((p) => ({
                ...p,
                rules: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
              }))
            }
            className={`${inputClass} min-h-[180px] font-mono text-sm leading-relaxed`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Host name">
            <input
              type="text"
              value={input.hostName ?? ''}
              onChange={(e) => setInput((p) => ({ ...p, hostName: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Contact phone">
            <input
              type="text"
              value={input.contactPhone ?? ''}
              onChange={(e) => setInput((p) => ({ ...p, contactPhone: e.target.value }))}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-ui text-navy">
          <input
            type="checkbox"
            checked={input.signatureLine ?? false}
            onChange={(e) => setInput((p) => ({ ...p, signatureLine: e.target.checked }))}
          />
          Include guest signature line
        </label>
      </div>

      <div className="rounded-md border border-rule bg-parchment-light overflow-hidden">
        <div className="px-4 py-2 border-b border-rule text-small text-ink-2 bg-parchment-alt">
          Live preview
        </div>
        {previewUrl ? (
          <iframe
            title="House rules preview"
            src={previewUrl}
            className="w-full h-[640px] bg-parchment"
          />
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
