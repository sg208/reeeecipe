<script setup lang="ts">
import type { Recipe } from '~/types';

interface Props {
  recipe: Recipe;
  tone: number;
  ratio?: string;
  shouldFill?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  ratio: '4 / 5',
  shouldFill: false,
});

const { contentLang } = useRecipeLabels();
const localePath = useLocalePath();

const toneStyle = computed(() => {
  const index = (props.tone % 4) + 1;
  return {
    backgroundColor: `var(--strip-${index}-bg)`,
    color: `var(--strip-${index}-fg)`,
  };
});
</script>

<template>
  <NuxtLink
    :to="localePath(recipe.slug ? `/recipes/${recipe.id}/${recipe.slug}` : '/')"
    tabindex="-1"
    class="sheet-frame group flex flex-col"
    :class="shouldFill ? 'h-full' : ''"
  >
    <span
      class="block overflow-hidden bg-surface"
      :class="shouldFill ? 'relative min-h-0 flex-1' : ''"
      :style="shouldFill ? undefined : { aspectRatio: ratio }"
    >
      <NuxtImg
        :src="recipe.image"
        alt=""
        width="360"
        height="450"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        :class="shouldFill ? 'absolute inset-0' : ''"
      />
    </span>
    <span
      :lang="contentLang"
      class="text-small block h-7 truncate px-2 font-semibold leading-7"
      :style="toneStyle"
    >
      {{ recipe.name }}
    </span>
  </NuxtLink>
</template>
