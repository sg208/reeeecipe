<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();

// Map locale codes to flag icons
const getFlagIcon = (localeCode: string): string => {
  const flagMap: Record<string, string> = {
    en: 'circle-flags:us',
    es: 'circle-flags:es',
    nl: 'circle-flags:nl',
  };
  return flagMap[localeCode] ?? 'heroicons:language-20-solid';
};

// Handle locale change
const handleChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLSelectElement;
  const newLocale = target.value as 'en' | 'es' | 'nl';

  if (newLocale === locale.value) return;

  await setLocale(newLocale);

  // Force a page reload to ensure all translations update
  if (import.meta.client) {
    window.location.reload();
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <UIcon :name="getFlagIcon(locale)" class="h-5 w-5 text-white" />
    <select
      :value="locale"
      :aria-label="t('footer.language')"
      class="cursor-pointer rounded-md border border-primary-600 bg-primary-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
      @change="handleChange"
    >
      <option
        v-for="loc in locales"
        :key="loc.code"
        :value="loc.code"
        :selected="loc.code === locale"
      >
        {{ loc.name ?? loc.code.toUpperCase() }}
      </option>
    </select>
  </div>
</template>
