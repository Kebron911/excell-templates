// Type declarations for importing .astro components in test files.
// Astro components are compiled at runtime by @astrojs/compiler — tsc cannot analyze them.
// This provides a minimal type shape so snapshot.test.ts typechecks cleanly.
declare module '*.astro' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any;
  export default Component;
}
