<script setup lang="ts">
interface Props {
  title: string;
  body: string;
}

defineProps<Props>();
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <div
    class="page-frame grid min-h-[60svh] gap-8 py-16 sm:py-24 lg:grid-cols-12 lg:gap-12"
  >
    <h1 v-reveal class="text-head lg:col-span-6">{{ title }}</h1>
    <div v-reveal="1" class="lg:col-span-5 lg:col-start-8 lg:pt-3">
      <p class="text-lead">{{ body }}</p>
      <NuxtLink
        :to="localePath('/') + '#index'"
        class="mt-8 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
      >
        {{ t('recipes.backToRecipes') }}
      </NuxtLink>
    </div>
  </div>
</template>
