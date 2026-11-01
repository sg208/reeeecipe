<script setup lang="ts">
import type { Recipe } from '~/types';

interface Props {
  recipe: Recipe;
}

const props = defineProps<Props>();
const localePath = useLocalePath();

const { t } = useI18n();
const {
  contentLang,
  formatNumber,
  formatDifficulty,
  formatMinutes,
  totalMinutes,
} = useRecipeLabels();

const NuxtLink = resolveComponent('NuxtLink');

const href = computed(() =>
  props.recipe.slug
    ? localePath(`/recipes/${props.recipe.id}/${props.recipe.slug}`)
    : null
);
</script>

<template>
  <component
    :is="href ? NuxtLink : 'div'"
    :to="href ?? undefined"
    class="recipe-row group grid grid-cols-[3.5rem_1fr_auto] items-center gap-x-4 py-2.5 sm:py-2"
    :class="href ? 'hover:bg-surface' : 'cursor-not-allowed opacity-60'"
  >
    <span class="block h-14 w-14 overflow-hidden bg-surface">
      <NuxtImg
        :src="recipe.image"
        alt=""
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        width="112"
        height="112"
        loading="lazy"
      />
    </span>

    <span class="min-w-0">
      <span :lang="contentLang" class="block font-semibold leading-snug">
        {{ recipe.name }}
      </span>
      <span class="text-small block text-muted">
        <span :lang="contentLang">{{ recipe.cuisine }}</span>
        · {{ formatDifficulty(recipe.difficulty) }} ·
        {{ t('recipes.rating', { rating: formatNumber(recipe.rating) }) }}
        ({{ formatNumber(recipe.reviewCount, 0) }}) · {{ recipe.servings }}
        {{ t('recipes.servings') }} ·
        {{ formatNumber(recipe.caloriesPerServing, 0) }}
        {{ t('recipes.calories') }}
      </span>
    </span>

    <span class="text-small tabular self-start pt-0.5 text-right text-muted">
      {{ formatMinutes(totalMinutes(recipe)) }}
    </span>
  </component>
</template>

<style scoped>
.recipe-row {
  margin-inline: -0.5rem;
  padding-inline: 0.5rem;
  transition: background-color 0.2s ease;
}
</style>
