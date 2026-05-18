#!/usr/bin/env node
import { loadCatalog } from '../loader.js';

function main(): void {
  try {
    const { catalog, warnings } = loadCatalog();
    console.log(`OK  ${catalog.sites.length} sites, ${catalog.tools.length} tools`);
    if (warnings.length > 0) {
      console.log(`WARN ${warnings.length} warning(s):`);
      for (const w of warnings) console.log(`     · ${w}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(`FAIL ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
