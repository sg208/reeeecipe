# Deployment

The live site, https://reeeecipe.engg.app, is a Cloudflare Worker that serves static assets. DNS for `engg.app` is on Cloudflare.

## Build

```bash
pnpm install --frozen-lockfile
pnpm generate
```

The output goes to `.output/public`. Every page is prerendered in all three languages, and recipe pages are found by crawling the home page.

`hreflang` and canonical links use `https://reeeecipe.engg.app` (`i18n.baseUrl` in `nuxt.config.ts`). Set `NUXT_PUBLIC_I18N_BASE_URL` before building if you need a different domain.

## Deploy

`wrangler.jsonc` points the Worker at `.output/public` and binds it to the `reeeecipe.engg.app` custom domain.

```bash
pnpm run deploy   # pnpm generate, then wrangler deploy
```

Requirements:

- `wrangler` v4 installed globally
- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set in the environment

## Missing pages

There is no single-page fallback. Unknown paths get a real 404 page in their language: `404.html`, `es/404.html` and `nl/404.html`, all server-rendered from `error.vue`. The Worker serves the nearest one on its own (`not_found_handling: 404-page`).

## Local check

```bash
pnpm generate
pnpm preview
```

## Troubleshooting

- Dependency errors: delete `node_modules`, run `pnpm install` again, and check that you are on Node 24 (see `.node-version`).
- No `.output/public` after `pnpm generate`: look for build errors in the console.
