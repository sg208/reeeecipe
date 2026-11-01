import { defineVitestConfig } from '@nuxt/test-utils/config';
import { fileURLToPath } from 'node:url';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '**/.nuxt/**',
      ],
    },
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('.', import.meta.url)),
        domEnvironment: 'happy-dom',
        overrides: {
          ssr: false,
        },
      },
    },
  },
});
