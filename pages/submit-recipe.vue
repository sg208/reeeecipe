<script setup lang="ts">
const { t } = useI18n();

// SEO
useHead({
  title: computed(() => `${t('submitRecipe.title')} - reeeecipe`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('submitRecipe.metaDescription')),
    },
  ],
});
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="mb-4 text-4xl font-bold text-gray-900">
        {{ t('submitRecipe.title') }}
      </h1>
      <p class="text-lg text-gray-600">
        {{ t('submitRecipe.description') }}
      </p>
    </div>
  </div>
</template>
