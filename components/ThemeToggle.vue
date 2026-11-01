<script setup lang="ts">
const { t } = useI18n();
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === 'dark');

const handleToggle = (): void => {
  colorMode.preference = isDark.value ? 'light' : 'dark';
};
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      :aria-pressed="isDark"
      :aria-label="t('a11y.darkTheme')"
      class="inline-flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-ink"
      @click="handleToggle"
    >
      <Icon
        :name="isDark ? 'heroicons:moon-20-solid' : 'heroicons:sun-20-solid'"
        class="h-5 w-5"
        aria-hidden="true"
      />
    </button>
    <template #fallback>
      <span class="inline-block h-11 w-11" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>
