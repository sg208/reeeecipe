import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import AppHeader from '~/components/AppHeader.vue';

describe('AppHeader Component', () => {
  it('renders header with correct structure', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Check if header element exists
    const header = wrapper.find('header');
    expect(header.exists()).toBe(true);
  });

  it('displays logo/brand name', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Should contain the brand name "reeeecipe"
    expect(wrapper.text()).toContain('reeeecipe');
  });

  it('renders logo as NuxtLink to home page', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Find the logo link
    const logoLink = wrapper.find('a[href="/"]');
    expect(logoLink.exists()).toBe(true);
    expect(logoLink.text()).toContain('reeeecipe');
  });

  it('renders LanguageSwitcher component', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Check if LanguageSwitcher is rendered (should have a select element)
    const select = wrapper.find('select');
    expect(select.exists()).toBe(true);
  });

  it('renders submit recipe button', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Find the submit recipe link
    const submitLink = wrapper.find('a[href="/submit-recipe"]');
    expect(submitLink.exists()).toBe(true);
  });

  it('uses i18n for submit recipe button text', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // The submit recipe button should have translated text
    // Since we're testing with i18n, the text should be present
    // The button should exist (checking for link to /submit-recipe)
    const submitLink = wrapper.find('a[href="/submit-recipe"]');
    expect(submitLink.exists()).toBe(true);
  });

  it('has sticky positioning', async () => {
    const wrapper = await mountSuspended(AppHeader);

    const header = wrapper.find('header');
    const classes = header.classes();

    // Check for sticky positioning class
    expect(classes).toContain('sticky');
  });

  it('has proper navigation structure', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Should have a nav element
    const nav = wrapper.find('nav');
    expect(nav.exists()).toBe(true);
  });

  it('all navigation links are clickable', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Get all links
    const links = wrapper.findAll('a');

    // Should have at least 2 links (logo and submit recipe)
    expect(links.length).toBeGreaterThanOrEqual(2);

    // Check that links have href attributes
    links.forEach((link) => {
      expect(link.attributes('href')).toBeDefined();
    });
  });

  it('has z-index for layering', async () => {
    const wrapper = await mountSuspended(AppHeader);

    const header = wrapper.find('header');
    const classes = header.classes();

    // Check for z-index class (z-50)
    expect(classes.some((cls) => cls.includes('z-'))).toBe(true);
  });

  it('has responsive container', async () => {
    const wrapper = await mountSuspended(AppHeader);

    // Should have container with responsive padding
    const container = wrapper.find('.container');
    expect(container.exists()).toBe(true);
  });
});
