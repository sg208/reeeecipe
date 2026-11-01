<script setup lang="ts">
interface Props {
  title: string;
  lead: string;
}

defineProps<Props>();
const { t } = useI18n();
</script>

<template>
  <div class="page-frame grid gap-8 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12">
    <header v-reveal class="lg:col-span-5">
      <h1 class="text-head">{{ title }}</h1>
      <p class="text-small mt-6 text-muted">
        {{ t('legal.updated', { date: t('legal.date') }) }}
      </p>
    </header>
    <div v-reveal="1" class="legal-body lg:col-span-6 lg:col-start-7 lg:pt-3">
      <p class="text-lead">{{ lead }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.legal-body :deep(h2) {
  margin-top: 2.5rem;
  font-size: var(--step-lead);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}
.legal-body :deep(p),
.legal-body :deep(ul) {
  margin-top: 0.75rem;
  max-width: 65ch;
}
.legal-body :deep(ul) {
  padding-left: 1.25rem;
  list-style: disc;
}
.legal-body :deep(li + li) {
  margin-top: 0.5rem;
}
.legal-body :deep(a) {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
