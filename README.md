# Nuxt 4 Recipe Demo

A recipe demo site built with Nuxt 4, nuxti18n, TypeScript, NuxtUI, and VueUse.

## Features

- 🌍 Internationalization (i18n) with English, Spanish, and Dutch support
- 🎨 Modern UI with NuxtUI components
- 📱 Fully responsive design
- 🔧 TypeScript with strict mode
- ⚡ VueUse composables for enhanced functionality
- 🍳 Featured recipes showcase
- 📧 Submit recipe form with validation

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
│   ├── RecipeCard.vue
│   ├── LanguageSwitcher.vue
│   └── ...
├── locales/            # i18n translation files
│   ├── en.json
│   ├── es.json
│   └── nl.json
├── pages/              # Nuxt pages
│   └── index.vue       # Main page
├── types/              # TypeScript type definitions
│   └── index.ts
├── app.vue             # Root component
├── nuxt.config.ts      # Nuxt configuration
└── package.json
```

## Technologies Used

- **Nuxt 4** - Vue.js framework (SSR disabled: `ssr: false`)
- **@nuxtjs/i18n** - Internationalization plugin
- **@nuxt/ui** - UI component library (provides UCard, UIcon, etc.)
- **@vueuse/core** - Vue composition utilities
- **@tanstack/vue-query** - Data fetching and caching (used in components)
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

## License

MIT
