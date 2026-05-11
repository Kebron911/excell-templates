import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// tools/empire-console/src/lib/paths.ts → repo root is 4 levels up
const here = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(here, '..', '..', '..', '..');

export const paths = {
  root: REPO_ROOT,
  ops: resolve(REPO_ROOT, 'ops'),
  templates: resolve(REPO_ROOT, 'templates'),
  progress: resolve(REPO_ROOT, 'PROGRESS.md'),
  alertsLog: resolve(REPO_ROOT, 'ops', 'alerts.ndjson'),
  vendorInventory: resolve(REPO_ROOT, 'ops', 'vendor-inventory.yaml'),
  calendar: resolve(REPO_ROOT, 'ops', 'calendar.yaml'),
  infrastructure: resolve(REPO_ROOT, 'ops', 'infrastructure.yaml'),
  backlinks: resolve(REPO_ROOT, 'ops', 'backlinks-pipeline.yaml'),
  influencers: resolve(REPO_ROOT, 'ops', 'influencers-pipeline.yaml'),
  press: resolve(REPO_ROOT, 'ops', 'press-pipeline.yaml'),
  newsletter: resolve(REPO_ROOT, 'ops', 'newsletter-pipeline.yaml'),
  atlas: resolve(REPO_ROOT, 'ops', 'atlas.yaml'),
  atlasSites: resolve(REPO_ROOT, 'ops', 'atlas', 'sites'),
  inbox: resolve(REPO_ROOT, 'ops', 'inbox.ndjson'),
  targets: resolve(REPO_ROOT, 'ops', 'targets.yaml'),
  customerVoice: resolve(REPO_ROOT, 'ops', 'customer-voice.ndjson'),
  risks: resolve(REPO_ROOT, 'ops', 'risks.yaml'),
  decisions: resolve(REPO_ROOT, 'ops', 'decisions.ndjson'),
  roadmap: resolve(REPO_ROOT, 'ops', 'roadmap.yaml'),
  ownerCompensation: resolve(REPO_ROOT, 'ops', 'owner-compensation.yaml'),
  timeLog: resolve(REPO_ROOT, 'ops', 'time-log.ndjson'),
  competitors: resolve(REPO_ROOT, 'ops', 'competitors.yaml'),
  onboarding: resolve(REPO_ROOT, 'ops', 'onboarding-flow.yaml'),
  network: resolve(REPO_ROOT, 'ops', 'network.yaml'),
  nearMisses: resolve(REPO_ROOT, 'ops', 'near-misses.ndjson'),
  consoleActions: resolve(REPO_ROOT, 'ops', 'console-actions.ndjson'),
  cache: {
    money:    resolve(REPO_ROOT, 'ops', 'cache', 'money.json'),
    traffic:  resolve(REPO_ROOT, 'ops', 'cache', 'traffic.json'),
    seo:      resolve(REPO_ROOT, 'ops', 'cache', 'seo.json'),
    contacts: resolve(REPO_ROOT, 'ops', 'cache', 'contacts.json'),
    syncLog:  resolve(REPO_ROOT, 'ops', 'cache', 'sync-log.json'),
  },
  assets: {
    leadMagnets:    resolve(REPO_ROOT, 'ops', 'assets', 'lead-magnets.yaml'),
    tools:          resolve(REPO_ROOT, 'ops', 'assets', 'tools.yaml'),
    documents:      resolve(REPO_ROOT, 'ops', 'assets', 'documents.yaml'),
    brandAssets:    resolve(REPO_ROOT, 'ops', 'assets', 'brand-assets.yaml'),
    emailTemplates: resolve(REPO_ROOT, 'ops', 'assets', 'email-templates.yaml'),
    pages:          resolve(REPO_ROOT, 'ops', 'assets', 'pages.yaml'),
  },
  runbookGlobs: [
    resolve(REPO_ROOT, 'ops', 'runbooks'),
    resolve(REPO_ROOT, 'docs', 'runbooks'),
  ],
  sites: [
    { id: 'strguests', name: 'strguests.tools', dir: resolve(REPO_ROOT, 'STRGuests-Tools') },
    { id: 'strhost', name: 'strhost.tools', dir: resolve(REPO_ROOT, 'STRHost-Tools') },
    { id: 'strops', name: 'strops.tools', dir: resolve(REPO_ROOT, 'STROps-Tools') },
    { id: 'strbuyers', name: 'strbuyers.tools', dir: resolve(REPO_ROOT, 'STRBuyers-Tools') },
  ] as const,
};
