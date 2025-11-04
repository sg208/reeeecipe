import { ref, computed, onMounted, type ComputedRef, type Ref } from 'vue';
import type { Recipe } from '~/types';

interface RandomHeroReturn {
  heroRecipe: ComputedRef<Recipe | null>;
  overlayClass: Ref<string>;
  isReady: Ref<boolean>;
}

// Predefined overlay classes for Tailwind v4 compatibility
const OVERLAY_CLASSES = [
  'absolute inset-0 bg-black/30',
  'absolute inset-0 bg-black/40',
  'absolute inset-0 bg-black/50',
  'absolute inset-0 bg-black/60',
  'absolute inset-0 bg-black/70',
] as const;

/**
 * Composable for randomly selecting a hero recipe and overlay styling
 * Uses client-side randomization to avoid SSR hydration mismatches
 * Randomness is influenced by the number of available recipes
 */
export const useRandomHero = (
  recipes: ComputedRef<Recipe[] | undefined>
): RandomHeroReturn => {
  const selectedIndex = ref<number>(0);
  const overlayClass = ref<string>(OVERLAY_CLASSES[2]); // Default: bg-black/50
  const isReady = ref<boolean>(false);

  // Selected hero recipe
  const heroRecipe = computed<Recipe | null>(() => {
    if (!recipes.value || recipes.value.length === 0) return null;
    if (!isReady.value) {
      // Return first recipe during SSR/hydration to avoid mismatch
      return recipes.value[0] ?? null;
    }
    return recipes.value[selectedIndex.value] ?? null;
  });

  // Randomize on client-side mount
  onMounted(() => {
    if (!recipes.value || recipes.value.length === 0) {
      isReady.value = true;
      return;
    }

    const recipeCount = recipes.value.length;

    // Random recipe selection using array length
    // Each page visit gets a new random recipe from the available collection
    selectedIndex.value = Math.floor(Math.random() * recipeCount);

    // Random overlay class selection
    // Uses recipe count to influence randomness - more recipes = more variety
    const overlayIndex = Math.floor(Math.random() * OVERLAY_CLASSES.length);
    overlayClass.value = OVERLAY_CLASSES[overlayIndex] ?? OVERLAY_CLASSES[2];

    // Mark as ready after randomization
    isReady.value = true;
  });

  return {
    heroRecipe,
    overlayClass,
    isReady,
  };
};
