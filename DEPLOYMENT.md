# Deployment Guide

This document contains deployment settings for Netlify and Cloudflare Pages.

## Build Verification

The static generation was tested and verified:

```bash
npm ci && npm run generate
```

Output directory: `.output/public` ✅

## Netlify Deployment

### Configuration File: `netlify.toml`

The configuration is already set up in `netlify.toml`:

```toml
[build]
  command = "npm ci && npm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Netlify Dashboard Settings

If you need to configure manually in the dashboard:

- **Build command**: `npm ci && npm run generate`
- **Publish directory**: `.output/public`
- **Node version**: 22
- **Environment variables**: None required for basic setup

## Cloudflare Pages Deployment

### Configuration File: `wrangler.toml`

The configuration is already set up in `wrangler.toml`:

```toml
name = "nuxt4-nuxti18n"
compatibility_date = "2024-11-01"
pages_build_output_dir = ".output/public"
```

### Cloudflare Pages Dashboard Settings

Configure in the Cloudflare Pages dashboard:

- **Framework preset**: None (or Nuxt if available)
- **Build command**: `npm ci && npm run generate`
- **Build output directory**: `.output/public`
- **Node version**: 22
- **Environment variables**: None required for basic setup

## Local Testing

Before deploying, test locally:

```bash
# Clean install
npm ci

# Generate static files
npm run generate

# Preview the build
npm run preview
```

Verify the output directory exists:

```bash
ls -la .output/public
```

## Troubleshooting

### Build Fails with Dependency Errors

If you encounter dependency issues:

1. Remove `node_modules` and `package-lock.json`
2. Run `npm ci` again
3. Check Node version matches (should be 22+)

### Routes Not Working

Ensure `public/_redirects` contains:

```
/*    /index.html   200
```

### Missing Output Directory

If `.output/public` doesn't exist after generation:

1. Check for build errors in the console
2. Verify `nuxt.config.ts` has correct nitro configuration
3. Ensure all dependencies are installed

## Current Configuration Summary

- **Node Version**: 22 (specified in `package.json` engines and `netlify.toml`)
- **Build Command**: `npm ci && npm run generate`
- **Output Directory**: `.output/public`
- **SSR**: Disabled (`ssr: false` in `nuxt.config.ts`)
- **Static Generation**: Enabled with Nitro prerendering

## Notes

- The warning "HTML content not prerendered because ssr: false" is expected and harmless for SPAs
- HTML shells are still generated correctly for all routes
- The `_redirects` file ensures SPA routing works correctly
