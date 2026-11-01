# Deployment Guide

This document contains deployment settings for the live Cloudflare Worker (https://reeeecipe.engg.app) and for Netlify as an alternative.

## Build Verification

The static generation was tested and verified:

```bash
pnpm install --frozen-lockfile && pnpm generate
```

Output directory: `.output/public` (`dist` is a symlink to it; Netlify's preset writes to `dist`)

## Cloudflare Worker Deployment

### Configuration File: `wrangler.jsonc`

The site is a Worker serving static assets on the sg208 account. `wrangler.jsonc` points at `.output/public` and sets `not_found_handling: 404-page`, so missing paths get the nearest `404.html` (`404.html`, `es/404.html`, `nl/404.html`).

```bash
pnpm run deploy   # builds, then runs wrangler deploy
```

`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` must be set in the environment.

## Netlify Deployment (alternative)

### Configuration File: `netlify.toml`

The configuration is already set up in `netlify.toml`:

```toml
[build]
  command = "pnpm install --frozen-lockfile && pnpm generate"
  publish = "dist"

[build.environment]
  NODE_VERSION = "24"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Note**: Nuxt automatically detects Netlify and uses the `netlify-static` preset, which outputs to `dist` instead of `.output/public`.

### Netlify Dashboard Settings

If you need to configure manually in the dashboard:

- **Build command**: `pnpm install --frozen-lockfile && pnpm generate`
- **Publish directory**: `dist` (Nuxt auto-detects Netlify and uses this directory)
- **Node version**: 24
- **Environment variables**: None required for basic setup

## Local Testing

Before deploying, test locally:

```bash
# Clean install
pnpm install

# Generate static files
pnpm generate

# Preview the build
pnpm preview
```

Verify the output directory exists:

```bash
ls -la .output/public
```

## Troubleshooting

### Build Fails with Dependency Errors

If you encounter dependency issues:

1. Remove `node_modules` and `package-lock.json`
2. Run `pnpm install` again
3. Check Node version matches (should be 24+)

### Missing Pages Return the Wrong 404

Every route is prerendered, so there is no single-page fallback. Unknown paths get a real 404 page in their language: `404.html`, `es/404.html` and `nl/404.html`. The Worker serves the nearest `404.html` on its own (`not_found_handling: 404-page`); on Netlify, the two `[[redirects]]` rules in `netlify.toml` send `/es/*` and `/nl/*` misses to their localized page.

### Missing Output Directory

**For Netlify**: If `dist` doesn't exist after generation:

1. Check for build errors in the console
2. Verify Nuxt is detecting the Netlify environment (look for "Building for Nitro preset: netlify-static" in logs)
3. Ensure all dependencies are installed

**For the Worker**: If `.output/public` doesn't exist after `pnpm generate`, check the console for build errors and that all dependencies are installed.

## Current Configuration Summary

- **Node Version**: 24 (specified in `package.json` engines and `netlify.toml`)
- **Build Command**: `pnpm install --frozen-lockfile && pnpm generate`
- **Output Directory**: `.output/public` for the Worker, `dist` on Netlify
- **SSR**: Enabled at build time; every page, in every language, is prerendered to HTML
- **Static Generation**: Enabled with Nitro prerendering

## Notes

- Recipe pages are crawled from the home page, so all of them are generated for `/`, `/es` and `/nl`
- `404.html` and its localized copies are server-rendered from `error.vue`
- **Nuxt Auto-Detection**: on Netlify, Nuxt uses the `netlify-static` preset and outputs to `dist`. Elsewhere the output is `.output/public`.
