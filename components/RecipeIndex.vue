<script setup lang="ts">
import type { Recipe } from '~/types';

interface Props {
  recipes: Recipe[];
}

const props = defineProps<Props>();
const { t, locale } = useI18n();

const query = ref('');
const normalizedQuery = computed(() => query.value.trim().toLowerCase());

const matchesQuery = (recipe: Recipe): boolean => {
  if (!normalizedQuery.value) return true;
  const haystack = [
    recipe.name,
    recipe.cuisine,
    ...recipe.tags,
    ...recipe.mealType,
    ...recipe.ingredients,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(normalizedQuery.value);
};

const visibleRecipes = computed(() => props.recipes.filter(matchesQuery));

// Group by cuisine, groups and dishes in alphabetical order
const groups = computed(() => {
  const byCuisine = new Map<string, Recipe[]>();
  visibleRecipes.value.forEach((recipe) => {
    byCuisine.set(recipe.cuisine, [
      ...(byCuisine.get(recipe.cuisine) ?? []),
      recipe,
    ]);
  });
  return [...byCuisine.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([cuisine, items]) => ({
      cuisine,
      items: [...items].sort((first, second) =>
        first.name.localeCompare(second.name)
      ),
    }));
});

const isEnglish = computed(() => locale.value === 'en');

const handleClear = (): void => {
  query.value = '';
};
</script>

<template>
  <section
    id="index"
    aria-labelledby="index-title"
    class="page-frame mt-24 scroll-mt-20 sm:mt-40"
  >
    <div class="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
      <h2 id="index-title" v-reveal class="text-head lg:col-span-6">
        {{ t('index.heading') }}
      </h2>
      <div v-reveal="1" class="lg:col-span-6">
        <label for="index-search" class="text-small block font-semibold">
          {{ t('index.searchLabel') }}
        </label>
        <div class="mt-2 flex">
          <input
            id="index-search"
            v-model="query"
            type="search"
            autocomplete="off"
            spellcheck="false"
            aria-describedby="index-count"
            class="min-h-12 w-full min-w-0 border-b-2 border-ink bg-surface px-4 text-ink outline-none focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-[var(--focus)]"
          >
          <button
            v-if="query"
            type="button"
            class="min-h-12 shrink-0 bg-ink px-4 font-semibold text-ground transition-opacity hover:opacity-85"
            @click="handleClear"
          >
            {{ t('index.clear') }}
          </button>
        </div>
        <p
          id="index-count"
          class="text-small mt-2 text-muted"
          aria-live="polite"
        >
          {{
            t('index.count', {
              shown: visibleRecipes.length,
              total: recipes.length,
            })
          }}
          <template v-if="!isEnglish"> · {{ t('index.sourceNote') }}</template>
        </p>
      </div>
    </div>

    <p v-if="groups.length === 0" class="text-lead mt-12">
      {{ t('index.noMatch', { query }) }}
    </p>

    <div v-else class="mt-12 gap-x-12 md:columns-2 xl:columns-3">
      <section
        v-for="(group, groupIndex) in groups"
        :key="group.cuisine"
        v-reveal="groupIndex % 3"
        :aria-labelledby="`cuisine-${createSlug(group.cuisine)}`"
        class="mb-10 break-inside-avoid"
      >
        <h3
          :id="`cuisine-${createSlug(group.cuisine)}`"
          lang="en"
          class="text-small mb-2 font-semibold text-muted"
        >
          {{ group.cuisine }}
        </h3>
        <ul>
          <li v-for="recipe in group.items" :key="recipe.id">
            <RecipeCard :recipe="recipe" />
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>
