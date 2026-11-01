<script setup lang="ts">
const { t } = useI18n();

// SEO
useHead({
  title: computed(() => `${t('pages.about')} - reeeecipe`),
  meta: [
    {
      name: 'description',
      content: t('pages.comingSoon'),
    },
  ],
});
</script>

<template>
  <StaticPage :title="t('pages.about')" :body="t('pages.comingSoon')" />
</template>
