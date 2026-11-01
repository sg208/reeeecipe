# design.md

## Architecture

- RENDER: SSR at build time → `nuxt generate` prerenders `/`, `/about`, `/privacy`, `/terms`, `/submit-recipe` + crawled recipe detail pages (`nuxt.config.ts` `nitro.prerender`). WHY: static hosting on Netlify / Cloudflare Pages, no server.
- DATA: `useRecipesQuery` → `$fetch('https://dummyjson.com/recipes')` → adds `slug` via `createSlug` (`composables/queries/useRecipesQuery.ts`). Detail query reads list cache first, then `/recipes/:id`.
- STATE: Vue Query state dehydrated on `app:rendered`, hydrated on `app:created` (`plugins/vue-query.ts`). WHY: prerendered payload reused, no refetch flash.
- FEATURED: `useRandomHero` picks the featured recipe only in `onMounted`. WHY: avoids SSR hydration mismatch.
- I18N: `prefix_except_default` (`/`, `/es`, `/nl`), browser detection off. WHY: each locale prerenders to its own HTML; a client-side locale switch over another locale's HTML causes hydration mismatches. Switcher = plain links with `hreflang`.
- PRERENDER DATA: pages call `onServerPrefetch(suspense)` so recipes are in the HTML and the crawler reaches every detail page; server `gcTime: Infinity` so `nuxt generate` exits without waiting on a timer.
- STYLING: Tailwind v4; colour roles as CSS custom properties in `assets/css/main.css` (light on `:root`, dark on `.dark`), exposed to Tailwind via `@theme inline`. Colour mode follows the system, `ThemeToggle` overrides it.
- LANG: `app.vue` sets `<html lang>` from `useLocaleHead`; recipe text from the API is English, so it carries `lang="en"` when the UI locale is not English (`useRecipeLabels`).
- FALLBACK: SPA redirect `/* → /index.html` (`netlify.toml`, `public/_redirects`).
