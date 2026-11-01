<script setup lang="ts">
import type { Recipe } from '~/types';

interface Props {
  recipes: Recipe[];
  cuisineCount: number;
}

const props = defineProps<Props>();
const { t } = useI18n();

const RATIOS = ['4 / 5', '1 / 1', '3 / 4', '5 / 4'] as const;
const OFFSETS = ['0px', '-90px', '-130px', '-20px'] as const;
const SIDE_COLUMNS = 4;
const PER_COLUMN = 4;

// Four side columns of frames, then two pairs above and below the text cell
const sideColumns = computed(() =>
  Array.from({ length: SIDE_COLUMNS }, (_, column) =>
    props.recipes.slice(column * PER_COLUMN, (column + 1) * PER_COLUMN)
  )
);
const middleTop = computed(() => props.recipes.slice(16, 18));
const middleBottom = computed(() => props.recipes.slice(18, 20));

// Column 1 and 2 sit left of the cell, 3 and 4 right of it
const columnClass = (column: number): string =>
  [
    'lg:order-none',
    column === 0 ? 'order-2' : '',
    column === 1 ? 'order-3' : '',
    column === 2 ? 'order-4 hidden md:block' : '',
    column === 3 ? 'hidden lg:block' : '',
  ].join(' ');
</script>

<template>
  <section
    aria-labelledby="home-title"
    class="page-frame grid grid-cols-2 gap-2 pb-4 md:grid-cols-3 lg:h-[clamp(36rem,calc(100svh-4rem),56rem)] lg:grid-cols-[1fr_1fr_1.45fr_1.45fr_1fr_1fr] lg:gap-3 lg:overflow-hidden"
  >
    <template v-for="(column, columnIndex) in sideColumns" :key="columnIndex">
      <div
        v-if="columnIndex === 2"
        class="order-1 col-span-full flex flex-col gap-3 lg:order-none lg:col-span-2 lg:h-full"
      >
        <div
          aria-hidden="true"
          class="hidden h-[calc(28%-0.75rem)] shrink-0 grid-cols-2 grid-rows-[minmax(0,1fr)] gap-3 lg:grid"
        >
          <SheetFrame
            v-for="(recipe, index) in middleTop"
            :key="recipe.id"
            :recipe="recipe"
            :tone="index + 2"
            should-fill
          />
        </div>

        <div
          v-reveal
          class="flex shrink-0 flex-col bg-[var(--panel-bg)] p-6 text-[var(--panel-fg)] sm:p-8 lg:min-h-[25.5rem] lg:p-6 xl:p-8"
        >
          <h1
            id="home-title"
            class="text-[clamp(2rem,1rem+2.6vw,3.5rem)] font-extrabold leading-none tracking-[-0.04em] text-balance"
          >
            {{ t('home.title') }}
          </h1>
          <p class="text-lead mt-5 max-w-[34ch]">
            {{ t('home.lede', { cuisines: cuisineCount }) }}
          </p>
          <a
            href="#index"
            class="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-[var(--panel-action-bg)] px-5 font-semibold text-[var(--panel-action-fg)] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:self-start"
          >
            {{ t('home.browse') }}
          </a>
          <p class="text-small mt-auto pt-8 opacity-80">
            {{
              t('home.facts', {
                dishes: recipes.length,
                cuisines: cuisineCount,
              })
            }}
          </p>
        </div>

        <div
          aria-hidden="true"
          class="hidden min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)] gap-3 lg:grid"
        >
          <SheetFrame
            v-for="(recipe, index) in middleBottom"
            :key="recipe.id"
            :recipe="recipe"
            :tone="index + 1"
            should-fill
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        class="h-[30rem] overflow-hidden lg:h-auto"
        :class="columnClass(columnIndex)"
      >
        <div
          class="sheet-drift flex flex-col gap-2 lg:gap-3"
          :style="{
            transform: `translateY(${OFFSETS[columnIndex]})`,
            animationDelay: `${columnIndex * 90}ms`,
          }"
        >
          <SheetFrame
            v-for="(recipe, index) in column"
            :key="recipe.id"
            :recipe="recipe"
            :tone="index + columnIndex"
            :ratio="RATIOS[(index + columnIndex) % RATIOS.length]"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
/* The sheet settles into place once, column by column */
@keyframes sheet-drift {
  from {
    opacity: 0;
    translate: 0 48px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
.sheet-drift {
  animation: sheet-drift 1.2s var(--ease-out) both;
}
</style>
