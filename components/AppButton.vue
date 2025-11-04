<!--
  AppButton - Reusable button component with consistent orange styling
  
  Usage:
  
  As a navigation link:
  <AppButton to="/path" label="Click Me" />
  
  As a button with click handler:
  <AppButton label="Submit" @click="handleSubmit" />
  
  With custom size and icon:
  <AppButton label="Save" size="xl" icon="heroicons:check" @click="handleSave" />
  
  With loading state:
  <AppButton label="Loading..." :loading="isLoading" />
  
  With slot content:
  <AppButton>
    <Icon name="heroicons:home" />
    <span>Home</span>
  </AppButton>
  
  Props:
  - label: Button text
  - to: Navigation target (makes it a link)
  - size: xs | sm | md | lg | xl (default: md)
  - disabled: Boolean
  - loading: Boolean
  - type: button | submit | reset (default: button)
  - icon: Leading icon name
  - trailingIcon: Trailing icon name
  - block: Full width button
  
  Events:
  - @click: Emitted when button is clicked (only for non-navigation buttons)
-->
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface Props {
  label?: string;
  to?: RouteLocationRaw | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  trailingIcon?: string;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  to: undefined,
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
  icon: undefined,
  trailingIcon: undefined,
  block: false,
});

interface Emits {
  (e: 'click', event: MouseEvent): void;
}

const emit = defineEmits<Emits>();

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

// Build base classes for consistent orange styling
const baseClasses =
  'bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500 active:bg-orange-800 disabled:bg-orange-400';
</script>

<template>
  <UButton
    v-if="to"
    :to="to"
    :label="label"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    :trailing-icon="trailingIcon"
    :block="block"
    :class="baseClasses"
  >
    <slot />
  </UButton>
  <UButton
    v-else
    :label="label"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :type="type"
    :icon="icon"
    :trailing-icon="trailingIcon"
    :block="block"
    :class="baseClasses"
    @click="handleClick"
  >
    <slot />
  </UButton>
</template>
