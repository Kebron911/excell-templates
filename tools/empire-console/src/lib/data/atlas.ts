import { readFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { paths } from '../paths.js';

export const AtlasItemKind = z.enum(['internal', 'external', 'doc', 'code', 'yaml', 'runbook']);
export type AtlasItemKind = z.infer<typeof AtlasItemKind>;

const AtlasItemSchema = z.object({
  name: z.string(),
  url: z.string().default(''),
  kind: AtlasItemKind,
  note: z.string().optional(),
  status: z.string().optional(),
});
export type AtlasItem = z.infer<typeof AtlasItemSchema>;

const AtlasGroupSchema = z.object({
  label: z.string(),
  items: z.array(AtlasItemSchema).default([]),
});
export type AtlasGroup = z.infer<typeof AtlasGroupSchema>;

const AtlasSectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  expanded: z.boolean().default(false),
  groups: z.array(AtlasGroupSchema).default([]),
});
export type AtlasSection = z.infer<typeof AtlasSectionSchema>;

/** Compact shape used by the Cmd+K palette (every page embeds this). */
export interface FlatAtlasItem {
  name: string;
  url: string;
  kind: AtlasItemKind;
  section: string;
  note?: string;
  isExternal: boolean;
}

export function flattenForPalette(report: AtlasReport): FlatAtlasItem[] {
  const out: FlatAtlasItem[] = [];
  for (const sec of report.sections) {
    for (const grp of sec.groups) {
      for (const it of grp.items) {
        if (!it.url) continue;
        out.push({
          name: it.name,
          url: it.url,
          kind: it.kind,
          section: sec.label,
          note: it.note,
          isExternal: it.kind === 'external',
        });
      }
    }
  }
  return out;
}

const AtlasFileSchema = z.object({
  sections: z.array(AtlasSectionSchema).default([]),
});

export interface AtlasReport {
  sections: AtlasSection[];
  totals: {
    sections: number;
    items: number;
    byKind: Record<AtlasItemKind, number>;
  };
}

export async function readAtlas(): Promise<AtlasReport> {
  let raw: string;
  try { raw = await readFile(paths.atlas, 'utf8'); }
  catch { return emptyReport(); }
  const parsed = AtlasFileSchema.parse(parseYaml(raw) ?? { sections: [] });

  const byKind: Record<AtlasItemKind, number> = {
    internal: 0, external: 0, doc: 0, code: 0, yaml: 0, runbook: 0,
  };
  let totalItems = 0;
  for (const sec of parsed.sections) {
    for (const grp of sec.groups) {
      for (const it of grp.items) {
        byKind[it.kind] = (byKind[it.kind] ?? 0) + 1;
        totalItems++;
      }
    }
  }

  return {
    sections: parsed.sections,
    totals: { sections: parsed.sections.length, items: totalItems, byKind },
  };
}

function emptyReport(): AtlasReport {
  return {
    sections: [],
    totals: { sections: 0, items: 0, byKind: { internal: 0, external: 0, doc: 0, code: 0, yaml: 0, runbook: 0 } },
  };
}
