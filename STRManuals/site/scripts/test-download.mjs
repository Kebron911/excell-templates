// End-to-end smoke test of /api/download.
// Generates a valid HMAC token, fetches the endpoint, verifies a watermarked PDF returns.
// Run: node scripts/test-download.mjs   (dev server must be running on :4321)

import crypto from 'node:crypto';
import { config } from 'dotenv';
config();

const SITE = process.env.SITE || 'http://localhost:4321';
const SECRET = process.env.DOWNLOAD_HMAC_SECRET;
if (!SECRET) {
  console.error('DOWNLOAD_HMAC_SECRET missing from .env');
  process.exit(1);
}

function sign({ email, orderId, sku, expiry }) {
  const payload = `${email}|${orderId}|${sku}|${expiry}`;
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

async function testCase(name, params, expectedStatus, expectedContentType) {
  const url = new URL(`${SITE}/api/download`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  const ct = res.headers.get('content-type') || '';
  const okStatus = res.status === expectedStatus;
  const okType = !expectedContentType || ct.includes(expectedContentType);
  const pass = okStatus && okType;

  console.log(`${pass ? '✓' : '✗'} ${name}`);
  console.log(`    status: ${res.status} (expected ${expectedStatus})`);
  if (expectedContentType) {
    console.log(`    type:   ${ct} (expected ${expectedContentType})`);
  }
  if (!pass) {
    const body = await res.text();
    console.log(`    body:   ${body.slice(0, 120)}`);
  }
  return pass;
}

async function main() {
  console.log(`Testing /api/download against ${SITE}\n`);
  const results = [];

  const validExpiry = Math.floor(Date.now() / 1000) + 3600;
  const expiredExpiry = Math.floor(Date.now() / 1000) - 60;

  // 1. Valid token, valid SKU → PDF stream
  results.push(await testCase('Valid token returns watermarked PDF', {
    email: 'buyer@example.com',
    order: 'cs_test_abc123',
    sku: 'str-tax-loophole-playbook',
    exp: validExpiry,
    sig: sign({ email: 'buyer@example.com', orderId: 'cs_test_abc123', sku: 'str-tax-loophole-playbook', expiry: validExpiry }),
  }, 200, 'application/pdf'));

  // 2. Valid token, expired
  results.push(await testCase('Expired token returns 410', {
    email: 'buyer@example.com',
    order: 'cs_test_abc123',
    sku: 'str-tax-loophole-playbook',
    exp: expiredExpiry,
    sig: sign({ email: 'buyer@example.com', orderId: 'cs_test_abc123', sku: 'str-tax-loophole-playbook', expiry: expiredExpiry }),
  }, 410));

  // 3. Bad signature
  results.push(await testCase('Bad signature returns 403', {
    email: 'buyer@example.com',
    order: 'cs_test_abc123',
    sku: 'str-tax-loophole-playbook',
    exp: validExpiry,
    sig: 'deadbeef',
  }, 403));

  // 4. Tampered email
  const goodSig = sign({ email: 'buyer@example.com', orderId: 'cs_test_abc123', sku: 'str-tax-loophole-playbook', expiry: validExpiry });
  results.push(await testCase('Tampered email returns 403', {
    email: 'attacker@example.com',
    order: 'cs_test_abc123',
    sku: 'str-tax-loophole-playbook',
    exp: validExpiry,
    sig: goodSig,
  }, 403));

  // 5. Missing params
  results.push(await testCase('Missing params returns 400', {
    email: 'buyer@example.com',
  }, 400));

  // 6. Unknown SKU with valid sig (sig is over the unknown sku, so it'll verify, but lookup fails)
  const unknownSig = sign({ email: 'buyer@example.com', orderId: 'x', sku: 'nonexistent-sku', expiry: validExpiry });
  results.push(await testCase('Unknown SKU returns 404', {
    email: 'buyer@example.com',
    order: 'x',
    sku: 'nonexistent-sku',
    exp: validExpiry,
    sig: unknownSig,
  }, 404));

  // 7. Free PDF
  results.push(await testCase('Free PDF returns 200', {
    free: 'tax-loophole-explainer',
  }, 200, 'application/pdf'));

  // 8. Unknown free
  results.push(await testCase('Unknown free PDF returns 404', {
    free: 'nope',
  }, 404));

  // 9. Bundle returns a zip with 5 entries
  const bundleSig = sign({ email: 'buyer@example.com', orderId: 'cs_test_bundle', sku: 'str-manuals-bundle', expiry: validExpiry });
  results.push(await testCase('Bundle returns valid zip', {
    email: 'buyer@example.com',
    order: 'cs_test_bundle',
    sku: 'str-manuals-bundle',
    exp: validExpiry,
    sig: bundleSig,
  }, 200, 'application/zip'));

  // Verify the zip contains 5 PDFs
  const bundleUrl = new URL(`${SITE}/api/download`);
  bundleUrl.searchParams.set('email', 'buyer@example.com');
  bundleUrl.searchParams.set('order', 'cs_test_bundle');
  bundleUrl.searchParams.set('sku', 'str-manuals-bundle');
  bundleUrl.searchParams.set('exp', String(validExpiry));
  bundleUrl.searchParams.set('sig', bundleSig);
  const bundleRes = await fetch(bundleUrl.toString());
  const bundleBuf = Buffer.from(await bundleRes.arrayBuffer());
  // ZIP local file headers start with the bytes 50 4B 03 04 ("PK\3\4")
  const isZip = bundleBuf[0] === 0x50 && bundleBuf[1] === 0x4B;
  // Count "PK\3\4" occurrences = number of files in the zip
  let pdfCount = 0;
  for (let i = 0; i < bundleBuf.length - 4; i++) {
    if (bundleBuf[i] === 0x50 && bundleBuf[i + 1] === 0x4B && bundleBuf[i + 2] === 0x03 && bundleBuf[i + 3] === 0x04) {
      pdfCount++;
    }
  }
  const bundlePass = isZip && pdfCount === 5;
  console.log(`${bundlePass ? '✓' : '✗'} Bundle zip contains 5 entries`);
  console.log(`    is ZIP magic:  ${isZip}`);
  console.log(`    file count:    ${pdfCount} (expected 5)`);
  console.log(`    bytes:         ${bundleBuf.length}`);
  results.push(bundlePass);

  const passed = results.filter(Boolean).length;
  console.log(`\n${passed}/${results.length} tests passed`);
  process.exit(passed === results.length ? 0 : 1);
}

main();
