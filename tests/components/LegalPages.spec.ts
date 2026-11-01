import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import AccessibilityPage from '~/pages/accessibility.vue';
import PrivacyPage from '~/pages/privacy.vue';
import TermsPage from '~/pages/terms.vue';

const issuesUrl = 'https://github.com/sg208/reeeecipe/issues';

describe('Legal pages', () => {
  it.each([
    ['accessibility', AccessibilityPage, 'Accessibility'],
    ['privacy', PrivacyPage, 'Privacy'],
    ['terms', TermsPage, 'Terms'],
  ])(
    '%s page has one h1 and links to GitHub issues',
    async (_, page, title) => {
      const wrapper = await mountSuspended(page);

      const headings = wrapper.findAll('h1');
      expect(headings).toHaveLength(1);
      expect(headings[0]?.text()).toBe(title);
      expect(wrapper.find(`a[href="${issuesUrl}"]`).exists()).toBe(true);
    }
  );

  it('accessibility page states the WCAG target and review date', async () => {
    const wrapper = await mountSuspended(AccessibilityPage);

    expect(wrapper.text()).toContain('WCAG 2.2');
    expect(wrapper.text()).toContain('1 November 2026');
  });

  it('privacy page names the host and third parties', async () => {
    const wrapper = await mountSuspended(PrivacyPage);
    const text = wrapper.text();

    expect(text).toContain('Cloudflare');
    expect(text).toContain('cdn.dummyjson.com');
    expect(text).toContain('nuxt-color-mode');
  });

  it('terms page links to the privacy page', async () => {
    const wrapper = await mountSuspended(TermsPage);

    expect(wrapper.find('a[href="/privacy"]').exists()).toBe(true);
  });
});
