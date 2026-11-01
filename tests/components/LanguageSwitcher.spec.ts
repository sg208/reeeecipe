import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect } from 'vitest';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';

describe('LanguageSwitcher Component', () => {
  it('renders a labelled list of language links', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const list = wrapper.find('ul');
    expect(list.exists()).toBe(true);
    expect(list.attributes('aria-label')).toBeTruthy();
  });

  it('offers en, es and nl, each marked with lang and hreflang', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const links = wrapper.findAll('a');
    expect(links.map((link) => link.attributes('lang'))).toEqual([
      'en',
      'es',
      'nl',
    ]);
    links.forEach((link) => {
      expect(link.attributes('hreflang')).toBe(link.attributes('lang'));
    });
  });

  it('links each locale to its own prefixed URL', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'));
    expect(hrefs[0]).toBe('/');
    expect(hrefs[1]).toMatch(/^\/es/);
    expect(hrefs[2]).toMatch(/^\/nl/);
  });

  it('marks only the current locale with aria-current', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    const current = wrapper
      .findAll('a')
      .filter((link) => link.attributes('aria-current') === 'true');
    expect(current).toHaveLength(1);
    expect(current[0]?.attributes('lang')).toBe('en');
  });

  it('gives every link a name that starts with its visible code', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    wrapper.findAll('a').forEach((link) => {
      const code = link.attributes('lang') ?? '';
      expect(link.text().toLowerCase().startsWith(code)).toBe(true);
      expect(link.find('.sr-only').text()).toBeTruthy();
    });
  });
});
