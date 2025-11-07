<script setup lang="ts">
const { t } = useI18n();
const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="border-t border-primary-200 bg-blue-50">
    <div class="container mx-auto px-4 py-8">
      <div
        class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- Copyright -->
        <p class="text-sm text-blue-800">
          {{ t('footer.copyright', { year: currentYear }) }}
        </p>

        <!-- Footer Links -->
        <div class="flex flex-wrap items-center gap-6">
          <NuxtLinkLocale
            to="/about"
            class="text-sm text-blue-800 transition-colors hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-50"
          >
            {{ t('pages.about') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale
            to="/privacy"
            class="text-sm text-blue-800 transition-colors hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-50"
          >
            {{ t('pages.privacy') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale
            to="/terms"
            class="text-sm text-blue-800 transition-colors hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-primary-50"
          >
            {{ t('pages.terms') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </footer>
</template>
