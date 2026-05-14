#!/usr/bin/env node
// is-paste-helper.mjs
// Parses every email-sequence .md draft into a compact paste sheet
// formatted EXACTLY for InfluencerSoft's UI:
//   - Liquid tokens → IS tokens ({{ first_name }} → {$name}, custom → {$leadExfield[N]})
//   - Per-email IS delay setting computed from cumulative-day timing
//   - Liquid conditionals + unknown tokens flagged as TODOs at the top of each email
//
// Output: ops/manual work/influencersoft-paste-sheets/<sequence>.md
// Plus a single combined master: __ALL-SEQUENCES.md
//
// Custom field index map mirrors infrastructure/influencersoft/custom-fields.yaml
// (kept here too so the script is self-contained — yaml is the human SoT).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
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

// Token map: Liquid name → IS merge tag.
// SoT: infrastructure/influencersoft/custom-fields.yaml
const TOKEN_MAP = {
  // Built-in IS field
  first_name: "{$name}",
  // Custom fields (positional index — DO NOT REORDER without re-renumbering all emails)
  sku_code: "{$leadExfield[1]}",
  sku_label: "{$leadExfield[2]}",
  bought_on: "{$leadExfield[3]}",
  order_ref: "{$leadExfield[4]}",
  xsell_name: "{$leadExfield[5]}",
  xsell_url: "{$leadExfield[6]}",
  pack_name: "{$leadExfield[7]}",
};

// Matches "## Email 1 — Day 7 — The ask" (em-dash, en-dash, or hyphen separators)
const DASH = "[\\u2014\\u2013\\-]";
const EMAIL_HEADER_RX = new RegExp(
  `^##\\s+Email\\s+(\\d+)\\s+${DASH}\\s+(.+?)\\s+${DASH}\\s+(.+)$`
);

const LIQUID_TOKEN_RX = /\{\{\s*([^}]+?)\s*\}\}/g;
const LIQUID_CONDITIONAL_RX = /\{%[^%]*%\}/;

function parseSequenceMd(md) {
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
    if (sm) { cur.subject = sm[1].trim(); continue; }
    const pm = line.match(/^\*\*Preheader:\*\*\s*(.+)$/);
    if (pm) { cur.preheader = pm[1].trim(); continue; }
    if (line.trim() === "```") { inBody = !inBody; continue; }
    if (inBody) bodyLines.push(line);
  }
  if (cur) {
    cur.body = bodyLines.join("\n").trim();
    emails.push(cur);
  }
  return emails;
}

// Convert a timing string like "Day 7" / "1 hour after abandonment" / "24 hours later"
// into absolute minutes from the trigger fire.
function parseTimingToAbsoluteMinutes(timingStr) {
  const s = timingStr.toLowerCase();
  // Day N
  const dayMatch = s.match(/day\s+(\d+)/);
  if (dayMatch) return parseInt(dayMatch[1]) * 1440;
  // X hour(s)
  const hourMatch = s.match(/(\d+)\s*hour/);
  if (hourMatch) return parseInt(hourMatch[1]) * 60;
  // X minute(s)
  const minMatch = s.match(/(\d+)\s*min/);
  if (minMatch) return parseInt(minMatch[1]);
  // "immediately" / "within 5 minutes"
  if (/immediate|within\s+5\s+minutes/.test(s)) return 0;
  return null;
}

function minutesToDhm(min) {
  const d = Math.floor(min / 1440);
  const h = Math.floor((min % 1440) / 60);
  const m = min % 60;
  return { d, h, m };
}

function renderIsDelay(delta) {
  if (delta == null) return "_⚠️ TODO — could not auto-parse timing; set manually_";
  if (delta.d === 0 && delta.h === 0 && delta.m === 0) {
    return "**Immediately after previous step** (0 d 0 hrs 0 min)";
  }
  return `**after the previous one with a delay:** \`${delta.d} d ${delta.h} hrs ${delta.m} min\``;
}

// Convert Liquid tokens to IS tokens. Returns { converted, unknown[] }.
function transformTokens(text) {
  if (!text) return { converted: text || "", unknown: [], hasConditionals: false };
  const hasConditionals = LIQUID_CONDITIONAL_RX.test(text);
  const unknown = new Set();

  const converted = text.replace(LIQUID_TOKEN_RX, (match, inner) => {
    // Strip Liquid filters: "first_name | default: 'Hey'" → "first_name"
    let tokenName = inner.split("|")[0].trim();

    // Detect math/expressions like "97 minus bundle_credit_amount"
    if (/\s/.test(tokenName)) {
      unknown.add(tokenName);
      return `[TODO ${match}]`;
    }

    if (TOKEN_MAP[tokenName]) {
      return TOKEN_MAP[tokenName];
    }
    unknown.add(tokenName);
    return match; // leave as-is for human review
  });

  return { converted, unknown: [...unknown], hasConditionals };
}

function renderEmailSection(seq, e, total, prevAbsMin) {
  const subj = transformTokens(e.subject);
  const pre = transformTokens(e.preheader);
  const body = transformTokens(e.body);

  const allUnknown = [...new Set([...subj.unknown, ...pre.unknown, ...body.unknown])];
  const hasCond = subj.hasConditionals || pre.hasConditionals || body.hasConditionals;

  const currAbs = parseTimingToAbsoluteMinutes(e.timing);
  let delayDhm = null;
  if (currAbs != null) {
    const diff = Math.max(0, currAbs - (prevAbsMin ?? 0));
    delayDhm = minutesToDhm(diff);
  }

  const warnings = [];
  if (hasCond) {
    warnings.push(
      "> ⚠️ **TODO — IS does NOT support Liquid conditionals (`{% if %}`).** This email has conditional logic that won't render. Either rewrite as single-version copy OR split into per-SKU branches using Filter Condition nodes on the canvas."
    );
  }
  if (allUnknown.length > 0) {
    warnings.push(
      `> ⚠️ **TODO — Tokens NOT in IS field map:** ${allUnknown
        .map((t) => `\`${t}\``)
        .join(", ")}. Either hardcode the value, add a new custom field, or inject via n8n at send time. See \`infrastructure/influencersoft/custom-fields.yaml\` § non_is_tokens.`
    );
  }

  const blocks = [
    `### Email ${e.step} of ${total} — ${e.title}`,
    ``,
    ...warnings,
    warnings.length ? `` : null,
    `**Block name (rename to):** \`E${e.step} - ${e.timing} - ${e.title}\``,
    ``,
    `**IS delay setting** (Perform this step → after the previous one with a delay):`,
    `- ${renderIsDelay(delayDhm)}`,
    ``,
    `**Subject (paste):**`,
    ``,
    `~~~`,
    subj.converted,
    `~~~`,
    ``,
    `**Preheader (paste):**`,
    ``,
    `~~~`,
    pre.converted,
    `~~~`,
    ``,
    `**Body (paste between fences):**`,
    ``,
    `-----8<----- BEGIN ${seq.name} EMAIL ${e.step} -----8<-----`,
    ``,
    body.converted,
    ``,
    `-----8<----- END EMAIL ${e.step} -----8<-----`,
    ``,
  ].filter((l) => l !== null);

  return { rendered: blocks.join("\n"), absMin: currAbs, hasIssues: hasCond || allUnknown.length > 0 };
}

function renderPasteSheet(seq, emails, sourcePath) {
  let prevAbsMin = null;
  let issuesCount = 0;
  const sections = emails.map((e) => {
    const r = renderEmailSection(seq, e, emails.length, prevAbsMin);
    if (r.absMin != null) prevAbsMin = r.absMin;
    if (r.hasIssues) issuesCount++;
    return r.rendered;
  });

  const issueBanner =
    issuesCount > 0
      ? `\n> ⚠️ **${issuesCount} of ${emails.length} email(s) need manual rewrite before pasting.** See per-email TODOs below.\n`
      : `\n> ✅ All ${emails.length} emails ready to paste.\n`;

  return [
    `# Paste Sheet — ${seq.name}`,
    ``,
    `> **Auto-generated from:** \`${sourcePath}\``,
    `> **DO NOT EDIT.** Re-run \`node scripts/is-paste-helper.mjs\` after editing the source.`,
    `> **Token format:** IS \`{$xxx}\` (NOT Liquid \`{{ xxx }}\`). Built-ins → \`{$name}\`. Custom fields → \`{$leadExfield[N]}\`.`,
    issueBanner,
    `## IS UI setup`,
    ``,
    `1. **Processes → New process** (or open existing)`,
    `2. **Process name:** \`${seq.name}\``,
    `3. **Trigger node:** \`Tag applied\` → tag = \`${seq.trigger}\``,
    `   - Toggle ON: "Perform only once for an object"`,
    `   - Entry filter: \`Tags | Doesn't match | do-not-email\` (+ \`refund-filed\`, \`unsubscribed\` as additional rows)`,
    `4. **Add ${emails.length} Send email node(s)** below in order. Per-email config follows.`,
    `5. **End of process** node at the end.`,
    `6. **Save and Activate.**`,
    ``,
    `Repeat for kill-switch: separate small Process triggered by \`Tag applied = do-not-email\` → Remove from list \`STR Ledger — Contacts\` → End of process. (Built once, applies to every sequence.)`,
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
      summary.push({ name: seq.name, status: "MISSING", emails: 0, trigger: seq.trigger });
      continue;
    }
    const md = await readFile(sourcePath, "utf8");
    const emails = parseSequenceMd(md);
    const rendered = renderPasteSheet(
      seq,
      emails,
      sourcePath.replace(REPO_ROOT, "").replace(/^[\/\\]/, "")
    );
    const outPath = join(OUT_DIR, `${seq.name}.md`);
    await writeFile(outPath, rendered);
    totalEmails += emails.length;
    summary.push({ name: seq.name, status: "OK", emails: emails.length, trigger: seq.trigger });
    masterSections.push(rendered);
    console.log(`  WROTE ${seq.name}.md  (${emails.length} emails)`);
  }

  const masterPath = join(OUT_DIR, "__ALL-SEQUENCES.md");
  const masterHeader = [
    `# All InfluencerSoft Sequences — Combined Paste Sheets`,
    ``,
    `> **Auto-generated.** Re-run \`node scripts/is-paste-helper.mjs\` to refresh.`,
    `> Paste these into IS in the order listed (Processes → New process per row).`,
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
  console.log(
    `\n  WROTE __ALL-SEQUENCES.md  (${totalEmails} emails across ${
      summary.filter((s) => s.status === "OK").length
    } sequences)`
  );
  console.log(`\nOutput dir: ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
