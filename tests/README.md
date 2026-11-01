# Testing Guide

This project uses **Component Tests** with Vitest and `@nuxt/test-utils` to test Vue components with full Nuxt context.

## Component Tests (`tests/components/`)

Component tests use `@nuxt/test-utils` to test Vue components with full Nuxt context (auto-imports, plugins, composables, etc.).

**Example:** Testing Vue components like `PropertyCard`, `RecipeCard`, `LanguageSwitcher`, etc.

### Run component tests

```bash
pnpm test
```

or specifically:

```bash
pnpm test:component
```

### Watch Mode

Run tests in watch mode for development:

```bash
pnpm test:watch
```

### Test UI

Open Vitest UI for interactive testing:

```bash
pnpm test:ui
```

### Coverage Report

Generate coverage report:

```bash
pnpm test:coverage
```

Coverage reports will be generated in `coverage/` directory.

## Example Component Test

```typescript
// tests/components/PropertyCard.spec.ts
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import PropertyCard from '~/components/PropertyCard.vue';

describe('PropertyCard Component', () => {
  it('renders property information correctly', async () => {
    const mockProperty = {
      id: '1',
      title: 'Modern Luxury Villa',
      price: 2500000,
      location: 'Beverly Hills, CA',
      bedrooms: 5,
      bathrooms: 4,
      area: 3500,
    };

    const wrapper = await mountSuspended(PropertyCard, {
      props: { property: mockProperty },
    });

    expect(wrapper.text()).toContain('Modern Luxury Villa');
    expect(wrapper.text()).toContain('Beverly Hills, CA');
  });

  it('emits click event when card is clicked', async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { property: mockProperty },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

## Test Structure

```
tests/
├── setup.ts              # Test setup and mocks
└── components/           # Component tests
    ├── PropertyCard.spec.ts
    ├── RecipeCard.spec.ts
    └── ContactForm.spec.ts
```

## Configuration Files

- `vitest.config.ts` - Configuration for Vitest (component tests)
- `tests/setup.ts` - Global test setup (mocks, globals, etc.)

## Writing Component Tests

### Best Practices

- Use `mountSuspended()` from `@nuxt/test-utils/runtime` for proper Nuxt context
- Test component behavior, not implementation details
- Mock external dependencies when needed (API calls, etc.)
- Test user interactions (clicks, inputs, form submissions, etc.)
- Test conditional rendering and edge cases
- Use semantic queries (text, role, label, etc.)
- Keep tests focused and readable

### Key Testing Patterns

#### Testing Props

```typescript
const wrapper = await mountSuspended(MyComponent, {
  props: {
    title: 'Test Title',
    count: 5,
  },
});

expect(wrapper.text()).toContain('Test Title');
```

#### Testing Events

```typescript
await wrapper.find('button').trigger('click');
expect(wrapper.emitted('submit')).toBeTruthy();
expect(wrapper.emitted('submit')?.[0]).toEqual([{ id: 1 }]);
```

#### Testing User Input

```typescript
const input = wrapper.find('input[type="text"]');
await input.setValue('New Value');
await input.trigger('blur');

expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New Value']);
```

#### Testing Conditional Rendering

```typescript
expect(wrapper.find('.loading-state').exists()).toBe(true);
await wrapper.setProps({ loading: false });
expect(wrapper.find('.loading-state').exists()).toBe(false);
```

#### Testing Composables

```typescript
import { mountSuspended } from '@nuxt/test-utils/runtime';

const wrapper = await mountSuspended(MyComponent);

// Composables are auto-imported and work normally
expect(wrapper.vm.$route).toBeDefined();
```

## Continuous Integration

Tests can be run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    pnpm install
    pnpm test
```

## Troubleshooting

### Component Tests Failing

1. Ensure `@nuxt/test-utils` is properly installed
2. Check that Nuxt modules are properly configured
3. Verify component imports are correct (use `~/` alias)
4. Make sure `tests/setup.ts` is properly configured
5. Check for missing dependencies in test environment

### TypeScript Errors

1. Verify `tsconfig.json` includes test files
2. Check that types are properly imported
3. Run `pnpm type-check` to verify TypeScript compilation

### Mock Issues

1. Check `tests/setup.ts` for global mocks
2. Use `vi.mock()` to mock modules in individual tests
3. Ensure mocks are reset between tests with `vi.clearAllMocks()`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [@nuxt/test-utils Documentation](https://nuxt.com/docs/getting-started/testing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
