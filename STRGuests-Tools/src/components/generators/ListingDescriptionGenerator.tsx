/**
 * ListingDescriptionGenerator — React island for the listing-description AI tool.
 *
 * Form on the left (8 fields). Result panel on the right with copy / regenerate /
 * pin actions. Reads the AiRateLimitNotice's `strguests:rate-limit` event to
 * disable the submit button when the visitor is out of budget.
 */

import { useEffect, useState } from 'react';
import { callAi, emitGa4 } from '@/lib/ai-client';

type Tone = 'warm' | 'professional' | 'quirky';
type Length = 'short' | 'medium' | 'long';

const TONES: Tone[] = ['warm', 'professional', 'quirky'];
const LENGTHS: Length[] = ['short', 'medium', 'long'];

export default function ListingDescriptionGenerator() {
  const [propertyType, setPropertyType] = useState('cabin');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [sleeps, setSleeps] = useState(4);
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('hot tub, fire pit, mountain views');
  const [tone, setTone] = useState<Tone>('warm');
  const [length, setLength] = useState<Length>('medium');

  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    function onRate(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.tool === 'listing-description') {
        setRemaining(typeof detail.remaining === 'number' ? detail.remaining : null);
        setBlocked(Boolean(detail.blocked));
      }
    }
    window.addEventListener('strguests:rate-limit', onRate as EventListener);
    return () => window.removeEventListener('strguests:rate-limit', onRate as EventListener);
  }, []);

  async function submit() {
    if (busy || blocked) return;
    setError(null);
    setBusy(true);
    const body = {
      propertyType: propertyType.trim() || 'property',
      bedrooms,
      bathrooms,
      sleeps,
      location: location.trim() || 'United States',
      features: features.split(',').map((s) => s.trim()).filter(Boolean),
      tone,
      length,
    };
    const out = await callAi('generate-listing', body);
    setBusy(false);
    if (out.ok) {
      setResult(out.result);
      setRemaining(out.requestsRemaining);
      emitGa4('ai_generation_completed', { tool: 'listing-description', tokens: out.tokensUsed });
    } else if (out.status === 429) {
      setBlocked(true);
      setError("You're out of free generations for now. Verify your email for 50/day.");
      emitGa4('ai_rate_limit_hit', { tool: 'listing-description' });
    } else if (out.error === 'ai_unconfigured') {
      setError('The AI generator is not yet configured on the server. Try again after launch.');
    } else {
      setError(out.message ?? 'Something went wrong. Please try again.');
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    emitGa4('text_copied', { tool: 'listing-description' });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6">
      <section className="surface-gen p-5">
        <h2 className="font-serif text-h3 text-navy">Tell us about the property</h2>
        <p className="mt-1 text-small text-ink-2 leading-snug">
          The more specific you are, the less generic the copy. Real features beat clichés.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest col-span-2">
            Property type
            <input
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              placeholder="cabin, beach house, downtown loft…"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Bedrooms
            <input
              type="number"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Bathrooms
            <input
              type="number"
              min={0}
              step={0.5}
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Sleeps
            <input
              type="number"
              min={1}
              value={sleeps}
              onChange={(e) => setSleeps(Number(e.target.value))}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest col-span-2">
            Location
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
              placeholder="Asheville, NC"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest col-span-2">
            Features <span className="lowercase tracking-normal text-ink-3">(comma-separated)</span>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={2}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            />
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Tone
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            >
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-caption text-ink-2 uppercase tracking-widest">
            Length
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as Length)}
              className="mt-1 rounded-md border border-rule bg-parchment-light px-3 py-2 text-ui text-navy focus:outline-none focus:border-[color:var(--accent-500)] focus:shadow-focus"
            >
              {LENGTHS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={busy || blocked}
          className="mt-5 inline-flex items-center gap-2 rounded-md text-parchment px-5 py-2.5 text-ui transition-colors duration-std focus:outline-none focus:shadow-focus hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent-500)' }}
        >
          {busy ? 'Generating…' : result ? 'Regenerate' : 'Generate listing'}
        </button>
        {error ? (
          <p className="mt-3 text-small text-[color:var(--accent-700)]">{error}</p>
        ) : null}
      </section>

      <section className="surface-gen p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-h3 text-navy">Preview</h2>
          {remaining !== null ? (
            <span className="text-caption text-ink-3">{remaining} generations left</span>
          ) : null}
        </div>
        {result ? (
          <>
            <p className="mt-4 whitespace-pre-wrap text-body text-graphite leading-relaxed">{result}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyResult}
                className="inline-flex items-center gap-2 rounded-md border border-rule bg-parchment px-4 py-2 text-ui text-navy hover:bg-parchment-light focus:outline-none focus:shadow-focus"
              >
                Copy text
              </button>
            </div>
          </>
        ) : (
          <p className="mt-4 text-small text-ink-3 leading-snug">
            Fill in the form and hit <em>Generate listing</em>. The result will appear here.
          </p>
        )}
      </section>
    </div>
  );
}
