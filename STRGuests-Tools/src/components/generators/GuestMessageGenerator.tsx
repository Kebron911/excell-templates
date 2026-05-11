/**
 * Guest message generator — React island for /guest-messages.
 * Submits to POST /api/generate-message via the shared AiGeneratorShell.
 */

import { useState } from 'react';
import AiGeneratorShell from './AiGeneratorShell';

type Stage = 'booking_confirmation' | 'pre_arrival' | 'mid_stay' | 'post_checkout';
type Tone = 'warm' | 'professional' | 'casual';

const STAGES: Array<{ value: Stage; label: string }> = [
  { value: 'booking_confirmation', label: 'Booking confirmation' },
  { value: 'pre_arrival', label: 'Pre-arrival' },
  { value: 'mid_stay', label: 'Mid-stay' },
  { value: 'post_checkout', label: 'Post-checkout' },
];

const TONES: Tone[] = ['warm', 'professional', 'casual'];

export default function GuestMessageGenerator() {
  const [stage, setStage] = useState<Stage>('pre_arrival');
  const [tone, setTone] = useState<Tone>('warm');
  const [context, setContext] = useState('');

  return (
    <AiGeneratorShell
      endpoint="/api/generate-message"
      toolSlug="guest-messages"
      generateLabel="Generate message"
      buildBody={() => ({
        stage,
        tone,
        context: context.trim() || undefined,
      })}
      renderForm={() => (
        <>
          <div>
            <label className="label text-ink-3">Stage</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {STAGES.map((s) => (
                <label
                  key={s.value}
                  className={`cursor-pointer rounded-md border px-3 py-2 text-small ${
                    stage === s.value ? 'border-[color:var(--accent-500)] bg-parchment-light' : 'border-rule'
                  }`}
                >
                  <input
                    type="radio"
                    name="stage"
                    value={s.value}
                    checked={stage === s.value}
                    onChange={() => setStage(s.value)}
                    className="sr-only"
                  />
                  <span className="text-navy">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label text-ink-3">Tone</label>
            <div className="mt-2 flex gap-3">
              {TONES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-small text-navy">
                  <input
                    type="radio"
                    name="tone"
                    value={t}
                    checked={tone === t}
                    onChange={() => setTone(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="label text-ink-3" htmlFor="msg-ctx">Context (optional)</label>
            <textarea
              id="msg-ctx"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              maxLength={800}
              className="mt-1 w-full rounded-md border border-rule px-3 py-2 text-body"
              placeholder="Mountain cabin with hot tub, dog-friendly, gravel driveway."
            />
          </div>
        </>
      )}
    />
  );
}
