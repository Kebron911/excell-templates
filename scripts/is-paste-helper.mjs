#!/usr/bin/env node
// is-paste-helper.mjs
// Parses every email-sequence .md draft into a compact paste sheet
// that mirrors the IS UI flow: one block per email with Name, Trigger Tag,
// Delay, Subject, Preheader, and the body.
//
// Output: ops/manual work/influencersoft-paste-sheets/<sequence>.md
// Plus a single combined master: __ALL-SEQUENCES.md for one-screen scrolling.
//
// Usage: node scripts/is-paste-helper.mjs

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SEQ_DIR = join(REPO_ROOT, "copy", "email-sequences");
const BUNDLE_DIR = join(SEQ_DIR, "bundles");
const OUT_DIR = join(REPO_ROOT, "ops", "manual work", "influencersoft-paste-sheets");

// Paste order from ops/manual work/influencersoft-manual-setup-guide.md Part 3
const PASTE_ORDER = [
  { name: "post-purchase-etsy-buyer", trigger: "customer:etsy" },
  { name: "review-request", trigger: "purchased:day5" },
  { name: "refund-recovery", trigger: "refund-filed" },
  { name: "welcome-book-magnet", trigger: "lead-magnet:welcome-book" },
  { name: "abandoned-cart", trigger: "checkout-abandoned" },
  { name: "win-back", trigger: "inactive-30d" },
  { name: "BUNDLE-01-first-year-host", trigger: "bundle-cross:first-year-host", bundle: true },
  { name: "BUNDLE-02-aspiring-host", trigger: "bundle-cross:aspiring-host", bundle: true },
  { name: "BUNDLE-03-year-2-operator", trigger: "bundle-cross:year-2-operator", bundle: true },
  { name: "BUNDLE-04-portfolio", trigger: "bundle-cross:portfolio", bundle: true },
  { name: "BUNDLE-05-pro-manager", trigger: "bundle-cross:pro-manager", bundle: true },
];

// Parse "## Email N — <timing> — <title>" headers
// Matches: "## Email 1 — Day 7 — The ask" (em-dash, en-dash, or hyphen separators)
const DASH = "[\\u2014\\u2013\\-]";
const EMAIL_HEADER_RX = new RegExp(
  `^##\\s+Email\\s+(\\d+)\\s+${DASH}\\s+(.+?)\\s+${DASH}\\s+(.+)$`
);

function parseSequenceMd(md, name) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const emails = [];
  let cur = null;
  let inBody = false;
  let bodyLines = [];
  for (const line of lines) {
    const h = line.match(EMAIL_HEADER_RX);
    if (h) {
      if (cur) {
        cur.body = bodyLines.join("\n").trim();
        emails.push(cur);
      }
      cur = {
        step: parseInt(h[1], 10),
        timing: h[2].trim(),
        title: h[3].trim(),
        subject: "",
        preheader: "",
        body: "",
      };
      inBody = false;
      bodyLines = [];
      continue;
    }
    if (!cur) continue;
    const sm = line.match(/^\*\*Subject:\*\*\s*(.+)$/);
    if (sm) {
      cur.subject = sm[1].trim();
      continue;
    }
    const pm = line.match(/^\*\*Preheader:\*\*\s*(.+)$/);
    if (pm) {
      cur.preheader = pm[1].trim();
      continue;
    }
    if (line.trim() === "```") {
      inBody = !inBody;
      continue;
    }
    if (inBody) bodyLines.push(line);
  }
  if (cur) {
    cur.body = bodyLines.join("\n").trim();
    emails.push(cur);
  }
  return emails;
}

function renderPasteSheet(seq, emails, sourcePath) {
  const total = emails.length;
  const sections = emails.map((e) => {
    return [
      `### Email ${e.step} of ${total} — ${e.title}`,
      ``,
      `- **Delay (set in IS):** ${e.timing}`,
      `- **Subject (copy):**`,
      ``,
      `      ${e.subject}`,
      ``,
      `- **Preheader (copy):**`,
      ``,
      `      ${e.preheader}`,
      ``,
      `- **Body (copy everything between the lines below):**`,
      ``,
      `-----8<----- BEGIN ${seq.name} EMAIL ${e.step} -----8<-----`,
      ``,
      e.body,
      ``,
      `-----8<----- END EMAIL ${e.step} -----8<-----`,
      ``,
    ].join("\n");
  });

  return [
    `# Paste Sheet — ${seq.name}`,
    ``,
    `> **Auto-generated from:** \`${sourcePath}\``,
    `> **DO NOT EDIT.** Re-run \`node scripts/is-paste-helper.mjs\` after editing the source.`,
    ``,
    `## IS UI setup`,
    ``,
    `1. **Automations → New Sequence**`,
    `2. **Name:** \`${seq.name}\``,
    `3. **Trigger:** When tag \`${seq.trigger}\` is added`,
    `4. **Then add ${total} email(s) below in order.** Set the delay per the header on each.`,
    `5. **Save and Activate** when the last email is in.`,
    ``,
    `When done, mark this sequence done in your tracker.`,
    ``,
    `---`,
    ``,
    ...sections,
  ].join("\n");
}

async function main() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

  let masterSections = [];
  let totalEmails = 0;
  const summary = [];

  for (const seq of PASTE_ORDER) {
    const sourcePath = seq.bundle
      ? join(BUNDLE_DIR, `${seq.name}.md`)
      : join(SEQ_DIR, `${seq.name}.md`);
    if (!existsSync(sourcePath)) {
      console.warn(`  SKIP ${seq.name} — source not found at ${sourcePath}`);
      summary.push({ name: seq.name, status: "MISSING", emails: 0 });
      continue;
    }
    const md = await readFile(sourcePath, "utf8");
    const emails = parseSequenceMd(md, seq.name);
    const rendered = renderPasteSheet(seq, emails, sourcePath.replace(REPO_ROOT, "").replace(/^[\/\\]/, ""));
    const outPath = join(OUT_DIR, `${seq.name}.md`);
    await writeFile(outPath, rendered);
    totalEmails += emails.length;
    summary.push({ name: seq.name, status: "OK", emails: emails.length, trigger: seq.trigger });
    masterSections.push(rendered);
    console.log(`  WROTE ${seq.name}.md  (${emails.length} emails)`);
  }

  // Master combined file
  const masterPath = join(OUT_DIR, "__ALL-SEQUENCES.md");
  const masterHeader = [
    `# All InfluencerSoft Sequences — Combined Paste Sheets`,
    ``,
    `> **Auto-generated.** Re-run \`node scripts/is-paste-helper.mjs\` to refresh.`,
    `> Paste these into IS UI in the order listed.`,
    ``,
    `## Order + progress`,
    ``,
    `| # | Sequence | Trigger tag | Emails | Status |`,
    `|---|----------|-------------|--------|--------|`,
    ...summary.map(
      (s, i) =>
        `| ${i + 1} | \`${s.name}\` | ${s.trigger ? `\`${s.trigger}\`` : "—"} | ${s.emails} | ${s.status === "OK" ? "☐ to-paste" : `⚠️ ${s.status}`} |`
    ),
    ``,
    `**Total emails to paste: ${totalEmails}**`,
    ``,
    `---`,
    ``,
  ].join("\n");
  await writeFile(masterPath, masterHeader + masterSections.join("\n\n---\n\n"));
  console.log(`\n  WROTE __ALL-SEQUENCES.md  (${totalEmails} emails across ${summary.filter((s) => s.status === "OK").length} sequences)`);
  console.log(`\nOutput dir: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
