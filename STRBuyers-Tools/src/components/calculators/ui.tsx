/**
 * Shared calculator UI helpers (port from STRHost-Tools).
 *
 * Field: labeled number input with optional currency/percent prefix.
 * Row:   labeled value row for the result panel.
 * Actions: Copy share link + Print buttons with GA4 events.
 */

declare global {
  interface Window {
    gtag?: (cmd: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export function Field({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 'any',
  min = 0,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string | number;
  min?: number;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-ui text-navy mb-1">{label}</span>
      <span className="flex items-center border border-rule rounded-md bg-parchment-light focus-within:border-accent focus-within:shadow-focus transition-shadow">
        {prefix && (
          <span className="px-3 text-ink-3 font-mono select-none" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          className="font-mono flex-1 px-2 py-2 bg-transparent outline-none text-navy w-full min-w-0"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && (
          <span className="px-3 text-ink-3 font-mono select-none" aria-hidden="true">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-ui text-navy mb-1">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="font-mono w-full border border-rule rounded-md bg-parchment-light px-3 py-2 text-navy focus:outline-none focus:border-accent focus:shadow-focus"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Row({
  label,
  value,
  bold,
  accent,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={[
        'flex justify-between items-baseline',
        bold ? 'font-semibold' : '',
        accent ? 'text-navy' : muted ? 'text-ink-2' : 'text-ink-1',
      ].join(' ')}
    >
      <span className={bold ? 'text-ui' : 'text-small'}>{label}</span>
      <span className={`font-mono ${bold ? 'text-h3' : 'text-body'}`}>{value}</span>
    </div>
  );
}

export function Actions({ tool }: { tool: string }) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      window.gtag?.('event', 'share_link_copied', { tool });
    } catch {
      /* clipboard may be blocked; ignore */
    }
  };

  const onPrint = () => {
    window.gtag?.('event', 'print_triggered', { tool });
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2 mt-6 no-print">
      <button
        type="button"
        onClick={onCopy}
        className="border border-rule rounded-md bg-parchment-light px-4 py-2 text-ui text-navy hover:border-accent hover:text-accent transition-colors duration-std focus:outline-none focus:shadow-focus"
      >
        Copy share link
      </button>
      <button
        type="button"
        onClick={onPrint}
        className="border border-rule rounded-md bg-parchment-light px-4 py-2 text-ui text-navy hover:border-accent hover:text-accent transition-colors duration-std focus:outline-none focus:shadow-focus"
      >
        Print
      </button>
    </div>
  );
}
