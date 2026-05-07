/**
 * Cleaner dispatch — assignments + per-cleaner SMS templates.
 *
 * Round-robin distribution: cleaner i = turnovers[i % cleaners.length].
 * The SMS template is intentionally short so it fits inside one SMS segment
 * for most addresses; cleaners read these on their phones between properties.
 */

export interface Cleaner {
  name: string;
  phone: string;
}

export interface DispatchTurnover {
  propertyId: string;
  address: string;
  bedrooms: number;
}

export interface DispatchInput {
  /** ISO YYYY-MM-DD */
  date: string;
  turnovers: DispatchTurnover[];
  cleaners: Cleaner[];
}

export interface Assignment {
  turnover: DispatchTurnover;
  cleaner: Cleaner;
  sms: string;
}

export interface DispatchResult {
  date: string;
  assignments: Assignment[];
}

export function smsTemplate(opts: {
  cleanerName: string;
  address: string;
  date: string;
  bedrooms: number;
}): string {
  return `Hi ${opts.cleanerName} — turnover ${opts.date} at ${opts.address} (${opts.bedrooms}BR). Standard SOP. Reply Y to confirm.`;
}

export function buildDispatch(input: DispatchInput): DispatchResult {
  if (input.cleaners.length === 0) return { date: input.date, assignments: [] };
  const assignments: Assignment[] = input.turnovers.map((t, i) => {
    const cleaner = input.cleaners[i % input.cleaners.length];
    const sms = smsTemplate({
      cleanerName: cleaner.name,
      address: t.address,
      date: input.date,
      bedrooms: t.bedrooms,
    });
    return { turnover: t, cleaner, sms };
  });
  return { date: input.date, assignments };
}
