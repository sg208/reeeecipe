<script setup lang="ts">
const { t } = useI18n();
const { repoUrl } = useAppConfig();
const issuesUrl = `${repoUrl}/issues`;

const doneKeys = [
  'skipLink',
  'landmarks',
  'language',
  'focus',
  'targets',
  'themes',
  'motion',
  'search',
] as const;
const limitKeys = ['english', 'liveCount', 'textZoom', 'audit'] as const;

useHead({
  title: computed(() => `${t('pages.accessibility')} - reeeecipe`),
  meta: [
    { name: 'description', content: computed(() => t('accessibility.meta')) },
  ],
});
</script>

<template>
  <LegalPage :title="t('pages.accessibility')" :lead="t('accessibility.lead')">
    <h2>{{ t('accessibility.doneHeading') }}</h2>
    <ul>
      <li v-for="key in doneKeys" :key="key">
        {{ t(`accessibility.done.${key}`) }}
      </li>
    </ul>

    <h2>{{ t('accessibility.limitsHeading') }}</h2>
    <ul>
      <li v-for="key in limitKeys" :key="key">
        {{ t(`accessibility.limits.${key}`) }}
      </li>
    </ul>

    <h2>{{ t('accessibility.reportHeading') }}</h2>
    <I18nT keypath="accessibility.report" tag="p" scope="global">
      <template #link>
        <a :href="issuesUrl">{{ t('legal.issuesLink') }}</a>
      </template>
    </I18nT>
  </LegalPage>
</template>
