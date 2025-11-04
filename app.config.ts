export default defineAppConfig({
  ui: {
    // Disable dark mode - force light mode only
    // This prevents the automatic dark mode detection and toggle
  },
  // Configure color mode module to disable dark mode
  nuxtColorMode: {
    preference: 'light', // Force light mode
    fallback: 'light', // Fallback to light mode
    classSuffix: '', // Remove dark class suffix
    storageKey: 'nuxt-color-mode',
  },
});
