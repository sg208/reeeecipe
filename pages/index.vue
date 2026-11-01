<script setup lang="ts">
import { computed, onServerPrefetch } from 'vue';
import { useRecipesQuery } from '~/composables/queries/useRecipesQuery';
import { useRandomHero } from '~/composables/useRandomHero';

const { t } = useI18n();

const {
  data: recipes,
  isPending: pending,
  error,
  refetch: refresh,
  suspense,
} = useRecipesQuery();

// Fetch during prerender so the HTML (and the crawler) gets the recipes
onServerPrefetch(async () => {
  try {
    await suspense();
  } catch {
    // The error state renders instead
  }
});

// A different recipe is featured on every visit (picked after hydration)
const { heroRecipe } = useRandomHero(recipes);

const cuisineCount = computed(
  () => new Set(recipes.value?.map((recipe) => recipe.cuisine)).size
);

const handleRetry = (): void => {
  void refresh();
};

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
  <div>
    <div
      v-if="pending"
      class="page-frame flex min-h-[60svh] items-center"
      role="status"
    >
      <p class="text-lead text-muted">{{ t('recipes.loading') }}</p>
    </div>

    <div v-else-if="error" class="page-frame min-h-[60svh] py-24" role="alert">
      <h1 class="text-head max-w-[18ch]">{{ t('recipes.error') }}</h1>
      <p class="mt-4 text-muted">{{ error.message }}</p>
      <AppButton
        class="mt-8"
        :label="t('recipes.retry')"
        @click="handleRetry"
      />
    </div>

    <template v-else-if="recipes && recipes.length > 0">
      <HomeSheet :recipes="recipes" :cuisine-count="cuisineCount" />
      <FeaturedRecipe v-if="heroRecipe" :recipe="heroRecipe" />
      <RecipeIndex :recipes="recipes" />
    </template>

    <div v-else class="page-frame min-h-[60svh] py-24">
      <h1 class="text-head">{{ t('recipes.noRecipes') }}</h1>
    </div>
  </div>
</template>
