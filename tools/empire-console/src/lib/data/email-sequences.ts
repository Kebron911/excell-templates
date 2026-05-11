import { readdir, stat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { paths } from '../paths.js';

/**
 * Walks copy/email-sequences/ and surfaces the IS sequence drafts.
 */

export interface EmailMessage {
  path: string;
  subject: string | null;
  preheader: string | null;
  bodyExcerpt: string;
  size: number;
  mtime: string;
}

export interface EmailSequence {
  slug: string;
  path: string;
  messages: EmailMessage[];
  totalSize: number;
}

export interface EmailSequencesReport {
  sequences: EmailSequence[];
  totalSequences: number;
  totalMessages: number;
}

const EMAIL_DIR = join(paths.root, 'copy', 'email-sequences');

function extractField(raw: string, label: string): string | null {
  const m = raw.match(new RegExp(`(?:^|\\n)\\*\\*${label}:\\*\\*\\s+(.+)`, 'i')) ||
            raw.match(new RegExp(`(?:^|\\n)${label}:\\s+(.+)`, 'i'));
  return m ? m[1].trim() : null;
}

export async function readEmailSequences(): Promise<EmailSequencesReport> {
  let entries;
  try { entries = await readdir(EMAIL_DIR, { withFileTypes: true }); }
  catch { return { sequences: [], totalSequences: 0, totalMessages: 0 }; }

  const sequences: EmailSequence[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const seqDir = join(EMAIL_DIR, entry.name);
    const messages: EmailMessage[] = [];

    let inner;
    try { inner = await readdir(seqDir); } catch { continue; }
    for (const f of inner) {
      if (!f.endsWith('.md')) continue;
      const full = join(seqDir, f);
      let raw = '';
      try { raw = await readFile(full, 'utf8'); } catch { continue; }
      const st = await stat(full);
      messages.push({
        path: full.slice(paths.root.length + 1).replace(/\\/g, '/'),
        subject: extractField(raw, 'Subject'),
        preheader: extractField(raw, 'Preheader') ?? extractField(raw, 'Pre-header'),
        bodyExcerpt: raw.replace(/^---[\s\S]+?---/, '').replace(/[#*`>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 200),
        size: st.size,
        mtime: st.mtime.toISOString(),
      });
    }
    messages.sort((a, b) => a.path.localeCompare(b.path));

    if (messages.length === 0) continue;
    sequences.push({
      slug: entry.name,
      path: seqDir.slice(paths.root.length + 1).replace(/\\/g, '/'),
      messages,
      totalSize: messages.reduce((s, m) => s + m.size, 0),
    });
  }

  sequences.sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    sequences,
    totalSequences: sequences.length,
    totalMessages: sequences.reduce((s, seq) => s + seq.messages.length, 0),
  };
}
