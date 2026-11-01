<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onServerPrefetch } from 'vue';
import { useRecipeQuery } from '~/composables/queries/useRecipesQuery';

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { contentLang, formatNumber, formatDifficulty } = useRecipeLabels();

const recipeId = computed(() => Number(route.params.id));
const {
  data: recipe,
  isPending: pending,
  error,
  suspense,
} = useRecipeQuery(recipeId);

// Fetch during prerender so every recipe page ships as complete HTML
onServerPrefetch(async () => {
  try {
    await suspense();
  } catch {
    // The error state renders instead
  }
});

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
  <div class="page-frame">
    <NuxtLink
      :to="localePath('/') + '#index'"
      class="text-small inline-flex min-h-11 items-center gap-2 font-semibold text-muted transition-colors hover:text-ink"
    >
      <Icon
        name="heroicons:arrow-left-20-solid"
        class="h-4 w-4"
        aria-hidden="true"
      />
      {{ t('recipes.backToRecipes') }}
    </NuxtLink>

    <p
      v-if="pending"
      role="status"
      class="text-lead min-h-[60svh] py-16 text-muted"
    >
      {{ t('recipes.loadingRecipe') }}
    </p>

    <div v-else-if="error" role="alert" class="min-h-[60svh] py-16">
      <h1 class="text-head max-w-[18ch]">{{ t('recipes.errorRecipe') }}</h1>
    </div>

    <article v-else-if="recipe" class="pt-4">
      <div class="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div class="shutter overflow-hidden bg-surface lg:col-span-7">
          <NuxtImg
            :src="recipe.image"
            :alt="recipe.name"
            class="aspect-square w-full object-cover"
            width="900"
            height="900"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        <div class="flex flex-col gap-8 lg:col-span-5">
          <div>
            <h1 :lang="contentLang" class="text-head">{{ recipe.name }}</h1>
            <p class="text-lead mt-5 text-muted">
              <span :lang="contentLang">{{ recipe.cuisine }}</span>
              · {{ formatDifficulty(recipe.difficulty) }} ·
              {{ t('recipes.rating', { rating: formatNumber(recipe.rating) }) }}
              ({{ formatNumber(recipe.reviewCount, 0) }}
              {{ t('recipes.reviews') }})
            </p>
          </div>

          <RecipeFacts :recipe="recipe" />

          <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div v-if="recipe.mealType.length > 0">
              <dt class="text-small font-semibold">
                {{ t('recipeDetail.mealType') }}
              </dt>
              <dd :lang="contentLang" class="mt-1 text-muted">
                {{ recipe.mealType.join(', ') }}
              </dd>
            </div>
            <div v-if="recipe.tags.length > 0">
              <dt class="text-small font-semibold">
                {{ t('recipeDetail.tags') }}
              </dt>
              <dd :lang="contentLang" class="mt-1 text-muted">
                {{ recipe.tags.join(', ') }}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="ingredients-title">
            <h2 id="ingredients-title" class="text-lead font-extrabold">
              {{ t('recipeDetail.ingredients') }}
            </h2>
            <ul :lang="contentLang" class="mt-4 bg-surface px-6 py-4">
              <li
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="py-1.5"
              >
                {{ ingredient }}
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div class="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12">
        <section aria-labelledby="method-title" class="lg:col-span-7">
          <h2 id="method-title" v-reveal class="text-lead font-extrabold">
            {{ t('recipeDetail.instructions') }}
          </h2>
          <ol
            v-reveal="1"
            :lang="contentLang"
            class="method mt-5 list-decimal space-y-5 pl-7 leading-relaxed marker:font-extrabold marker:text-accent"
          >
            <li
              v-for="(instruction, index) in recipe.instructions"
              :key="index"
              class="pl-2"
            >
              {{ instruction }}
            </li>
          </ol>
        </section>
      </div>
    </article>
  </div>
</template>
