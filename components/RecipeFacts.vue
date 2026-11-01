<script setup lang="ts">
import type { Recipe } from '~/types';

interface Props {
  recipe: Recipe;
}

const props = defineProps<Props>();
const { t } = useI18n();
const { formatNumber, formatMinutes } = useRecipeLabels();

const facts = computed(() => [
  {
    label: t('recipeDetail.prepTime'),
    value: formatMinutes(props.recipe.prepTimeMinutes),
  },
  {
    label: t('recipeDetail.cookTime'),
    value: formatMinutes(props.recipe.cookTimeMinutes),
  },
  { label: t('recipeDetail.servings'), value: String(props.recipe.servings) },
  {
    label: t('recipeDetail.calories'),
    value: formatNumber(props.recipe.caloriesPerServing, 0),
  },
]);
</script>

<template>
  <dl
    class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
  >
    <div v-for="fact in facts" :key="fact.label" class="bg-surface p-4">
      <dt class="text-small text-muted">{{ fact.label }}</dt>
      <dd class="tabular mt-1 text-2xl font-extrabold tracking-tight">
        {{ fact.value }}
      </dd>
    </div>
  </dl>
</template>
