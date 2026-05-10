import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const Schema = z.object({
  cash: z.object({
    stripe_balance: z.number().default(0),
    bank_balance: z.number().default(0),
    last_updated: z.string().optional(),
  }),
  burn: z.object({
    monthly_target: z.number().default(0),
    last_actual: z.number().default(0),
  }),
  pay_rule: z.object({
    type: z.enum(['percent_of_net_profit', 'fixed_monthly', 'runway_target']),
    percent: z.number().default(0),
    fixed: z.number().default(0),
    runway_months_target: z.number().default(6),
    notes: z.string().optional(),
  }),
  tax_buffer: z.object({
    target_percent: z.number().default(0.30),
    current_balance: z.number().default(0),
    ytd_revenue: z.number().default(0),
    next_payment_due: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  // Tolerate `draws:` with no items (YAML null) — treat as empty.
  draws: z.array(z.object({
    amount: z.number(),
    date: z.string(),
    note: z.string().optional(),
  })).nullable().default([]).transform((v) => v ?? []),
});

export interface CompensationReport {
  cashTotal: number;
  monthlyBurn: number;
  runwayMonths: number;
  runwayTarget: number;
  drawAvailable: boolean;
  drawAvailableLabel: string;
  ytdDrawn: number;
  totalDrawn: number;
  taxBufferTarget: number;
  taxBufferActual: number;
  taxBufferShortfall: number;
  raw: z.infer<typeof Schema>;
}

export async function readCompensation(): Promise<CompensationReport | null> {
  let raw: string;
  try { raw = await readFile(paths.ownerCompensation, 'utf8'); }
  catch { return null; }
  const parsed = Schema.parse(parseYaml(raw) ?? {});

  const cashTotal = parsed.cash.stripe_balance + parsed.cash.bank_balance;
  const monthlyBurn = parsed.burn.monthly_target || 1;
  const runwayMonths = cashTotal / monthlyBurn;
  const runwayTarget = parsed.pay_rule.runway_months_target;

  let drawAvailable = false;
  let drawAvailableLabel = 'Not yet';
  if (parsed.pay_rule.type === 'runway_target') {
    drawAvailable = runwayMonths >= runwayTarget;
    drawAvailableLabel = drawAvailable
      ? `Yes — runway ≥${runwayTarget}mo`
      : `Build to ${runwayTarget}mo runway first`;
  } else if (parsed.pay_rule.type === 'percent_of_net_profit') {
    drawAvailable = true;
    drawAvailableLabel = `Yes — ${(parsed.pay_rule.percent * 100).toFixed(0)}% of net profit`;
  } else if (parsed.pay_rule.type === 'fixed_monthly') {
    drawAvailable = true;
    drawAvailableLabel = `Yes — $${parsed.pay_rule.fixed}/month fixed`;
  }

  const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
  const ytdDrawn = parsed.draws
    .filter((d) => new Date(d.date).getTime() >= yearStart)
    .reduce((s, d) => s + d.amount, 0);
  const totalDrawn = parsed.draws.reduce((s, d) => s + d.amount, 0);

  const tb = parsed.tax_buffer;
  const taxBufferTarget = tb ? tb.ytd_revenue * tb.target_percent : 0;
  const taxBufferActual = tb?.current_balance ?? 0;
  const taxBufferShortfall = Math.max(0, taxBufferTarget - taxBufferActual);

  return {
    cashTotal, monthlyBurn, runwayMonths, runwayTarget, drawAvailable, drawAvailableLabel,
    ytdDrawn, totalDrawn, taxBufferTarget, taxBufferActual, taxBufferShortfall,
    raw: parsed,
  };
}
