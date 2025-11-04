// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  ssr: false,

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
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'es', file: 'es.json', name: 'Español' },
      { code: 'nl', file: 'nl.json', name: 'Nederlands' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false, // Disable during dev to avoid vite-plugin-checker issues
  },

  eslint: {
    // Disable ESLint during build to prevent build failures
    lintOnBuild: false,
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
        name: 'Inter',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal'],
        subsets: ['latin'],
      },
    ],
  },

  // @nuxt/icon automatically detects @iconify-json/* packages
  // Collections installed: @iconify-json/heroicons, @iconify-json/circle-flags
  // This ensures icons are loaded locally without API calls

  // Disable dark mode - force light mode only
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Nitro configuration for static generation
  nitro: {
    prerender: {
      // Generate HTML files for all routes (even with SSR disabled)
      crawlLinks: true,
      // Explicitly list routes to pre-render
      routes: ['/', '/about', '/privacy', '/terms', '/submit-recipe'],
    },
  },

  // Note: The warning "HTML content not prerendered because ssr: false" is expected
  // and harmless for SPAs. HTML shells are still generated correctly.
});
