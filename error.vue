<script setup lang="ts">
import type { NuxtError } from '#app';

interface Props {
  error: NuxtError;
}

const props = defineProps<Props>();
const { t } = useI18n();
const localePath = useLocalePath();

// error.vue replaces app.vue, so it sets the document language itself
const localeHead = useLocaleHead({ lang: true, dir: true, seo: false });

const statusCode = computed(() => props.error?.statusCode ?? 500);
const isNotFound = computed(() => statusCode.value === 404);
const isServerError = computed(() => statusCode.value >= 500);

const title = computed(() => {
  if (isNotFound.value) return t('errorPage.notFoundTitle');
  if (isServerError.value) return t('errorPage.serverTitle');
  return t('errorPage.genericTitle');
});

const body = computed(() =>
  isNotFound.value
    ? t('errorPage.notFoundBody')
    : t('errorPage.otherBody', { code: statusCode.value })
);

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    dir: () => localeHead.value.htmlAttrs?.dir,
  },
  title: computed(() => `${title.value} - reeeecipe`),
  meta: [{ name: 'robots', content: 'noindex' }],
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <div
        class="page-frame grid min-h-[60svh] gap-8 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12"
      >
        <h1 class="text-head lg:col-span-6">{{ title }}</h1>
        <div class="lg:col-span-5 lg:col-start-8 lg:pt-3">
          <p class="text-lead">{{ body }}</p>
          <a
            :href="localePath('/')"
            class="mt-8 inline-flex min-h-12 items-center bg-accent px-5 font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            {{ t('errorPage.home') }}
          </a>
        </div>
      </div>
    </NuxtLayout>
  </UApp>
</template>
