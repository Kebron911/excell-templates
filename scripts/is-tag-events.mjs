#!/usr/bin/env node
// is-tag-events.mjs
// Maps Stripe webhook event types to IS trigger tags and applies them.
// Designed to be called from n8n: pass --event <type> and --email <addr>.
//
// Stripe → IS tag map (mirrors infrastructure/influencersoft/tag-dictionary.md §1):
//
//   checkout.session.completed  → customer:etsy ............... wrong — keep stripe customers on source:thestrledger
//                                 source:thestrledger
//   checkout.session.expired    → checkout-abandoned
//   charge.refunded             → refund-filed, refund-completed
//
// Usage:
//   node scripts/is-tag-events.mjs --event checkout.session.expired --email buyer@example.com
//   node scripts/is-tag-events.mjs --event charge.refunded --email buyer@example.com --refund-date 2026-05-13
//
// Or JSON via stdin (n8n pattern):
//   echo '{"event":"charge.refunded","email":"x@y.com"}' | node scripts/is-tag-events.mjs --stdin

import { addUpdateLead } from "./lib/influencersoft.mjs";

const EVENT_MAP = {
  "checkout.session.completed": {
    add_tags: ["source:thestrledger"],
    // NOTE: do not auto-add `customer:etsy` here — that tag is reserved for actual Etsy orders.
    // Stripe-completed checkouts get their own product-specific tags from the n8n workflow.
  },
  "checkout.session.expired": {
    add_tags: ["checkout-abandoned"],
  },
  "charge.refunded": {
    add_tags: ["refund-filed"],
    // Once the refund is finalized, n8n should make a second call with `refund-completed`.
  },
  "customer.subscription.deleted": {
    add_tags: ["churned"],
  },
};

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--stdin": out.stdin = true; break;
      case "--event": out.event = next(); break;
      case "--email": out.email = next(); break;
      case "--refund-date": out.refund_date = next(); break;
      case "--dry-run": out.dryRun = true; break;
      case "--extra-tags": out.extra_tags = next().split(",").map((t) => t.trim()).filter(Boolean); break;
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
  if (!input.event) throw new Error("event is required");
  const mapping = EVENT_MAP[input.event];
  if (!mapping) throw new Error(`No tag mapping for event "${input.event}". Add it to EVENT_MAP.`);
  const tags = [...mapping.add_tags];
  if (input.extra_tags?.length) tags.push(...input.extra_tags);

  const payload = { lead_email: input.email, add_tags: tags.join(",") };
  if (input.event === "charge.refunded" && input.refund_date) {
    payload.refund_date = input.refund_date; // custom field
  }
  return payload;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage: node scripts/is-tag-events.mjs --event <stripe-event-type> --email <email>`);
    console.log(`Mapped events: ${Object.keys(EVENT_MAP).join(", ")}`);
    return;
  }
  const input = args.stdin ? await readStdin() : args;
  const payload = buildPayload(input);
  if (args.dryRun) {
    console.log(JSON.stringify({ ...payload, rpsKey: "[REDACTED]" }, null, 2));
    return;
  }
  const res = await addUpdateLead(payload);
  console.log(JSON.stringify({ ok: true, event: input.event, email: input.email, tags_applied: payload.add_tags, raw: res.result }, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
});
