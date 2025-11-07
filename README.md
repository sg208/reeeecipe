# Nuxt 4 Recipe Demo

A recipe demo site built with Nuxt 4, nuxti18n, TypeScript, NuxtUI, and VueUse.

## Features

- 🌍 Internationalization (i18n) with English, Spanish, and Dutch support
- 🎨 Modern UI with NuxtUI components
- 📱 Fully responsive design
- 🔧 TypeScript with strict mode
- ⚡ VueUse composables for enhanced functionality
- 🍳 Featured recipes showcase with TanStack Query
- 🔗 SEO-friendly URLs with slugs (`/recipes/1/classic-margherita-pizza`)
- 📧 Submit recipe form with validation
- ⚡ Server state management with TanStack Query
- 📤 File upload with progress tracking (axios + TanStack Query)
- 🔐 Client-side authentication with JWT (localStorage)
- 🧪 Comprehensive testing with Vitest and Vue Test Utils

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── components/          # Vue components
│   ├── AppButton.vue
│   ├── AppFooter.vue
│   ├── AppHeader.vue
│   ├── LanguageSwitcher.vue
│   └── RecipeCard.vue
├── composables/         # Vue composables
│   ├── queries/
│   │   └── useRecipesQuery.ts  # TanStack Query hooks
│   └── useRandomHero.ts
├── i18n/               # i18n translation files
│   └── locales/
│       ├── en.json
│       ├── es.json
│       └── nl.json
├── layouts/            # Nuxt layouts
│   └── default.vue
├── pages/              # Nuxt pages (file-based routing)
│   ├── index.vue       # Home page (recipe listing)
│   ├── about.vue
│   ├── privacy.vue
│   ├── terms.vue
│   ├── submit-recipe.vue
│   └── recipes/
│       └── [id]/
│           └── [slug].vue  # Recipe detail page (/recipes/1/classic-margherita-pizza)
├── plugins/            # Nuxt plugins
│   └── vue-query.ts    # TanStack Query setup
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions (auto-imported)
│   ├── formatters.ts
│   └── slugify.ts      # Slug generation for SEO-friendly URLs
├── app.vue             # Root component
├── nuxt.config.ts      # Nuxt configuration
└── package.json
```

## Technologies Used

- **Nuxt 4** - Vue.js framework with static site generation
- **@nuxtjs/i18n** - Internationalization plugin
- **@nuxt/ui** - UI component library (provides UCard, UIcon, etc.)
- **@vueuse/core** - Vue composition utilities
- **@tanstack/vue-query** - Data fetching and caching (used in components)
- **axios** - File upload with progress tracking
- **@nuxt/image** - Image optimization (NuxtImg component)
- **@nuxt/icon** - Icon system (Iconify integration)
- **@nuxt/fonts** - Font optimization (Google Fonts)
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS (via NuxtUI)

## Key Dependencies

The following dependencies are actively used by components and features:

### Core

- `nuxt` ^4.2.0 - Nuxt framework
- `vue` ^3.5.22 - Vue.js

### Nuxt Modules

- `@nuxtjs/i18n` ^10.2.0 - Internationalization (used in LanguageSwitcher, all pages)
- `@nuxt/ui` ^4.1.0 - UI components (UCard, UIcon, UApp used throughout)
- `@nuxt/image` ^1.11.0 - Image optimization (NuxtImg in RecipeCard)
- `@nuxt/icon` ^2.1.0 - Icon system (icons in LanguageSwitcher, components)
- `@nuxt/fonts` ^0.11.4 - Font loading (Inter font family)

### Data & State Management

- `@tanstack/vue-query` ^5.59.0 - Server state management (used in composables/queries)
- `@tanstack/vue-query-devtools` ^5.59.0 - Query devtools (enabled in dev mode)

### HTTP & File Upload

- `axios` ^1.7.9 - File upload with progress tracking (used in useApiClient)

### Utilities

- `@vueuse/core` ^14.0.0 - Vue composition utilities

### Icons

- `@iconify-json/heroicons` ^1.2.3 - Heroicons icon set
- `@iconify-json/circle-flags` ^1.2.10 - Country flag icons for language switcher

## Language Support

The site supports:

- English (en)
- Spanish (es)
- Dutch (nl)

Language preference is persisted in localStorage.

## Routes

The application uses Nuxt's file-based routing:

- `/` - Home page with recipe listing
- `/recipes/[id]/[slug]` - Recipe detail page (e.g., `/recipes/1/classic-margherita-pizza`)
- `/about` - About page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/submit-recipe` - Submit recipe form
- `/upload-demo` - File upload demo with progress tracking
- `/auth/login` - User login page
- `/auth/register` - User registration page
- `/dashboard` - Protected user dashboard (requires authentication)

### SEO-Friendly Recipe URLs

Recipe URLs are automatically generated with slugs for better SEO:

```
/recipes/1/classic-margherita-pizza
/recipes/5/chicken-tikka-masala
/recipes/12/chocolate-chip-cookies
```

The slug is generated from the recipe name using the `createSlug()` utility function, which:

- Converts to lowercase
- Removes special characters and diacritics
- Replaces spaces with hyphens
- Handles Unicode characters properly

## Testing

Run tests with:

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # UI mode (Vitest UI)
npm run test:coverage # Coverage report
```

## File Upload & Authentication

### File Upload System

This project includes a complete file upload system with progress tracking:

- **Single file upload** with real-time progress (0-100%)
- **Multiple file upload** with individual progress per file
- **axios** for upload progress tracking
- **TanStack Query** for state management and caching
- Works with both images and PDFs

**Demo:** Visit `/upload-demo` to see it in action

**Documentation:** See [FILE_UPLOAD_IMPLEMENTATION.md](./FILE_UPLOAD_IMPLEMENTATION.md) for detailed usage guide

### Authentication System

Client-side authentication with JWT tokens:

- **Login/Register** with mock data (ready for Laravel backend)
- **JWT tokens** stored in localStorage
- **Route protection** with middleware
- **TanStack Query** for auth state management
- Works with `npm run generate` (static site generation)

**Demo:** Visit `/auth/login` (use `user@example.com` / `password`)

**Documentation:** See [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) for detailed usage guide

## Documentation

- [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md) - Authentication system guide
- [FILE_UPLOAD_IMPLEMENTATION.md](./FILE_UPLOAD_IMPLEMENTATION.md) - File upload guide
- [CLIENT_SIDE_AUTH_MIGRATION.md](./CLIENT_SIDE_AUTH_MIGRATION.md) - Auth migration details
- [TESTING_SETUP.md](./TESTING_SETUP.md) - Testing configuration
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## License

MIT
