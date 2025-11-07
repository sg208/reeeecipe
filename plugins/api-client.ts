import { FetchError } from 'ofetch';
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { storeToRefs, type Pinia } from 'pinia';
import type { ApiFetchOptions, AuthUser } from '~/types';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia | undefined;

  if (!pinia) {
    throw new Error('Pinia instance is not available on nuxtApp.');
  }

  const authStore = useAuthStore(pinia);
  const { accessToken } = storeToRefs(authStore);

  if (import.meta.server) {
    await authStore.initialize();
  } else {
    void authStore.initialize();
  }

  const apiFetch = async <T>(
    request: string,
    options: ApiFetchOptions = {}
  ): Promise<T> => {
    const initialOptions = (options ?? {}) as ApiFetchOptions & {
      auth?: boolean;
    };
    const auth = initialOptions.auth ?? true;
    const normalizedHeaders = new Headers(
      initialOptions.headers as HeadersInit | undefined
    );

    if (auth && accessToken.value) {
      if (!normalizedHeaders.has('Authorization')) {
        normalizedHeaders.set('Authorization', `Bearer ${accessToken.value}`);
      }
    }

    const fetchOptions: ApiFetchOptions = {
      ...initialOptions,
      headers: normalizedHeaders,
    };

    if ('auth' in fetchOptions) {
      delete (fetchOptions as { auth?: boolean }).auth;
    }

    try {
      return (await $fetch<T>(
        request,
        fetchOptions as NitroFetchOptions<NitroFetchRequest>
      )) as T;
    } catch (error) {
      if (auth && error instanceof FetchError) {
        const status = error.response?.status ?? error.status;

        if (status === 401) {
          authStore.clearTokens();
          authStore.setUser(null);
        }
      }
      throw error;
    }
  };

  const getAuthenticatedUser = async (): Promise<AuthUser | null> => {
    if (!accessToken.value) {
      return null;
    }

    try {
      return await apiFetch<AuthUser>('/api/auth/profile');
    } catch {
      return null;
    }
  };

  return {
    provide: {
      apiFetch,
      apiGetCurrentUser: getAuthenticatedUser,
    },
  };
});
