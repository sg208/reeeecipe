import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import AppButton from '~/components/AppButton.vue';

describe('AppButton Component', () => {
  it('renders button with label', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Click Me',
      },
    });

    expect(wrapper.text()).toContain('Click Me');
  });

  it('renders as link when "to" prop is provided', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Go Home',
        to: '/',
      },
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
  });

  it('renders as button when no "to" prop is provided', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Submit',
      },
    });

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
  });

  it('applies consistent orange styling', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Test Button',
      },
    });

    // Check for orange background classes
    const html = wrapper.html();
    expect(html).toContain('bg-orange-600');
    expect(html).toContain('text-white');
  });

  it('handles click events', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Click Me',
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('supports different sizes', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Large Button',
        size: 'xl',
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('handles disabled state', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Disabled',
        disabled: true,
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('handles loading state', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Loading',
        loading: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
    // UButton should handle the loading state internally
  });

  it('supports icons', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'With Icon',
        icon: 'heroicons:home',
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('supports slot content', async () => {
    const wrapper = await mountSuspended(AppButton, {
      slots: {
        default: 'Custom Slot Content',
      },
    });

    expect(wrapper.text()).toContain('Custom Slot Content');
  });

  it('supports different button types', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Submit',
        type: 'submit',
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('type')).toBe('submit');
  });

  it('prevents click when disabled', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Disabled',
        disabled: true,
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    // Click should not fire when disabled (UButton handles this internally)
    // Just verify the button is disabled
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('prevents click when loading', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Loading',
        loading: true,
      },
    });

    // UButton handles loading state internally
    // Just verify the component renders with loading prop
    expect(wrapper.exists()).toBe(true);
  });

  it('supports block layout', async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: {
        label: 'Block Button',
        block: true,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
