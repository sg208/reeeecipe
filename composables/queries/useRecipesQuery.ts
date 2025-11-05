import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, type ComputedRef } from 'vue';
import type { Recipe, RecipesResponse } from '~/types';
import { createSlug } from '~/utils/slugify';

// Query keys factory
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: () => [...recipeKeys.lists()] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: number) => [...recipeKeys.details(), id] as const,
};

// Helper to add slug to recipe
const addSlugToRecipe = (recipe: Recipe): Recipe => ({
  ...recipe,
  slug: createSlug(recipe.name),
});

// Fetch all recipes
export const useRecipesQuery = (): ReturnType<typeof useQuery<Recipe[]>> => {
  return useQuery({
    queryKey: recipeKeys.list(),
    queryFn: async (): Promise<Recipe[]> => {
      const response = await $fetch<RecipesResponse>(
        'https://dummyjson.com/recipes'
      );

      if (!response || !response.recipes || !Array.isArray(response.recipes)) {
        throw new Error('Invalid response from recipes API');
      }

      // Add slug to each recipe
      return response.recipes.map(addSlugToRecipe);
    },
  });
};

// Fetch single recipe with cache fallback
export const useRecipeQuery = (
  recipeId: ComputedRef<number> | number
): ReturnType<typeof useQuery<Recipe>> => {
  const queryClient = useQueryClient();
  const id = computed(() =>
    typeof recipeId === 'number' ? recipeId : recipeId.value
  );

  return useQuery({
    queryKey: computed(() => recipeKeys.detail(id.value)),
    queryFn: async (): Promise<Recipe> => {
      // First, try to get from cache (recipes list)
      const cachedRecipes = queryClient.getQueryData<Recipe[]>(
        recipeKeys.list()
      );

      if (cachedRecipes) {
        const cachedRecipe = cachedRecipes.find((r) => r.id === id.value);
        if (cachedRecipe) {
          return cachedRecipe;
        }
      }

      // Fallback to API if not in cache or cache expired
      const response = await $fetch<Recipe>(
        `https://dummyjson.com/recipes/${id.value}`
      );
      return addSlugToRecipe(response);
    },
    enabled: computed(() => !!id.value),
  });
};
