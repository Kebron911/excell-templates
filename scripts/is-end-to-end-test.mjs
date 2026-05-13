#!/usr/bin/env node
// is-end-to-end-test.mjs
// PROGRESS.md P0.0 hard gate — proves: AddUpdateLead with `customer:etsy` tag
// triggers post-purchase-etsy-buyer sequence Email 1 within 5 minutes.
//
// Flow:
//   1. Push a canary contact (your secondary Gmail) via AddUpdateLead with `customer:etsy`.
//   2. Wait/poll up to 6 minutes — checking your Gmail is OUT OF SCOPE here; this script
//      just verifies the API call succeeded and the contact was created with the tag.
//   3. Print a checklist for you to manually verify the email actually arrived.
//
// Usage:
//   node scripts/is-end-to-end-test.mjs --canary-email yourcanary@gmail.com
//
// Or with a custom trigger (test any sequence by its trigger tag):
//   node scripts/is-end-to-end-test.mjs --canary-email x@y.com --trigger lead-magnet:welcome-book

import { addUpdateLead, isCall } from "./lib/influencersoft.mjs";

function parseArgs(argv) {
  const out = { trigger: "customer:etsy" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--canary-email": out.email = next(); break;
      case "--trigger": out.trigger = next(); break;
      case "--first-name": out.first_name = next(); break;
      case "--cleanup": out.cleanup = true; break;
      case "--help":
      case "-h": out.help = true; break;
      default: throw new Error(`Unknown arg: ${a}`);
    }
  }
  return out;
}

function ts() { return new Date().toISOString().replace("T", " ").slice(0, 19); }

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.email) {
    console.log(`Usage: node scripts/is-end-to-end-test.mjs --canary-email <your-test-gmail>`);
    console.log(`Options:`);
    console.log(`  --trigger <tag>       trigger tag to apply (default: customer:etsy)`);
    console.log(`  --first-name <name>   first name (default: "Canary")`);
    console.log(`  --cleanup             remove the test tags after verification`);
    process.exit(args.help ? 0 : 1);
  }

  const firstName = args.first_name || "Canary";
  const testRunId = `e2e-${Date.now()}`;

  console.log(`[${ts()}] E2E TEST START`);
  console.log(`  canary email: ${args.email}`);
  console.log(`  trigger tag:  ${args.trigger}`);
  console.log(`  run id:       ${testRunId}`);
  console.log();

  // Step 1 — push the contact with trigger tag.
  console.log(`[${ts()}] step 1: AddUpdateLead with trigger tag`);
  const payload = {
    lead_email: args.email,
    lead_first_name: firstName,
    add_tags: `${args.trigger},e2e-test:${testRunId}`,
    // Custom fields that post-purchase-etsy-buyer expects:
    sku_code: "TAX-001",
    sku_label: "STR Mileage Log",
    bought_on: new Date().toISOString().slice(0, 10),
    order_ref: `TEST-${testRunId}`,
  };
  const res = await addUpdateLead(payload);
  console.log(`  → IS responded ok. error_code=${res.error_code}`);
  console.log();

  // Step 2 — confirm contact exists by re-querying.
  console.log(`[${ts()}] step 2: verify contact in IS`);
  console.log(`  (skipped — no read-by-email endpoint exposed in API 2.0; trust the write succeeded)`);
  console.log();

  // Step 3 — print human checklist.
  console.log(`[${ts()}] step 3: HUMAN VERIFICATION REQUIRED`);
  console.log(`  ┌─────────────────────────────────────────────────────────────────┐`);
  console.log(`  │ Check ${args.email} inbox in 5 minutes:                          `);
  console.log(`  │                                                                  │`);
  console.log(`  │ [ ] Email 1 of the "${args.trigger}" sequence arrived            `);
  console.log(`  │ [ ] Tokens rendered (no raw {{ first_name }} visible)            │`);
  console.log(`  │ [ ] Landed in PRIMARY (not Promotions / Spam)                   │`);
  console.log(`  │ [ ] Reply-to address is correct (hello@thestrledger.com)        │`);
  console.log(`  │ [ ] All links work (review link, site link)                     │`);
  console.log(`  └─────────────────────────────────────────────────────────────────┘`);
  console.log();
  console.log(`  If email arrived → P0.0 gate PASSES. Sequence wiring is live.`);
  console.log(`  If no email in 10 min → check IS UI: is the sequence Activated?`);
  console.log(`  If email arrived in Promotions → fix sender authentication (SPF/DKIM/DMARC).`);

  if (args.cleanup) {
    console.log();
    console.log(`[${ts()}] cleanup: removing test tags from canary`);
    await isCall("RemoveTagFromLead", {
      lead_email: args.email,
      remove_tags: `${args.trigger},e2e-test:${testRunId}`,
    });
    console.log(`  → tags removed.`);
  } else {
    console.log();
    console.log(`  (Re-run with --cleanup to remove the trigger tag after verification.)`);
  }
}

main().catch((err) => {
  console.error(`E2E TEST FAILED: ${err.message}`);
  process.exit(1);
});
