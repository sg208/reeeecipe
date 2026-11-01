<script setup lang="ts">
const { t } = useI18n();
const { repoUrl } = useAppConfig();
const issuesUrl = `${repoUrl}/issues`;

useHead({
  title: computed(() => `${t('pages.privacy')} - reeeecipe`),
  meta: [{ name: 'description', content: computed(() => t('privacy.meta')) }],
});
</script>

<template>
  <LegalPage :title="t('pages.privacy')" :lead="t('privacy.lead')">
    <h2>{{ t('privacy.storedHeading') }}</h2>
    <I18nT keypath="privacy.stored" tag="p" scope="global">
      <template #key><code>nuxt-color-mode</code></template>
    </I18nT>

    <h2>{{ t('privacy.servicesHeading') }}</h2>
    <p>{{ t('privacy.servicesIntro') }}</p>
    <ul>
      <li>{{ t('privacy.cloudflare') }}</li>
      <li>{{ t('privacy.dummyjson') }}</li>
    </ul>
    <p>{{ t('privacy.fonts') }}</p>

    <h2>{{ t('privacy.trackingHeading') }}</h2>
    <p>{{ t('privacy.tracking') }}</p>

    <h2>{{ t('legal.questionsHeading') }}</h2>
    <I18nT keypath="legal.questions" tag="p" scope="global">
      <template #link>
        <a :href="issuesUrl">{{ t('legal.issuesLink') }}</a>
      </template>
    </I18nT>
  </LegalPage>
</template>
