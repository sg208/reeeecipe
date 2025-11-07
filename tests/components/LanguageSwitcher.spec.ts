import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, it, expect, vi, afterEach } from 'vitest';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';

describe('LanguageSwitcher Component', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders Nuxt UI locale select component', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);
    const localeSelect = wrapper.findComponent({ name: 'ULocaleSelect' });

    expect(localeSelect.exists()).toBe(true);
  });

  it('passes configured locales to the select component', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);
    const localeSelect = wrapper.getComponent({ name: 'ULocaleSelect' });
    const localesProp = localeSelect.props('locales') as Array<{
      code: string;
      name: string;
    }>;

    expect(localesProp).toHaveLength(3);
    const codes = localesProp.map((locale) => locale.code);

    expect(codes).toEqual(expect.arrayContaining(['en', 'es', 'nl']));
  });

  it('renders the current locale icon', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    expect(wrapper.html()).toContain('circle-flags:nl');
  });

  it('navigates when locale is changed', async () => {
    const navigateToMock = vi.fn();
    vi.stubGlobal('navigateTo', navigateToMock);

    const wrapper = await mountSuspended(LanguageSwitcher);
    const vm = wrapper.vm as unknown as {
      handleLocaleChange: (newLocale: string) => Promise<void>;
    };

    await vm.handleLocaleChange('en');

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    const firstCall = navigateToMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const [path] = firstCall as [unknown];
    expect(typeof path === 'string' && path.length > 0).toBe(true);
  });
});
