# Deployment Guide

This document contains deployment settings for Netlify and Cloudflare Pages.

## Build Verification

The static generation was tested and verified:

```bash
pnpm install --frozen-lockfile && pnpm generate
```

Output directory: `dist` (both platforms auto-detect and use Nuxt's platform-specific presets)

## Netlify Deployment

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

## Cloudflare Pages Deployment

### Configuration File: `wrangler.toml`

The configuration is already set up in `wrangler.toml`:

```toml
name = "nuxt4-nuxti18n"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"
```

**Note**: Nuxt automatically detects Cloudflare Pages and uses the `cloudflare-pages-static` preset, which outputs to `dist` instead of `.output/public`.

### Cloudflare Pages Dashboard Settings

**IMPORTANT**: Cloudflare Pages requires the build command to be configured in the dashboard. The `wrangler.toml` file only specifies the output directory.

Configure in the Cloudflare Pages dashboard (Settings → Builds & deployments):

- **Framework preset**: None (or Nuxt if available)
- **Build command**: `pnpm install --frozen-lockfile && pnpm generate` ⚠️ **MUST be set in dashboard**
- **Build output directory**: `dist` (Nuxt auto-detects Cloudflare and uses this directory)
- **Node version**: 24
- **Environment variables**: None required for basic setup

**Note**: If you see "Output directory not found" error, it means the build command is not configured or is failing. The build command must run successfully before Cloudflare can find the output directory. Nuxt automatically detects Cloudflare Pages and uses the `cloudflare-pages-static` preset.

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

### Cloudflare Pages: "Output directory not found"

If Cloudflare Pages shows "Output directory not found":

1. **Verify build command is set** in Cloudflare Pages dashboard (Settings → Builds & deployments)
   - Build command should be: `pnpm install --frozen-lockfile && pnpm generate`
2. **Check build logs** - the build command must complete successfully
3. **Verify Node version** is set to 24 in the dashboard
4. **Verify wrangler.toml** has `pages_build_output_dir = "dist"` (Nuxt auto-detects Cloudflare and uses `dist`)

### Missing Pages Return the Wrong 404

Every route is prerendered, so there is no single-page fallback. Unknown paths get a real 404 page in their language: `404.html`, `es/404.html` and `nl/404.html`. Cloudflare Pages serves the nearest `404.html` on its own; on Netlify, the two `[[redirects]]` rules in `netlify.toml` send `/es/*` and `/nl/*` misses to their localized page.

### Missing Output Directory

**For Netlify**: If `dist` doesn't exist after generation:

1. Check for build errors in the console
2. Verify Nuxt is detecting the Netlify environment (look for "Building for Nitro preset: netlify-static" in logs)
3. Ensure all dependencies are installed

**For Cloudflare Pages**: If `dist` doesn't exist after generation:

1. Check for build errors in the console
2. Verify Nuxt is detecting the Cloudflare environment (look for "Building for Nitro preset: cloudflare-pages-static" in logs)
3. Ensure all dependencies are installed

## Current Configuration Summary

- **Node Version**: 24 (specified in `package.json` engines and `netlify.toml`)
- **Build Command**: `pnpm install --frozen-lockfile && pnpm generate`
- **Output Directory**: `dist` (Nuxt auto-detects both platforms)
- **SSR**: Enabled at build time; every page, in every language, is prerendered to HTML
- **Static Generation**: Enabled with Nitro prerendering

## Notes

- Recipe pages are crawled from the home page, so all of them are generated for `/`, `/es` and `/nl`
- `404.html` and its localized copies are server-rendered from `error.vue`
- **Nuxt Auto-Detection**: Nuxt automatically detects the deployment environment and uses the appropriate preset:
  - Netlify → `netlify-static` preset → outputs to `dist`
  - Cloudflare Pages → `cloudflare-pages-static` preset → outputs to `dist`
  - Both platforms use `dist` as the output directory (not `.output/public`)
