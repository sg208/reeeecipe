<script setup lang="ts">
const { t } = useI18n();

// SEO
useHead({
  title: computed(() => `${t('pages.terms')} - reeeecipe`),
  meta: [
    {
      name: 'description',
      content: t('pages.comingSoon'),
    },
  ],
});
</script>

<template>
  <StaticPage :title="t('pages.terms')" :body="t('pages.comingSoon')" />
</template>
