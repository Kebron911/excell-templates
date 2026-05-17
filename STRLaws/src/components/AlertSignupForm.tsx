import { useState, type FormEvent } from 'react';

interface CityOption {
  id: number;
  name: string;
  state_name: string;
}

interface Props {
  cities: CityOption[];
  /** Override the default /api/alerts/subscribe endpoint (used by tests). */
  endpoint?: string;
  /** UTM tags captured at signup time. */
  source?: string;
}

type Status = 'idle' | 'submitting' | 'sent' | 'error';

export default function AlertSignupForm({ cities, endpoint = '/api/alerts/subscribe', source = '/alerts' }: Props) {
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [severity, setSeverity] = useState<'minor' | 'material' | 'major'>('material');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || cityId === '') {
      setStatus('error');
      setErrorMessage('Pick a city and enter your email.');
      return;
    }
    setStatus('submitting');
    setErrorMessage(null);
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          city_id: cityId,
          severity_threshold: severity,
          source_page: source,
        }),
      });
      if (resp.status === 202) {
        setStatus('sent');
        return;
      }
      const body = (await resp.json().catch(() => ({}))) as { message?: string; error?: string };
      setStatus('error');
      setErrorMessage(body.message ?? body.error ?? `Signup failed (HTTP ${resp.status}).`);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Network error.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-white border border-rule rounded-md p-6">
        <h3 className="text-h3 font-medium text-navy mb-2">Check your inbox</h3>
        <p className="text-ink-2 text-small">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your alerts.
          You won't receive anything else until you confirm.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-rule rounded-md p-6 space-y-4">
      <div>
        <label htmlFor="alert-email" className="block text-label uppercase text-ink-3 mb-1">
          Email
        </label>
        <input
          id="alert-email"
          type="email"
          required
          autoComplete="email"
          className="w-full border border-rule rounded-md px-3 py-2 text-body focus:outline-none focus:border-accent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
        />
      </div>

      <div>
        <label htmlFor="alert-city" className="block text-label uppercase text-ink-3 mb-1">
          City to watch
        </label>
        <select
          id="alert-city"
          required
          className="w-full border border-rule rounded-md px-3 py-2 text-body focus:outline-none focus:border-accent bg-white"
          value={cityId}
          onChange={(e) => setCityId(e.target.value === '' ? '' : Number(e.target.value))}
          disabled={status === 'submitting'}
        >
          <option value="">— pick a city —</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}, {c.state_name}
            </option>
          ))}
        </select>
        <p className="text-caption text-ink-3 mt-1">
          Free tier watches one city. Premium adds unlimited watchlist + instant alerts.
        </p>
      </div>

      <fieldset>
        <legend className="block text-label uppercase text-ink-3 mb-1">Alert me on</legend>
        <div className="flex flex-col sm:flex-row gap-3 text-small">
          {(['major', 'material', 'minor'] as const).map((s) => (
            <label key={s} className="flex items-center gap-2">
              <input
                type="radio"
                name="severity"
                value={s}
                checked={severity === s}
                onChange={() => setSeverity(s)}
                disabled={status === 'submitting'}
              />
              <span className="capitalize">{s}{s === 'material' ? ' (default)' : ''}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {errorMessage && (
        <div role="alert" className="text-small text-warn border-l-4 border-warn pl-3 py-1">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-navy text-parchment py-2 rounded-md text-ui hover:bg-navy-tint disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Get free alerts'}
      </button>

      <p className="text-caption text-ink-3">
        We'll email you once to confirm. Unsubscribe any time. No spam — we only send when regulations actually change.
      </p>
    </form>
  );
}
