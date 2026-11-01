import type { ComputedRef } from 'vue';
import type { Recipe } from '~/types';

interface RecipeLabels {
  contentLang: ComputedRef<string | undefined>;
  formatNumber: (value: number, maximumFractionDigits?: number) => string;
  formatDifficulty: (difficulty: string) => string;
  formatMinutes: (minutes: number) => string;
  totalMinutes: (recipe: Recipe) => number;
}

/**
 * Locale-aware labels for recipe data. Recipe text comes from the API in
 * English, so `contentLang` marks it as English when the UI is not.
 */
export const useRecipeLabels = (): RecipeLabels => {
  const { t, te, locale } = useI18n();

  const contentLang = computed(() =>
    locale.value === 'en' ? undefined : 'en'
  );

  const formatNumber = (value: number, maximumFractionDigits = 1): string =>
    new Intl.NumberFormat(locale.value, { maximumFractionDigits }).format(
      value
    );

  const formatDifficulty = (difficulty: string): string => {
    const key = `difficulty.${difficulty}`;
    return te(key) ? t(key) : difficulty;
  };

  const formatMinutes = (minutes: number): string =>
    `${formatNumber(minutes, 0)} ${t('recipes.minutes')}`;

  const totalMinutes = (recipe: Recipe): number =>
    recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return {
    contentLang,
    formatNumber,
    formatDifficulty,
    formatMinutes,
    totalMinutes,
  };
};
