# design.md

## Architecture

- RENDER: SSR at build time → `nuxt generate` prerenders `/`, `/about`, `/privacy`, `/terms`, `/submit-recipe` + crawled recipe detail pages (`nuxt.config.ts` `nitro.prerender`). WHY: static hosting on Netlify / Cloudflare Pages, no server.
- DATA: `useRecipesQuery` → `$fetch('https://dummyjson.com/recipes')` → adds `slug` via `createSlug` (`composables/queries/useRecipesQuery.ts`). Detail query reads list cache first, then `/recipes/:id`.
- STATE: Vue Query state dehydrated on `app:rendered`, hydrated on `app:created` (`plugins/vue-query.ts`). WHY: prerendered payload reused, no refetch flash.
- HERO: `useRandomHero` picks hero + overlay only in `onMounted`. WHY: avoids SSR hydration mismatch.
- I18N: `no_prefix` strategy, cookie `i18n_locale`, browser detection on root; switcher reloads page after `setLocale`.
- STYLING: Tailwind v4 through @nuxt/ui; light mode forced (`nuxt.config.ts` `colorMode`, `app.config.ts`).
- FALLBACK: SPA redirect `/* → /index.html` (`netlify.toml`, `public/_redirects`).
