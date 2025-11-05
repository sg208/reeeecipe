<script setup lang="ts">
import { computed } from 'vue';
import type { Recipe } from '~/types';
import { useRecipesQuery } from '~/composables/queries/useRecipesQuery';
import { useRandomHero } from '~/composables/useRandomHero';

const { t } = useI18n();

// Fetch recipes using TanStack Query
const {
  data: recipes,
  isPending: pending,
  error,
  refetch: refresh,
} = useRecipesQuery();

// Random hero selection with dynamic overlay
const { heroRecipe, overlayClass } = useRandomHero(recipes);

// Remaining recipes (excluding hero)
const remainingRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return [];
  if (!heroRecipe.value || recipes.value.length <= 1) return recipes.value;
  // Filter out the hero recipe from the grid
  return recipes.value.filter((recipe) => recipe.id !== heroRecipe.value?.id);
});

// SEO
useHead({
  title: computed(() => t('seo.home.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('seo.home.description')),
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="mb-4 text-4xl">🍳</div>
        <p class="text-lg text-gray-600">
          {{ t('recipes.loading') }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex min-h-screen items-center justify-center"
    >
      <div class="text-center">
        <div class="mb-4 text-4xl">⚠️</div>
        <p class="text-lg text-red-600">
          {{ t('recipes.error') }}
        </p>
        <p class="mt-2 text-sm text-gray-500">
          {{ error }}
        </p>
        <UButton
          class="mt-4"
          color="primary"
          :label="t('recipes.retry')"
          @click="refresh"
        />
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="recipes && recipes.length > 0">
      <!-- Hero Section -->
      <section
        v-if="heroRecipe"
        class="relative flex min-h-[600px] items-center justify-center overflow-hidden"
      >
        <div class="absolute inset-0">
          <NuxtImg
            :src="heroRecipe.image"
            :alt="heroRecipe.name"
            class="h-full w-full object-cover"
            width="1920"
            height="1080"
            loading="eager"
          />
          <!-- Dynamic random overlay -->
          <div :class="overlayClass" />
        </div>
        <div class="container relative z-10 mx-auto px-4 py-20 text-center">
          <h1
            class="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {{ heroRecipe.name }}
          </h1>
          <p
            class="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl"
          >
            {{ heroRecipe.cuisine }} • {{ heroRecipe.difficulty }} •
            {{ heroRecipe.prepTimeMinutes + heroRecipe.cookTimeMinutes }} min
          </p>
          <AppButton
            v-if="heroRecipe.slug"
            :to="`/recipes/${heroRecipe.id}/${heroRecipe.slug}`"
            size="xl"
            :label="t('recipes.viewRecipe')"
            class="px-8 py-3 text-lg"
          />
        </div>
      </section>

      <!-- Recipes Grid Section -->
      <section class="container mx-auto px-4 py-16">
        <div class="mb-12 text-center">
          <h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {{ t('recipes.exploreMore') }}
          </h2>
          <p class="text-lg text-gray-600">
            {{ t('recipes.discover', { count: recipes.length }) }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RecipeCard
            v-for="recipe in remainingRecipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
      </section>
    </template>

    <!-- Empty State -->
    <div v-else class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <div class="mb-4 text-4xl">📝</div>
        <p class="text-lg text-gray-600">
          {{ t('recipes.noRecipes') }}
        </p>
      </div>
    </div>
  </div>
</template>
