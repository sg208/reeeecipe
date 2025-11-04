import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import RecipeCard from '~/components/RecipeCard.vue';
import type { Recipe } from '~/types';

describe('RecipeCard Component', () => {
  const mockRecipe: Recipe = {
    id: 1,
    name: 'Classic Margherita Pizza',
    ingredients: ['Tomatoes', 'Mozzarella', 'Basil'],
    instructions: ['Prepare dough', 'Add toppings', 'Bake'],
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Italian',
    caloriesPerServing: 250,
    tags: ['vegetarian', 'italian'],
    userId: 1,
    image: 'https://example.com/pizza.jpg',
    rating: 4.5,
    reviewCount: 127,
    mealType: ['Dinner'],
  };

  it('renders recipe information correctly', async () => {
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: mockRecipe },
    });

    // Check if recipe name is displayed
    expect(wrapper.text()).toContain('Classic Margherita Pizza');

    // Check if cuisine is displayed
    expect(wrapper.text()).toContain('Italian');

    // Check if rating is displayed
    expect(wrapper.text()).toContain('4.5');

    // Check if review count is displayed
    expect(wrapper.text()).toContain('(127)');

    // Check if difficulty is displayed
    expect(wrapper.text()).toContain('Easy');
  });

  it('calculates total time correctly', async () => {
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: mockRecipe },
    });

    // Total time should be prepTimeMinutes + cookTimeMinutes (20 + 15 = 35)
    expect(wrapper.text()).toContain('35');
  });

  it('displays servings and calories per serving', async () => {
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: mockRecipe },
    });

    expect(wrapper.text()).toContain('4'); // servings
    expect(wrapper.text()).toContain('250'); // calories
  });

  it('renders recipe image with correct attributes', async () => {
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: mockRecipe },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('alt')).toBe('Classic Margherita Pizza');
  });

  it('wraps content in NuxtLink with correct route', async () => {
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: mockRecipe },
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/recipes/1');
  });

  it('renders with different difficulty levels', async () => {
    const easyRecipe: Recipe = { ...mockRecipe, difficulty: 'Easy' };
    const wrapperEasy = await mountSuspended(RecipeCard, {
      props: { recipe: easyRecipe },
    });
    expect(wrapperEasy.text()).toContain('Easy');

    const mediumRecipe: Recipe = { ...mockRecipe, difficulty: 'Medium' };
    const wrapperMedium = await mountSuspended(RecipeCard, {
      props: { recipe: mediumRecipe },
    });
    expect(wrapperMedium.text()).toContain('Medium');

    const hardRecipe: Recipe = { ...mockRecipe, difficulty: 'Hard' };
    const wrapperHard = await mountSuspended(RecipeCard, {
      props: { recipe: hardRecipe },
    });
    expect(wrapperHard.text()).toContain('Hard');
  });

  it('displays icons for time, servings, and calories', async () => {
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: mockRecipe },
    });

    // Check for icon elements by looking for svg or their container classes
    const html = wrapper.html();

    // Icons should be present in the markup
    expect(html).toContain('heroicons:star');
    expect(html).toContain('heroicons:clock');
    expect(html).toContain('heroicons:users');
    expect(html).toContain('heroicons:fire');
  });

  it('handles zero review count', async () => {
    const recipeNoReviews: Recipe = {
      ...mockRecipe,
      reviewCount: 0,
      rating: 0,
    };
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: recipeNoReviews },
    });

    expect(wrapper.text()).toContain('(0)');
    expect(wrapper.text()).toContain('0'); // rating
  });

  it('handles large numbers for calories and servings', async () => {
    const largeRecipe: Recipe = {
      ...mockRecipe,
      servings: 12,
      caloriesPerServing: 1250,
    };
    const wrapper = await mountSuspended(RecipeCard, {
      props: { recipe: largeRecipe },
    });

    expect(wrapper.text()).toContain('12');
    expect(wrapper.text()).toContain('1250');
  });
});
