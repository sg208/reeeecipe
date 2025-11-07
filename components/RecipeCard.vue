<script setup lang="ts">
import type { Recipe } from '~/types';

const { t } = useI18n();

interface Props {
  recipe: Recipe;
}

defineProps<Props>();
</script>

<template>
  <NuxtLinkLocale
    v-if="recipe.slug"
    :to="{
      name: 'recipes-id-slug',
      params: { id: recipe.id, slug: recipe.slug },
    }"
    class="block h-full"
  >
    <UCard class="recipe-card h-full transition-all hover:shadow-lg">
      <template #header>
        <div class="relative h-48 overflow-hidden rounded-t-lg">
          <NuxtImg
            :src="recipe.image"
            :alt="recipe.name"
            class="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            width="800"
            height="600"
            loading="lazy"
          />
        </div>
      </template>

      <div class="space-y-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
            {{ recipe.name }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ recipe.cuisine }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:star" class="h-4 w-4 text-yellow-500" />
            <span class="text-sm font-medium text-gray-900">
              {{ recipe.rating }}
            </span>
            <span class="text-sm text-gray-500">
              ({{ recipe.reviewCount }})
            </span>
          </div>
          <span
            class="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
          >
            {{ recipe.difficulty }}
          </span>
        </div>

        <div class="flex items-center gap-4 border-t border-gray-200 pt-3">
          <div class="flex items-center gap-1">
            <Icon name="heroicons:clock" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600">
              {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }}
              {{ t('recipes.minutes') }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="heroicons:users" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600">
              {{ recipe.servings }} {{ t('recipes.servings') }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="heroicons:fire" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600">
              {{ recipe.caloriesPerServing }} {{ t('recipes.calories') }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLinkLocale>

  <!-- Fallback when slug is not available -->
  <div v-else class="block h-full cursor-not-allowed opacity-50">
    <UCard class="recipe-card h-full">
      <template #header>
        <div class="relative h-48 overflow-hidden rounded-t-lg">
          <NuxtImg
            :src="recipe.image"
            :alt="recipe.name"
            class="h-full w-full object-cover"
            width="800"
            height="600"
            loading="lazy"
          />
        </div>
      </template>

      <div class="space-y-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
            {{ recipe.name }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ recipe.cuisine }}
          </p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:star" class="h-4 w-4 text-yellow-500" />
            <span class="text-sm font-medium text-gray-900">
              {{ recipe.rating }}
            </span>
            <span class="text-sm text-gray-500">
              ({{ recipe.reviewCount }})
            </span>
          </div>
          <span
            class="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
          >
            {{ recipe.difficulty }}
          </span>
        </div>

        <div class="flex items-center gap-4 border-t border-gray-200 pt-3">
          <div class="flex items-center gap-1">
            <Icon name="heroicons:clock" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600">
              {{ recipe.prepTimeMinutes + recipe.cookTimeMinutes }}
              {{ t('recipes.minutes') }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="heroicons:users" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600">
              {{ recipe.servings }} {{ t('recipes.servings') }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="heroicons:fire" class="h-4 w-4 text-gray-500" />
            <span class="text-sm text-gray-600">
              {{ recipe.caloriesPerServing }} {{ t('recipes.calories') }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
.recipe-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.recipe-card:hover {
  transform: translateY(-4px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
