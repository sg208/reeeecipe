import { describe, it, expect } from 'vitest';
import { recipeKeys } from '~/composables/queries/useRecipesQuery';

describe('recipeKeys', () => {
  it('builds hierarchical list keys', () => {
    expect(recipeKeys.all).toEqual(['recipes']);
    expect(recipeKeys.list()).toEqual(['recipes', 'list']);
  });

  it('builds detail keys scoped by id', () => {
    expect(recipeKeys.detail(7)).toEqual(['recipes', 'detail', 7]);
  });

  it('nests detail keys under the base key for invalidation', () => {
    const detailKey = recipeKeys.detail(1);
    expect(detailKey.slice(0, recipeKeys.all.length)).toEqual([
      ...recipeKeys.all,
    ]);
  });
});
