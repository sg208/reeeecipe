<script setup lang="ts">
// Every locale has its own prerendered URL, so switching is a plain link
const { t, locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <ul :aria-label="t('footer.language')" class="flex items-center">
    <li v-for="loc in locales" :key="loc.code">
      <NuxtLink
        :to="switchLocalePath(loc.code)"
        :lang="loc.code"
        :hreflang="loc.code"
        :aria-current="loc.code === locale ? 'true' : undefined"
        :title="loc.name"
        class="text-small inline-flex h-11 min-w-11 items-center justify-center px-2 font-semibold uppercase transition-colors"
        :class="
          loc.code === locale
            ? 'text-ink underline decoration-2 underline-offset-[6px]'
            : 'text-muted hover:text-ink'
        "
      >
        {{ loc.code }}
        <span class="sr-only">{{ loc.name }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>
