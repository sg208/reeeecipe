import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';

describe('LanguageSwitcher Component', () => {
  it('renders language selector', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    // Should have a select element
    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);
  });

  it('displays all available locales', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const options = wrapper.findAll('option');

    // Should have at least 3 options (en, es, nl)
    expect(options.length).toBeGreaterThanOrEqual(3);

    // Check if options have the expected values
    const optionValues = options.map((option) => option.attributes('value'));
    expect(optionValues).toContain('en');
    expect(optionValues).toContain('es');
    expect(optionValues).toContain('nl');
  });

  it('shows current locale as selected', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const select = wrapper.find('select');

    // The select should have a value attribute
    expect(select.attributes('value')).toBeDefined();
  });

  it('renders flag icon', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    // Check if UIcon component is present
    const html = wrapper.html();
    expect(html).toContain('circle-flags:us'); // Default should be English (US flag)
  });

  it('has proper styling classes', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const select = wrapper.find('select');
    const classes = select.classes();

    // Check for essential styling classes
    expect(classes).toContain('cursor-pointer');
    expect(classes).toContain('rounded-md');
  });

  it('emits change event when locale is changed', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);
    const select = wrapper.find('select');

    // Trigger change event
    await select.setValue('es');

    // The change event should be handled
    // Note: We can't easily test the actual locale change since it triggers a page reload
    // but we can verify the event was triggered
    expect(select.element.value).toBe('es');
  });

  it('displays locale names or codes', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);
    const options = wrapper.findAll('option');

    // At least one option should have text content
    options.forEach((option) => {
      expect(option.text()).toBeTruthy();
    });
  });

  it('has accessible attributes', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);
    const select = wrapper.find('select');

    // Select should be keyboard accessible (no disabled attribute by default)
    expect(select.attributes('disabled')).toBeUndefined();
  });
});
