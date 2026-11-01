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
  <StaticPage
    :title="t('submitRecipe.title')"
    :body="t('submitRecipe.description')"
  />
</template>
