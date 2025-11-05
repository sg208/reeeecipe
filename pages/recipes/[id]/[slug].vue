<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRecipeQuery } from '~/composables/queries/useRecipesQuery';

const { t } = useI18n();
const route = useRoute();

// Extract ID from route params
const recipeId = computed(() => Number(route.params.id));

// Fetch single recipe using TanStack Query
const { data: recipe, isPending: pending, error } = useRecipeQuery(recipeId);

// SEO
useHead({
  title: computed(() =>
    recipe.value
      ? t('seo.recipeDetail.title', { recipeName: recipe.value.name })
      : t('seo.recipeDetail.titleFallback')
  ),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        recipe.value
          ? t('seo.recipeDetail.description', {
              recipeName: recipe.value.name,
              cuisine: recipe.value.cuisine,
              difficulty: recipe.value.difficulty,
              time: recipe.value.prepTimeMinutes + recipe.value.cookTimeMinutes,
            })
          : t('seo.recipeDetail.descriptionFallback')
      ),
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="container mx-auto px-4 py-16">
      <div class="text-center">
        <div class="mb-4 text-4xl">🍳</div>
        <p class="text-lg text-gray-600">
          {{ t('recipes.loadingRecipe') }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-16">
      <div class="text-center">
        <div class="mb-4 text-4xl">⚠️</div>
        <p class="text-lg text-red-600">
          {{ t('recipes.errorRecipe') }}
        </p>
        <NuxtLink
          to="/"
          class="mt-4 inline-block text-primary-600 hover:underline"
        >
          ← {{ t('recipes.backToRecipes') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <NuxtLink
        to="/"
        class="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-600"
      >
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        <span>{{ t('recipes.backToRecipes') }}</span>
      </NuxtLink>

      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Recipe Image -->
        <div>
          <div class="overflow-hidden rounded-lg">
            <NuxtImg
              :src="recipe.image"
              :alt="recipe.name"
              class="h-full w-full object-cover"
              width="800"
              height="600"
              loading="eager"
            />
          </div>
        </div>

        <!-- Recipe Info -->
        <div class="space-y-6">
          <div>
            <h1 class="mb-4 text-4xl font-bold text-gray-900">
              {{ recipe.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:map-pin" class="h-5 w-5 text-gray-500" />
                <span class="text-gray-600">
                  {{ recipe.cuisine }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:star" class="h-5 w-5 text-yellow-500" />
                <span class="text-gray-600">
                  {{ recipe.rating }} ({{ recipe.reviewCount }}
                  {{ t('recipes.reviews') }})
                </span>
              </div>
              <span
                class="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
              >
                {{ recipe.difficulty }}
              </span>
            </div>
          </div>

          <!-- Recipe Stats -->
          <div
            class="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-4"
          >
            <div>
              <div class="text-sm text-gray-600">
                {{ t('recipeDetail.prepTime') }}
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ recipe.prepTimeMinutes }} {{ t('recipes.minutes') }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600">
                {{ t('recipeDetail.cookTime') }}
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ recipe.cookTimeMinutes }} {{ t('recipes.minutes') }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600">
                {{ t('recipeDetail.servings') }}
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ recipe.servings }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600">
                {{ t('recipeDetail.calories') }}
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ recipe.caloriesPerServing }}
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="recipe.tags.length > 0">
            <div class="mb-2 text-sm font-medium text-gray-700">
              {{ t('recipeDetail.tags') }}
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in recipe.tags"
                :key="tag"
                class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Meal Types -->
          <div v-if="recipe.mealType.length > 0">
            <div class="mb-2 text-sm font-medium text-gray-700">
              {{ t('recipeDetail.mealType') }}
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="mealType in recipe.mealType"
                :key="mealType"
                class="rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-700"
              >
                {{ mealType }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ingredients and Instructions -->
      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <!-- Ingredients -->
        <div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900">
            {{ t('recipeDetail.ingredients') }}
          </h2>
          <ul class="list-disc space-y-2 pl-6">
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="text-gray-700"
            >
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <!-- Instructions -->
        <div>
          <h2 class="mb-4 text-2xl font-bold text-gray-900">
            {{ t('recipeDetail.instructions') }}
          </h2>
          <ol class="list-decimal space-y-4 pl-6">
            <li
              v-for="(instruction, index) in recipe.instructions"
              :key="index"
              class="text-gray-700"
            >
              {{ instruction }}
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
