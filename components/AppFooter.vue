<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const currentYear = computed(() => new Date().getFullYear());

const links = [
  { to: '/about', key: 'pages.about' },
  { to: '/submit-recipe', key: 'recipes.submitRecipe' },
  { to: '/privacy', key: 'pages.privacy' },
  { to: '/terms', key: 'pages.terms' },
] as const;
</script>

<template>
  <footer class="mt-24 bg-ground sm:mt-40">
    <div
      class="page-frame text-small grid gap-2 pb-8 sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-6 sm:pb-10"
    >
      <p class="text-muted">{{ t('footer.tagline') }}</p>
      <ul class="flex flex-wrap gap-x-6 gap-y-1">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="localePath(link.to)"
            class="inline-block py-2 font-semibold text-ink underline-offset-4 transition-colors hover:underline"
          >
            {{ t(link.key) }}
          </NuxtLink>
        </li>
      </ul>
      <p class="text-muted sm:text-right">
        {{ t('footer.copyright', { year: currentYear }) }}
      </p>
    </div>
  </footer>
</template>
