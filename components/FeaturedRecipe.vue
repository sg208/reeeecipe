<script setup lang="ts">
import type { Recipe } from '~/types';

interface Props {
  recipe: Recipe;
}

const props = defineProps<Props>();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const { t } = useI18n();
const {
  contentLang,
  formatNumber,
  formatDifficulty,
  formatMinutes,
  totalMinutes,
} = useRecipeLabels();

const href = computed(() =>
  props.recipe.slug
    ? localePath(`/recipes/${props.recipe.id}/${props.recipe.slug}`)
    : null
);

const facts = computed(() => [
  {
    label: t('featured.total'),
    value: formatMinutes(totalMinutes(props.recipe)),
  },
  { label: t('recipeDetail.servings'), value: String(props.recipe.servings) },
  {
    label: t('recipeDetail.calories'),
    value: formatNumber(props.recipe.caloriesPerServing, 0),
  },
]);
</script>

<template>
  <section
    aria-labelledby="featured-title"
    class="page-frame mt-24 grid gap-8 sm:mt-40 lg:grid-cols-12 lg:gap-12"
  >
    <component
      :is="href ? NuxtLink : 'div'"
      v-reveal
      :to="href ?? undefined"
      :tabindex="href ? -1 : undefined"
      aria-hidden="true"
      class="group block overflow-hidden bg-surface lg:col-span-7"
    >
      <NuxtImg
        :src="recipe.image"
        alt=""
        width="900"
        height="900"
        loading="lazy"
        class="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </component>

    <div class="flex flex-col lg:col-span-5 lg:pt-2">
      <h2 id="featured-title" v-reveal class="text-head">
        {{ t('featured.heading') }}
      </h2>
      <h3 v-reveal="1" :lang="contentLang" class="text-lead mt-6 font-semibold">
        <NuxtLink
          v-if="href"
          :to="href"
          class="underline-offset-4 hover:underline"
        >
          {{ recipe.name }}
        </NuxtLink>
        <template v-else>{{ recipe.name }}</template>
      </h3>
      <p v-reveal="1" class="mt-2 text-muted">
        <span :lang="contentLang">{{ recipe.cuisine }}</span>
        · {{ formatDifficulty(recipe.difficulty) }} ·
        {{ t('recipes.rating', { rating: formatNumber(recipe.rating) }) }}
      </p>

      <dl v-reveal="2" class="mt-8 grid grid-cols-3 gap-4">
        <div v-for="fact in facts" :key="fact.label" class="bg-surface p-4">
          <dt class="text-small text-muted">{{ fact.label }}</dt>
          <dd class="tabular mt-1 text-2xl font-extrabold tracking-tight">
            {{ fact.value }}
          </dd>
        </div>
      </dl>

      <p v-reveal="3" :lang="contentLang" class="mt-8 max-w-[60ch]">
        <span class="font-semibold">{{ t('recipeDetail.ingredients') }}:</span>
        {{ recipe.ingredients.join(', ') }}
      </p>

      <AppButton
        v-if="href"
        v-reveal="4"
        :to="href"
        :label="t('featured.read')"
        class="mt-8 self-start"
      />
    </div>
  </section>
</template>
