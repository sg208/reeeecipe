<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <header class="sticky top-0 z-50 bg-ground">
    <div class="page-frame">
      <div class="flex h-16 items-center justify-between gap-3">
        <NuxtLink
          :to="localePath('/')"
          class="text-xl font-extrabold tracking-[-0.04em] text-ink transition-opacity hover:opacity-75"
        >
          reeeecipe
        </NuxtLink>

        <nav
          :aria-label="t('a11y.siteNavigation')"
          class="flex items-center gap-1 sm:gap-3"
        >
          <LanguageSwitcher />
          <ThemeToggle />
          <AppButton
            :to="localePath('/submit-recipe')"
            :label="t('recipes.submitRecipe')"
            class="hidden sm:inline-flex"
          />
        </nav>
      </div>
    </div>
  </header>
</template>
