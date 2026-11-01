# reeeecipe

Live at https://reeeecipe.engg.app

reeeecipe is a small recipe site in three languages: English, Spanish and Dutch. It pulls its recipes from the public [DummyJSON recipes API](https://dummyjson.com/recipes), lays them out as a sheet of photographs with a searchable index grouped by cuisine, features a different recipe on every visit, and gives every recipe its own detail page with a readable URL such as `/recipes/1/classic-margherita-pizza`.

The whole site is prerendered at build time, so what you deploy is a folder of static HTML, JavaScript and CSS. There is no server and no database.

## Stack

- **Nuxt 4** with Vue 3 and TypeScript in strict mode
- **Nuxt UI 4** for components, which brings Tailwind CSS v4
- **@nuxtjs/i18n** for translations. English lives at `/`, Spanish under `/es` and Dutch under `/nl`, and every page is prerendered in all three languages with `lang` and `hreflang` set. Recipe text comes from the API in English and is marked as such.
- **TanStack Vue Query** for fetching and caching recipe data. State fetched during prerendering is handed to the browser, so the page does not fetch it again.
- **@nuxt/image**, **@nuxt/fonts** (Schibsted Grotesk, downloaded at build time) and **@nuxt/icon** with local Heroicons
- **Vitest** with `@nuxt/test-utils` and happy-dom for tests

## Getting started

You need Node.js 24 (see `.node-version`) and pnpm 10. The exact pnpm version is pinned in `package.json`, so `corepack enable` will pick it up for you.

```bash
pnpm install
pnpm dev
```

The dev server runs at http://localhost:3000.

There are no environment variables to set. The recipe API is public and needs no key.

## Scripts

| Command                             | What it does                                                       |
| ----------------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                          | Start the dev server with hot reload                               |
| `pnpm build`                        | Prerender the site into `.output/public` (same as `pnpm generate`) |
| `pnpm generate`                     | Same as `pnpm build`                                               |
| `pnpm preview`                      | Serve the generated build locally                                  |
| `pnpm lint` / `pnpm lint:fix`       | Run ESLint, or run it and fix what it can                          |
| `pnpm format` / `pnpm format:check` | Format with Prettier, or only check formatting                     |
| `pnpm fix`                          | Run `lint:fix` and then `format`                                   |
| `pnpm type-check`                   | Type-check the app, including `.vue` files, with `vue-tsc`         |
| `pnpm test`                         | Run the test suite once                                            |
| `pnpm test:watch`                   | Re-run tests as files change                                       |
| `pnpm test:ui`                      | Open the Vitest UI                                                 |
| `pnpm test:component`               | Run only the component tests                                       |
| `pnpm test:coverage`                | Run the tests with a V8 coverage report                            |

## Tests

The tests live in `tests/`. `tests/components/` mounts the real components inside a Nuxt test environment, so i18n, Nuxt UI and auto-imports behave the way they do in the app. `tests/unit/` covers the plain logic: slug generation, email validation, the query-key factory and the random hero picker.

```bash
pnpm test
```

There is no CI in this repo yet, so run the tests yourself before you push.

## Project layout

- `pages/`: the home page, the about, accessibility, privacy and terms pages, the placeholder submit-recipe page, and `recipes/[id]/[slug].vue` for recipe details
- `components/`: header, footer, language switcher, theme toggle, the home page sections (photo sheet, featured recipe, searchable index), recipe rows and a shared button
- `composables/`: `queries/useRecipesQuery.ts` for data fetching and `useRandomHero.ts` for the hero pick
- `plugins/vue-query.ts`: sets up the query client and passes prerendered state to the browser
- `i18n/locales/`: translation files. Any new key goes into all three of them.
- `utils/`, `types/`: small helpers and the `Recipe` types

## Deploying

The site runs on a Cloudflare Worker that serves the static files in `.output/public`. `wrangler.jsonc` holds the config and uses `not_found_handling: 404-page`, so a missing path gets the nearest `404.html`, and each language has its own.

```bash
pnpm run deploy   # pnpm generate, then wrangler deploy
```

You need `wrangler` v4 installed globally, and `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set in the environment.

The `hreflang` and canonical links use `https://reeeecipe.engg.app` as their base (`i18n.baseUrl` in `nuxt.config.ts`). To build for another domain, set `NUXT_PUBLIC_I18N_BASE_URL` before building.

`DEPLOYMENT.md` has more detail. Architecture notes are in `design.md`.

## License

The repository has no open-source license, so all rights are reserved.
