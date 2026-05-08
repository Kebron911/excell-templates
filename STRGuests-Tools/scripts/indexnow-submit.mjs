#!/usr/bin/env node
/**
 * Post-deploy IndexNow submission for strguests.tools.
 *
 * IndexNow is a free protocol: one POST and Bing, Yandex, Seznam, Naver
 * all get notified. (Google does not participate.) See indexnow.org.
 *
 * Verification flow:
 * 1. We host a file at https://strguests.tools/<KEY>.txt whose CONTENTS
 *    equal <KEY>. The deploy ships public/<KEY>.txt for this.
 * 2. We POST a JSON body listing URLs to api.indexnow.org/indexnow.
 *    The endpoint fetches the verification file once per host before
 *    accepting submissions.
 *
 * URL list comes from the live sitemap so this script doesn't need to
 * know anything about routes.
 */

const HOST = 'strguests.tools';
const KEY = 'e66d6981f4c04ccebcfd238023e6faa7';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap-0.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function main() {
  const sitemap = await fetch(SITEMAP);
  if (!sitemap.ok) {
    throw new Error(`Sitemap fetch failed: ${sitemap.status} ${sitemap.statusText}`);
  }
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (urls.length === 0) {
    console.error('No URLs found in sitemap — aborting.');
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // IndexNow uses HTTP status alone:
  //   200 OK            — accepted
  //   202 Accepted      — accepted, will be processed
  //   400 Bad Request   — malformed
  //   403 Forbidden     — key didn't match the file at keyLocation
  //   422 Unprocessable — URL not on the host
  //   429 Too Many      — slow down
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);

  if (res.status >= 400) {
    const text = await res.text().catch(() => '');
    console.error('Body:', text);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('IndexNow submission failed:', err);
  process.exit(1);
});
