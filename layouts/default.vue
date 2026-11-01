<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-svh flex-col bg-ground text-ink">
    <a
      href="#main"
      class="text-small fixed left-3 top-3 z-[60] -translate-y-24 bg-accent px-4 py-3 font-semibold text-accent-ink focus:translate-y-0"
    >
      {{ t('a11y.skipToContent') }}
    </a>
    <AppHeader />
    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
