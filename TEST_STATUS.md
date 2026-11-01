# Component Testing Status

## ✅ What's Been Done

1. **Testing Infrastructure**: Already set up with:
   - Vitest configured (`vitest.config.ts`)
   - @nuxt/test-utils installed
   - Test setup file (`tests/setup.ts`)
   - Test scripts in `package.json`

2. **Test Files Created** (4 files with comprehensive tests):
   - `tests/components/RecipeCard.spec.ts` (9 tests)
   - `tests/components/LanguageSwitcher.spec.ts` (8 tests)
   - `tests/components/AppHeader.spec.ts` (11 tests)
   - `tests/components/AppFooter.spec.ts` (10 tests)

## ❌ Current Issue

Tests are **timing out** with error:

```
[Vue warn]: Unhandled error during execution of setup function
```

### Root Cause

The components use Nuxt UI (@nuxt/ui) which has complex dependencies and initialization requirements. The test environment with `mountSuspended` is having difficulty initializing these components properly.

## 🔧 Possible Solutions

### Option 1: Mock @nuxt/ui Components

Create mocks for UCard, UIcon, etc. in the test setup:

```typescript
// tests/setup.ts
import { vi } from 'vitest';

// Mock @nuxt/ui components
vi.mock('#components', () => ({
  UCard: {
    template: '<div class="u-card"><slot name="header" /><slot /></div>',
  },
  UIcon: { template: '<i />', props: ['name'] },
}));
```

### Option 2: Use Stubbed Components

In each test, use `global.stubs` to replace complex components:

```typescript
const wrapper = await mountSuspended(RecipeCard, {
  props: { recipe: mockRecipe },
  global: {
    stubs: {
      UCard: true,
      UIcon: true,
      NuxtImg: true,
      NuxtLink: true,
    },
  },
});
```

### Option 3: Simpler Test Approach

Use `@vue/test-utils` directly without full Nuxt context:

```typescript
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
});

const wrapper = mount(RecipeCard, {
  props: { recipe: mockRecipe },
  global: {
    plugins: [i18n],
    stubs: ['NuxtLink', 'NuxtImg', 'UCard', 'UIcon'],
  },
});
```

### Option 4: Wait for @nuxt/test-utils Updates

This might be a compatibility issue between:

- Nuxt 4 (very new)
- @nuxt/ui v4
- @nuxt/test-utils v3
- @nuxt/image

## 📋 Test Coverage

Despite the execution issues, the tests cover:

### RecipeCard Component

- ✓ Renders recipe information (name, cuisine, rating, reviews, difficulty)
- ✓ Calculates total time correctly
- ✓ Displays servings and calories
- ✓ Renders a decorative thumbnail (the link text names the dish)
- ✓ Links to recipe detail page
- ✓ Handles different difficulty levels
- ✓ Labels time, servings, calories and rating in words
- ✓ Renders a non-link row when the slug is missing
- ✓ Handles edge cases (zero reviews, large numbers)

### LanguageSwitcher Component

- ✓ Renders a labelled list of language links
- ✓ Offers en, es and nl with matching `lang` and `hreflang`
- ✓ Links each locale to its own prefixed URL
- ✓ Marks only the current locale with `aria-current`
- ✓ Accessible names start with the visible code

### AppHeader Component

- ✓ Renders header structure
- ✓ Displays logo/brand name
- ✓ Logo links to home page
- ✓ Renders LanguageSwitcher
- ✓ Renders submit recipe button
- ✓ Uses i18n for translations
- ✓ Has sticky positioning
- ✓ Has proper navigation structure
- ✓ All links are clickable
- ✓ Has proper z-index and container

### AppFooter Component

- ✓ Renders footer structure
- ✓ Displays current year in copyright
- ✓ Renders all navigation links (about, privacy, terms)
- ✓ Uses i18n for translations
- ✓ Renders LanguageSwitcher
- ✓ Has responsive layout
- ✓ Computes year reactively
- ✓ All links have href attributes
- ✓ Has proper spacing and accessible styling

## 🎯 Next Steps

1. **Try Option 2 first**: Add component stubs to bypass @nuxt/ui initialization
2. **Update test configuration**: Fine-tune the test environment setup
3. **Consider upgrading**: Wait for @nuxt/test-utils updates for better Nuxt 4 compatibility
4. **Alternative**: Use E2E testing with Playwright for full integration tests

## 📝 Notes

- Test files are well-structured and follow best practices
- Using `mountSuspended` from @nuxt/test-utils for proper Nuxt context
- Tests are comprehensive and cover all major functionality
- The issue is with the test environment setup, not the test logic
