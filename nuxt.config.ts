// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  vite: {
    build: {
      sourcemap: false, // Disable sourcemaps in production to fix Tailwind CSS v4 warnings
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en', file: 'en.json', name: 'English' },
      { code: 'es', language: 'es', file: 'es.json', name: 'Español' },
      { code: 'nl', language: 'nl', file: 'nl.json', name: 'Nederlands' },
    ],
    defaultLocale: 'en',
    // Each locale is prerendered under its own URL (/, /es, /nl). The URL is
    // the only source of truth: a client-side redirect would hydrate one
    // language's HTML with another's strings.
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    // Absolute hreflang and canonical links. NUXT_PUBLIC_I18N_BASE_URL
    // overrides this at build time, e.g. for a preview on another domain.
    baseUrl: 'https://reeeecipe.engg.app',
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false, // Disable during dev to avoid vite-plugin-checker issues
  },

  image: {
    // Provider for image optimization - IPX handles both local and remote images by default
    // Sharp is installed and working (verified via node require test)
    // The warning about sharp binaries is a false positive from @nuxt/image v1.11.0
    provider: 'ipx',
    // Quality settings
    quality: 80,
    // Enable modern image formats
    format: ['webp'],
    // Responsive breakpoints
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  fonts: {
    families: [
      {
        name: 'Schibsted Grotesk',
        provider: 'google',
        weights: [400, 600, 800],
        styles: ['normal'],
        subsets: ['latin'],
      },
    ],
  },

  // Bundle the icons the client swaps at runtime (theme toggle), so the
  // browser never asks api.iconify.design for them
  icon: {
    clientBundle: {
      icons: [
        'heroicons:sun-20-solid',
        'heroicons:moon-20-solid',
        'heroicons:home',
        'heroicons:arrow-left-20-solid',
      ],
    },
    provider: 'none',
  },

  // Follow the system theme; ThemeToggle lets visitors override it
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Server-render 404.html with error.vue instead of an empty SPA shell
  experimental: {
    prerenderErrorPages: true,
  },

  // Nitro configuration for static generation
  nitro: {
    prerender: {
      // Generate HTML files for all routes with full SSR pre-rendering
      crawlLinks: true,
      // Explicitly list routes to pre-render
      routes: [
        '/',
        '/es',
        '/nl',
        '/es/404.html',
        '/nl/404.html',
        '/about',
        '/privacy',
        '/terms',
        '/accessibility',
        '/submit-recipe',
      ],
    },
    hooks: {
      // /es/404.html and /nl/404.html render error.vue in their own language.
      // They answer 404 by design, so keep them instead of failing the build.
      'prerender:generate': (route) => {
        const isLocaleErrorPage = /^\/(es|nl)\/404\.html$/.test(route.route);
        if (isLocaleErrorPage && route.error?.statusCode === 404) {
          delete route.error;
        }
      },
    },
    // Ensure static output
    static: true,
  },
});
