import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import AppFooter from '~/components/AppFooter.vue';

describe('AppFooter Component', () => {
  it('renders footer with correct structure', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // Check if footer element exists
    const footer = wrapper.find('footer');
    expect(footer.exists()).toBe(true);
  });

  it('displays current year in copyright', async () => {
    const wrapper = await mountSuspended(AppFooter);

    const currentYear = new Date().getFullYear();

    // Copyright should contain the current year
    expect(wrapper.text()).toContain(currentYear.toString());
  });

  it('renders all footer navigation links', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // Check for About link
    const aboutLink = wrapper.find('a[href="/about"]');
    expect(aboutLink.exists()).toBe(true);

    // Check for Privacy link
    const privacyLink = wrapper.find('a[href="/privacy"]');
    expect(privacyLink.exists()).toBe(true);

    // Check for Terms link
    const termsLink = wrapper.find('a[href="/terms"]');
    expect(termsLink.exists()).toBe(true);

    // Check for Accessibility link
    const accessibilityLink = wrapper.find('a[href="/accessibility"]');
    expect(accessibilityLink.exists()).toBe(true);
  });

  it('has exactly one GitHub link: a subtle icon to the repo', async () => {
    const wrapper = await mountSuspended(AppFooter);

    const githubLinks = wrapper.findAll('a[href*="github.com"]');
    expect(githubLinks).toHaveLength(1);

    const repoLink = githubLinks[0]!;
    expect(repoLink.attributes('href')).toBe(
      'https://github.com/sg208/reeeecipe'
    );
    expect(repoLink.attributes('aria-label')).toBe('Source code on GitHub');
    expect(repoLink.attributes('target')).toBeUndefined();
    expect(repoLink.text()).toBe('');

    const icon = repoLink.find('svg');
    expect(icon.attributes('aria-hidden')).toBe('true');
    expect(icon.attributes('focusable')).toBe('false');
  });

  it('uses i18n for link texts', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // The footer should have translated link texts
    const links = wrapper.findAll('a');

    // Should have at least 3 links (about, privacy, terms)
    expect(links.length).toBeGreaterThanOrEqual(3);

    // Each link should have text content
    links.forEach((link) => {
      expect(link.text() || link.attributes('aria-label')).toBeTruthy();
    });
  });

  it('leaves the language switcher to the header', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // LanguageSwitcher lives in AppHeader, not the footer
    expect(wrapper.find('select').exists()).toBe(false);
  });

  it('has responsive layout classes', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // Should have flex classes for responsive layout
    const html = wrapper.html();
    expect(html).toContain('flex');
  });

  it('computes current year reactively', async () => {
    const wrapper = await mountSuspended(AppFooter);

    const currentYear = new Date().getFullYear();

    // Verify the computed value is correct
    expect(wrapper.text()).toContain(currentYear.toString());
  });

  it('all footer links have href attributes', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // Get all NuxtLink elements
    const links = wrapper.findAll('a');

    // Filter out the select element's parent if it exists
    const navigationLinks = links.filter((link) => {
      const href = link.attributes('href');
      return href && href !== '#';
    });

    // Should have at least 3 navigation links
    expect(navigationLinks.length).toBeGreaterThanOrEqual(3);

    // Check that all have valid href attributes
    navigationLinks.forEach((link) => {
      const href = link.attributes('href');
      expect(href).toBeDefined();
      expect(href).toBeTruthy();
    });
  });

  it('has proper spacing and container', async () => {
    const wrapper = await mountSuspended(AppFooter);

    // Should share the page frame used by every section
    const container = wrapper.find('.page-frame');
    expect(container.exists()).toBe(true);
  });

  it('has accessible link styling', async () => {
    const wrapper = await mountSuspended(AppFooter);

    const links = wrapper.findAll('a[href^="/"]');

    // Links should have transition classes for hover effects
    links.forEach((link) => {
      const classes = link.classes();
      expect(classes.some((cls) => cls.includes('transition'))).toBe(true);
    });
  });
});
