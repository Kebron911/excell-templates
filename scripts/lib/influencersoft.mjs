// InfluencerSoft API 2.0 client — thin wrapper over fetch.
// Auth: rpsKey in POST body, application/x-www-form-urlencoded.
// Reads INFLUENCERSOFT_API_KEY + IS_TENANT from environment.
// Never logs full POST bodies (key leakage risk per ops/influencersoft-api-probe.md §5).

import { setTimeout as sleep } from "node:timers/promises";

const DEFAULT_TENANT = "kebron";
const RATE_LIMIT_MS = 1100; // ~0.9 req/s — conservative per probe doc (no documented limit)

let lastCallAt = 0;

export function getBaseUrl() {
  const tenant = process.env.IS_TENANT || DEFAULT_TENANT;
  return `https://${tenant}.influencersoft.com/api`;
}

export function getApiKey() {
  const key = process.env.INFLUENCERSOFT_API_KEY;
  if (!key) {
    throw new Error(
      "INFLUENCERSOFT_API_KEY not set. Add it to Excel-Templates/.env (root, not worktree)."
    );
  }
  if (key.length < 16) {
    throw new Error(`INFLUENCERSOFT_API_KEY looks too short (${key.length} chars).`);
  }
  return key;
}

async function throttle() {
  const elapsed = Date.now() - lastCallAt;
  if (elapsed < RATE_LIMIT_MS) await sleep(RATE_LIMIT_MS - elapsed);
  lastCallAt = Date.now();
}

/**
 * Call an IS API 2.0 method.
 * @param {string} method - PascalCase method name, e.g. "GetAllGroups"
 * @param {Record<string,string>} params - extra form fields (rpsKey added automatically)
 * @returns {Promise<{error_code:number,error_text:string,result:any,hash?:string}>}
 */
export async function isCall(method, params = {}) {
  await throttle();
  const body = new URLSearchParams({ rpsKey: getApiKey(), ...params });
  const url = `${getBaseUrl()}/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`IS ${method} HTTP ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();
  if (json.error_code !== 0) {
    throw new Error(`IS ${method} error ${json.error_code}: ${json.error_text}`);
  }
  return json;
}

// ── High-level helpers ─────────────────────────────────────────────────────

export const getAllGroups = () => isCall("GetAllGroups");
export const getGoods = () => isCall("GetGoods");
export const getCoupons = () => isCall("GetCoupons");

/**
 * Idempotent on email. Creates or updates a contact.
 * Use this as the primary tagging tool — one call can set tags + lists at once.
 */
export const addUpdateLead = (fields) => isCall("AddUpdateLead", fields);

/**
 * Add tags to an existing contact (by email). Tags auto-create on first use.
 * @param {string} email
 * @param {string|string[]} tags - tag or array of tags
 */
export function addTagToLead(email, tags) {
  const tagCsv = Array.isArray(tags) ? tags.join(",") : tags;
  return isCall("AddTagToLead", { lead_email: email, add_tags: tagCsv });
}

export function removeTagFromLead(email, tags) {
  const tagCsv = Array.isArray(tags) ? tags.join(",") : tags;
  return isCall("RemoveTagFromLead", { lead_email: email, remove_tags: tagCsv });
}
