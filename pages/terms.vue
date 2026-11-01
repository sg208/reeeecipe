<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { repoUrl } = useAppConfig();
const issuesUrl = `${repoUrl}/issues`;

useHead({
  title: computed(() => `${t('pages.terms')} - reeeecipe`),
  meta: [{ name: 'description', content: computed(() => t('terms.meta')) }],
});
</script>

<template>
  <LegalPage :title="t('pages.terms')" :lead="t('terms.lead')">
    <h2>{{ t('terms.whatHeading') }}</h2>
    <p>{{ t('terms.what') }}</p>

    <h2>{{ t('terms.contentHeading') }}</h2>
    <p>{{ t('terms.content') }}</p>

    <h2>{{ t('terms.warrantyHeading') }}</h2>
    <p>{{ t('terms.warranty') }}</p>

    <h2>{{ t('terms.codeHeading') }}</h2>
    <I18nT keypath="terms.code" tag="p" scope="global">
      <template #link>
        <a :href="repoUrl">{{ t('terms.codeLink') }}</a>
      </template>
    </I18nT>

    <h2>{{ t('pages.privacy') }}</h2>
    <I18nT keypath="terms.privacy" tag="p" scope="global">
      <template #link>
        <NuxtLink :to="localePath('/privacy')">{{
          t('terms.privacyLink')
        }}</NuxtLink>
      </template>
    </I18nT>

    <h2>{{ t('legal.questionsHeading') }}</h2>
    <I18nT keypath="legal.questions" tag="p" scope="global">
      <template #link>
        <a :href="issuesUrl">{{ t('legal.issuesLink') }}</a>
      </template>
    </I18nT>
  </LegalPage>
</template>
