import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

const VendorSchema = z.object({
  vendor: z.string(),
  account_email: z.string().optional(),
  plan: z.string().optional(),
  monthly_cost: z.number().nonnegative().default(0),
  annual_cost: z.number().nonnegative().optional(),
  billing_date: z.string().optional(),
  renewal_date: z.string().optional(),
  replaceability: z.number().int().min(1).max(5).optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});
export type Vendor = z.infer<typeof VendorSchema>;

const InventorySchema = z.object({
  vendors: z.array(VendorSchema).default([]),
});

export interface VendorReport {
  vendors: (Vendor & {
    daysToRenewal: number | null;
    isRenewingSoon: boolean;
  })[];
  monthlyBurn: number;
  annualBurn: number;
  upcomingRenewals: number;     // count of renewals ≤30d
}

export async function readVendors(): Promise<VendorReport> {
  let raw: string;
  try {
    raw = await readFile(paths.vendorInventory, 'utf8');
  } catch {
    return { vendors: [], monthlyBurn: 0, annualBurn: 0, upcomingRenewals: 0 };
  }
  const parsed = InventorySchema.parse(parseYaml(raw) ?? { vendors: [] });
  const now = Date.now();
  const enriched = parsed.vendors.map((v) => {
    const renewal = v.renewal_date ? new Date(v.renewal_date).getTime() : null;
    const daysToRenewal = renewal ? Math.floor((renewal - now) / 86_400_000) : null;
    return {
      ...v,
      daysToRenewal,
      isRenewingSoon: daysToRenewal !== null && daysToRenewal >= 0 && daysToRenewal <= 30,
    };
  });
  const monthlyBurn = enriched.reduce((s, v) => s + (v.monthly_cost ?? 0), 0);
  const annualBurn = monthlyBurn * 12 + enriched.reduce((s, v) => {
    const annualOnly = (v.annual_cost ?? 0) - (v.monthly_cost ?? 0) * 12;
    return s + Math.max(0, annualOnly);
  }, 0);
  return {
    vendors: enriched.sort((a, b) => (a.daysToRenewal ?? 9999) - (b.daysToRenewal ?? 9999)),
    monthlyBurn,
    annualBurn,
    upcomingRenewals: enriched.filter((v) => v.isRenewingSoon).length,
  };
}
