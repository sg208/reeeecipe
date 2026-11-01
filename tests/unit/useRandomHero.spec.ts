import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { computed, defineComponent, h } from 'vue';
import { useRandomHero } from '~/composables/useRandomHero';
import type { Recipe } from '~/types';

const makeRecipe = (id: number): Recipe => ({
  id,
  name: `Recipe ${id}`,
  ingredients: [],
  instructions: [],
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  servings: 2,
  difficulty: 'Easy',
  cuisine: 'Italian',
  caloriesPerServing: 300,
  tags: [],
  userId: 1,
  image: `/img/${id}.jpg`,
  rating: 4.5,
  reviewCount: 10,
  mealType: ['Dinner'],
});

type HeroState = ReturnType<typeof useRandomHero>;

const mountHero = async (recipes: Recipe[] | undefined): Promise<HeroState> => {
  const state: { hero?: HeroState } = {};
  const Host = defineComponent({
    setup: (): (() => ReturnType<typeof h>) => {
      state.hero = useRandomHero(computed(() => recipes));
      return () => h('div');
    },
  });
  await mountSuspended(Host);
  return state.hero as HeroState;
};

describe('useRandomHero', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null and is ready when there are no recipes', async () => {
    const hero = await mountHero([]);
    expect(hero.heroRecipe.value).toBeNull();
    expect(hero.isReady.value).toBe(true);
  });

  it('picks a recipe based on Math.random after mount', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const hero = await mountHero([makeRecipe(1), makeRecipe(2), makeRecipe(3)]);
    expect(hero.isReady.value).toBe(true);
    expect(hero.heroRecipe.value?.id).toBe(3);
    expect(hero.overlayClass.value).toBe('absolute inset-0 bg-black/70');
  });

  it('picks the first recipe and lightest overlay for a zero roll', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const hero = await mountHero([makeRecipe(1), makeRecipe(2)]);
    expect(hero.heroRecipe.value?.id).toBe(1);
    expect(hero.overlayClass.value).toBe('absolute inset-0 bg-black/30');
  });
});
