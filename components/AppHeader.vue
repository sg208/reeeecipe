<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-primary-900 bg-blue-800 shadow-sm"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-2xl font-bold text-white transition-colors hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-800"
        >
          reeeecipe
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex items-center gap-4">
          <LanguageSwitcher />
          <AppButton
            to="/submit-recipe"
            :label="t('recipes.submitRecipe')"
            size="xl"
          />
        </nav>
      </div>
    </div>
  </header>
</template>
