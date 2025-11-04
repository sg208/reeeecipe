# Deployment Guide

This document contains deployment settings for Netlify and Cloudflare Pages.

## Build Verification

The static generation was tested and verified:

```bash
npm install && npm run generate
```

Output directory: `.output/public` ✅

## Netlify Deployment

### Configuration File: `netlify.toml`

The configuration is already set up in `netlify.toml`:

```toml
[build]
  command = "npm install && npm run generate"
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

- **Build command**: `npm install && npm run generate`
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

**IMPORTANT**: Cloudflare Pages requires the build command to be configured in the dashboard. The `wrangler.toml` file only specifies the output directory.

Configure in the Cloudflare Pages dashboard (Settings → Builds & deployments):

- **Framework preset**: None (or Nuxt if available)
- **Build command**: `npm install && npm run generate` ⚠️ **MUST be set in dashboard**
- **Build output directory**: `.output/public`
- **Node version**: 22
- **Environment variables**: None required for basic setup

**Note**: If you see "Output directory not found" error, it means the build command is not configured or is failing. The build command must run successfully before Cloudflare can find the output directory.

## Local Testing

Before deploying, test locally:

```bash
# Clean install
npm install

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
2. Run `npm install` again
3. Check Node version matches (should be 22+)

### Cloudflare Pages: "Output directory not found"

If Cloudflare Pages shows "Output directory `.output/public` not found":

1. **Verify build command is set** in Cloudflare Pages dashboard (Settings → Builds & deployments)
   - Build command should be: `npm install && npm run generate`
2. **Check build logs** - the build command must complete successfully
3. **Verify Node version** is set to 22 in the dashboard
4. **Test locally** - run `npm install && npm run generate` and verify `.output/public` exists

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
- **Build Command**: `npm install && npm run generate`
- **Output Directory**: `.output/public`
- **SSR**: Disabled (`ssr: false` in `nuxt.config.ts`)
- **Static Generation**: Enabled with Nitro prerendering

## Notes

- The warning "HTML content not prerendered because ssr: false" is expected and harmless for SPAs
- HTML shells are still generated correctly for all routes
- The `_redirects` file ensures SPA routing works correctly
