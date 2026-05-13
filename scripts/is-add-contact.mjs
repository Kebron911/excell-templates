#!/usr/bin/env node
// is-add-contact.mjs
// Thin CLI wrapper over AddUpdateLead. Used by n8n + manual runs to push
// every Etsy buyer / Stripe customer / form-submit into IS with the correct
// trigger tag (which fires the sequence bound to that tag in the IS UI).
//
// Idempotent on lead_email — re-running with same email updates the contact.
//
// Usage:
//   node scripts/is-add-contact.mjs \
//     --email buyer@example.com \
//     --first-name Jane \
//     --last-name Doe \
//     --tags customer:etsy,source:etsy,product:tax-001-mileage-log \
//     --custom-field sku_code=TAX-001 \
//     --custom-field sku_label="STR Mileage Log" \
//     --custom-field bought_on=2026-05-13 \
//     --custom-field order_ref=3148293
//
// Or JSON via stdin (n8n HTTP node pattern):
//   echo '{"email":"x@y.com","first_name":"Jane","tags":["customer:etsy"]}' | node scripts/is-add-contact.mjs --stdin

import { addUpdateLead } from "./lib/influencersoft.mjs";

function parseArgs(argv) {
  const out = { tags: [], customFields: {}, stdin: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--stdin": out.stdin = true; break;
      case "--email": out.email = next(); break;
      case "--first-name": out.first_name = next(); break;
      case "--last-name": out.last_name = next(); break;
      case "--phone": out.phone = next(); break;
      case "--tags": out.tags = next().split(",").map((t) => t.trim()).filter(Boolean); break;
      case "--remove-tags": out.remove_tags = next().split(",").map((t) => t.trim()).filter(Boolean); break;
      case "--add-to-lists": out.add_to_lists = next(); break;
      case "--remove-from-lists": out.remove_from_lists = next(); break;
      case "--custom-field": {
        const kv = next();
        const eq = kv.indexOf("=");
        if (eq < 0) throw new Error(`--custom-field needs key=value, got "${kv}"`);
        out.customFields[kv.slice(0, eq)] = kv.slice(eq + 1);
        break;
      }
      case "--dry-run": out.dryRun = true; break;
      case "--help":
      case "-h": out.help = true; break;
      default: throw new Error(`Unknown arg: ${a}`);
    }
  }
  return out;
}

async function readStdin() {
  let buf = "";
  for await (const chunk of process.stdin) buf += chunk;
  return JSON.parse(buf);
}

function buildPayload(input) {
  if (!input.email) throw new Error("email is required");
  const payload = { lead_email: input.email };
  if (input.first_name) payload.lead_first_name = input.first_name;
  if (input.last_name) payload.lead_last_name = input.last_name;
  if (input.phone) payload.lead_phone = input.phone;
  if (input.tags?.length) payload.add_tags = input.tags.join(",");
  if (input.remove_tags?.length) payload.remove_tags = input.remove_tags.join(",");
  if (input.add_to_lists) payload.add_to_lists = input.add_to_lists;
  if (input.remove_from_lists) payload.remove_from_lists = input.remove_from_lists;
  // Custom fields are sent as top-level form fields keyed by field name.
  if (input.customFields) {
    for (const [k, v] of Object.entries(input.customFields)) payload[k] = v;
  } else if (input.custom_fields) {
    for (const [k, v] of Object.entries(input.custom_fields)) payload[k] = v;
  }
  return payload;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node scripts/is-add-contact.mjs --email <email> [--first-name <n>] [--tags a,b,c] [--custom-field k=v]...`);
    return;
  }
  const input = args.stdin ? await readStdin() : args;
  const payload = buildPayload(input);
  if (args.dryRun) {
    const safe = { ...payload, rpsKey: "[REDACTED]" };
    console.log(JSON.stringify(safe, null, 2));
    return;
  }
  const res = await addUpdateLead(payload);
  console.log(JSON.stringify({ ok: true, email: payload.lead_email, applied_tags: payload.add_tags ?? null, raw: res.result }, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
