# Nuxt 4 Real Estate Demo

A single-page real estate demo site built with Nuxt 4, nuxti18n, TypeScript, NuxtUI, and VueUse.

## Features

- 🌍 Internationalization (i18n) with English and Spanish support
- 🎨 Modern UI with NuxtUI components
- 📱 Fully responsive design
- 🔧 TypeScript with strict mode
- ⚡ VueUse composables for enhanced functionality
- 🏠 Featured properties showcase
- 📧 Contact form with validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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
│   ├── PropertyCard.vue
│   ├── LanguageSwitcher.vue
│   └── ContactForm.vue
├── locales/            # i18n translation files
│   ├── en.json
│   └── es.json
├── pages/              # Nuxt pages
│   └── index.vue       # Main page
├── types/              # TypeScript type definitions
│   └── index.ts
├── app.vue             # Root component
├── nuxt.config.ts      # Nuxt configuration
└── package.json
```

## Technologies Used

- **Nuxt 4** - Vue.js framework
- **nuxti18n** - Internationalization plugin
- **NuxtUI** - UI component library
- **VueUse** - Vue composition utilities
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS (via NuxtUI)

## Language Support

The site supports:

- English (en)
- Spanish (es)

Language preference is persisted in localStorage.

## License

MIT
