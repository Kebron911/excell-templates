# strhost.tools

Free calculators for short-term rental hosts. Astro static site, deployed to Hostinger.

## Dev

```
pnpm install
pnpm dev
```

## Build

```
pnpm build
```

Outputs to `dist/`.

## Test

```
pnpm test       # vitest
pnpm e2e        # playwright
```

## Deploy

Pushing to `main` triggers FTP deploy to Hostinger via GitHub Actions.
