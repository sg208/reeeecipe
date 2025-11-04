# AppButton Component

## Overview

`AppButton` is a reusable button component with consistent orange-600 styling throughout the application. It wraps Nuxt UI's `UButton` component and applies standardized colors and behavior.

## Features

- ✅ **Consistent Orange Styling**: Automatically applies `bg-orange-600`, `text-white`, and hover states
- ✅ **Dual Mode**: Works as both a navigation link (with `to` prop) or action button (with `@click` event)
- ✅ **Fully Typed**: Complete TypeScript support with proper prop and event typing
- ✅ **Accessible**: Inherits all accessibility features from Nuxt UI's UButton
- ✅ **Flexible**: Supports all standard button features (disabled, loading, icons, sizes, etc.)
- ✅ **Tested**: Comprehensive test coverage (14/14 tests passing)

## Installation

The component is auto-imported in Nuxt 4, so no manual import needed!

## Usage Examples

### Basic Navigation Button

```vue
<AppButton to="/submit-recipe" label="Submit Recipe" />
```

### Action Button with Click Handler

```vue
<script setup lang="ts">
const handleSave = () => {
  console.log('Saving...');
};
</script>

<template>
  <AppButton label="Save" @click="handleSave" />
</template>
```

### With Different Sizes

```vue
<!-- Extra Small -->
<AppButton label="XS Button" size="xs" />

<!-- Small -->
<AppButton label="Small Button" size="sm" />

<!-- Medium (Default) -->
<AppButton label="Medium Button" />

<!-- Large -->
<AppButton label="Large Button" size="lg" />

<!-- Extra Large -->
<AppButton label="XL Button" size="xl" />
```

### With Loading State

```vue
<script setup lang="ts">
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  await submitForm();
  isSubmitting.value = false;
};
</script>

<template>
  <AppButton label="Submit" :loading="isSubmitting" @click="handleSubmit" />
</template>
```

### With Icons

```vue
<!-- Leading Icon -->
<AppButton label="Home" icon="heroicons:home" to="/" />

<!-- Trailing Icon -->
<AppButton
  label="Next"
  trailing-icon="heroicons:arrow-right"
  @click="handleNext"
/>

<!-- Icon Only (use slot) -->
<AppButton>
  <Icon name="heroicons:plus" />
</AppButton>
```

### Disabled State

```vue
<AppButton label="Disabled Button" :disabled="true" />
```

### Form Submit Button

```vue
<form @submit.prevent="handleSubmit">
  <AppButton 
    label="Submit Form" 
    type="submit" 
  />
</form>
```

### Full Width (Block) Button

```vue
<AppButton label="Full Width" :block="true" />
```

### With Custom Classes

You can still add custom classes for spacing, sizing, etc. (but color classes will be overridden by the component's default orange styling):

```vue
<AppButton
  label="Custom Styled"
  class="px-8 py-4 text-lg font-bold rounded-full"
/>
```

### Using Slot Content

```vue
<AppButton>
  <Icon name="heroicons:star" class="mr-2" />
  <span class="font-bold">Featured</span>
  <Icon name="heroicons:star" class="ml-2" />
</AppButton>
```

## Props

| Prop           | Type                                   | Default     | Description                                 |
| -------------- | -------------------------------------- | ----------- | ------------------------------------------- |
| `label`        | `string`                               | `undefined` | Button text label                           |
| `to`           | `string \| RouteLocationRaw`           | `undefined` | Navigation target (converts button to link) |
| `size`         | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`      | Button size                                 |
| `disabled`     | `boolean`                              | `false`     | Disables the button                         |
| `loading`      | `boolean`                              | `false`     | Shows loading spinner                       |
| `type`         | `'button' \| 'submit' \| 'reset'`      | `'button'`  | HTML button type                            |
| `icon`         | `string`                               | `undefined` | Leading icon name (from Iconify)            |
| `trailingIcon` | `string`                               | `undefined` | Trailing icon name (from Iconify)           |
| `block`        | `boolean`                              | `false`     | Makes button full width                     |

## Events

| Event    | Payload      | Description                                                      |
| -------- | ------------ | ---------------------------------------------------------------- |
| `@click` | `MouseEvent` | Emitted when button is clicked (only for non-navigation buttons) |

## Styling

The component automatically applies these classes:

```css
bg-orange-600           /* Background color */
text-white              /* Text color */
hover:bg-orange-700     /* Hover state */
focus-visible:ring-orange-500  /* Focus ring */
active:bg-orange-800    /* Active/pressed state */
disabled:bg-orange-400  /* Disabled state */
```

These are enforced by the component and ensure consistent styling across the app.

## Real-World Examples

### Header Navigation

```vue
<!-- components/AppHeader.vue -->
<template>
  <header>
    <nav class="flex items-center gap-4">
      <LanguageSwitcher />
      <AppButton to="/submit-recipe" :label="t('recipes.submitRecipe')" />
    </nav>
  </header>
</template>
```

### Hero CTA Button

```vue
<!-- pages/index.vue -->
<template>
  <section class="hero">
    <h1>{{ heroRecipe.name }}</h1>
    <AppButton
      :to="`/recipes/${heroRecipe.id}`"
      size="xl"
      :label="t('recipes.viewRecipe')"
      class="px-8 py-3 text-lg"
    />
  </section>
</template>
```

### Form Actions

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-actions flex gap-3">
      <AppButton type="submit" label="Save Changes" :loading="isSubmitting" />
      <AppButton type="button" label="Cancel" @click="handleCancel" />
    </div>
  </form>
</template>
```

## Testing

The component has comprehensive test coverage:

```bash
# Run AppButton tests
npm run test -- tests/components/AppButton.spec.ts

# Results: ✅ 14/14 tests passing
```

## Benefits

1. **Consistency**: All orange buttons look and behave the same
2. **Maintainability**: Change styling in one place
3. **Type Safety**: Full TypeScript support prevents errors
4. **Accessibility**: Built on Nuxt UI's accessible foundation
5. **Developer Experience**: Simple API, auto-imported, well-documented

## Migration Guide

### Before (Manual Styling)

```vue
<UButton
  to="/submit-recipe"
  :label="t('recipes.submitRecipe')"
  class="bg-orange-600 text-white hover:bg-orange-700"
/>
```

### After (AppButton)

```vue
<AppButton to="/submit-recipe" :label="t('recipes.submitRecipe')" />
```

Much cleaner and ensures consistency! 🎉

## Notes

- The component automatically determines whether to render as an `<a>` (when `to` prop is provided) or `<button>` element
- When in button mode, click events are only emitted when the button is not disabled or loading
- All Nuxt UI button features are supported through prop pass-through
- The orange color scheme (`#ea580c` - orange-600) is intentionally fixed to maintain brand consistency
