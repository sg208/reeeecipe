<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <VueQueryDevtools v-if="isDev" />
  </UApp>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

const isDev = import.meta.dev;
// lang/dir on <html>, plus hreflang alternates and og:locale per page
const localeHead = useLocaleHead({ lang: true, dir: true, seo: true });

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    dir: () => localeHead.value.htmlAttrs?.dir,
  },
  link: () => localeHead.value.link ?? [],
  meta: () => localeHead.value.meta ?? [],
});
</script>
