<script setup lang="ts">
import { computed } from 'vue';
import type { LocaleObject } from '@nuxtjs/i18n';

const { locale, locales, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();

interface LocaleSelectItem {
  code: string;
  name: string;
  icon: string;
}

const getFlagIcon = (localeCode: string): string => {
  const flagMap: Record<string, string> = {
    en: 'circle-flags:us',
    es: 'circle-flags:es',
    nl: 'circle-flags:nl',
  };

  return flagMap[localeCode] ?? 'heroicons:language-20-solid';
};

const availableLocales = computed<LocaleSelectItem[]>(() => {
  return (locales.value as LocaleObject[]).map((loc) => ({
    code: loc.code,
    name: loc.name ?? loc.code.toUpperCase(),
    icon: getFlagIcon(loc.code),
  }));
});

const currentLocaleIcon = computed<string>(() => getFlagIcon(locale.value));

const selectedLocale = computed<string>({
  get: () => locale.value,
  set: (newLocale: string) => {
    void handleLocaleChange(newLocale);
  },
});

const localeSelectUi = {
  base: 'min-w-[7rem] rounded-md border border-primary-600 bg-primary-700 text-sm font-medium text-white shadow-sm focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-800',
  arrow: 'text-white',
  item: 'text-sm text-primary-900',
};

const handleLocaleChange = async (newLocale: string): Promise<void> => {
  if (newLocale === locale.value) {
    return;
  }

  const localePath = switchLocalePath(newLocale);

  console.log('🌍 Language Switch:', {
    from: locale.value,
    to: newLocale,
    navigatingTo: localePath,
  });

  await setLocale(newLocale);

  if (localePath) {
    await navigateTo(localePath);
  }

  console.log('✅ Locale changed successfully to:', newLocale);
};
</script>

<template>
  <div class="flex items-center gap-2">
    <UIcon :name="currentLocaleIcon" class="h-5 w-5 text-white" />
    <ULocaleSelect
      v-model="selectedLocale"
      :locales="availableLocales"
      color="primary"
      variant="soft"
      :ui="localeSelectUi"
    >
      <template #item="{ item }">
        <div class="flex items-center gap-2">
          <UIcon :name="item.icon" class="h-4 w-4 text-primary-600" />
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template #leading>
        <UIcon :name="currentLocaleIcon" class="h-4 w-4 text-primary-100" />
      </template>
    </ULocaleSelect>
  </div>
</template>
