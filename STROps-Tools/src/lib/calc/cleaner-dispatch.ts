export interface Cleaner {
  name: string;
  phone: string;
}
export interface Turnover {
  propertyId: string;
  address: string;
  bedrooms: number;
}
export interface DispatchInput {
  date: string;
  turnovers: Turnover[];
  cleaners: Cleaner[];
}
export interface Assignment {
  turnover: Turnover;
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
}) {
  return `Hi ${opts.cleanerName} — turnover ${opts.date} at ${opts.address} (${opts.bedrooms}BR). Standard SOP. Reply Y to confirm.`;
}

export function buildDispatch(input: DispatchInput): DispatchResult {
  if (input.cleaners.length === 0) return { date: input.date, assignments: [] };
  const assignments = input.turnovers.map((t, i) => {
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
