import { computed, watch } from 'vue';
import { defineStore } from 'pinia';
import type { ApiFetchOptions, AuthTokens, AuthUser } from '~/types';

const cookieOptions = {
  sameSite: 'lax' as const,
  secure: !import.meta.dev,
  path: '/',
};

export const useAuthStore = defineStore('auth', () => {
  const nuxtApp = useNuxtApp();
  const apiFetch = ((
    nuxtApp as unknown as {
      $apiFetch?: <T>(request: string, options?: ApiFetchOptions) => Promise<T>;
    }
  ).$apiFetch ?? $fetch) as <T>(
    request: string,
    options?: ApiFetchOptions
  ) => Promise<T>;

  const accessToken = useCookie<string | null>('auth_access_token', {
    ...cookieOptions,
    default: () => null,
  });

  const refreshToken = useCookie<string | null>('auth_refresh_token', {
    ...cookieOptions,
    default: () => null,
  });

  const user = useState<AuthUser | null>('auth-user', () => null);

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  const setTokens = (tokens: AuthTokens): void => {
    accessToken.value = tokens.accessToken;
    refreshToken.value = tokens.refreshToken ?? null;
  };

  const clearTokens = (): void => {
    accessToken.value = null;
    refreshToken.value = null;
  };

  const setUser = (profile: AuthUser | null): void => {
    user.value = profile;
  };

  const syncProfile = async (): Promise<AuthUser | null> => {
    if (!accessToken.value) {
      user.value = null;
      return null;
    }

    try {
      const profile = await apiFetch<AuthUser>('/api/auth/profile');
      user.value = profile;
      return profile;
    } catch (error) {
      clearTokens();
      user.value = null;
      throw error;
    }
  };

  const initialize = async (): Promise<void> => {
    if (!user.value && accessToken.value) {
      try {
        await syncProfile();
      } catch {
        // Swallow errors during bootstrap; tokens have been cleared already.
      }
    }
  };

  const logout = async (): Promise<void> => {
    const token = accessToken.value;

    if (token) {
      try {
        await apiFetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Ignore network problems during logout to avoid blocking local cleanup.
      }
    }

    clearTokens();
    user.value = null;
  };

  watch(accessToken, (token) => {
    if (!token) {
      user.value = null;
    }
  });

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    initialize,
    setTokens,
    clearTokens,
    setUser,
    syncProfile,
    logout,
  };
});
