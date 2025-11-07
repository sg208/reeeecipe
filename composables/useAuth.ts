import { ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import type {
  ApiFetchOptions,
  AuthLoginPayload,
  AuthLoginResponse,
  AuthUser,
} from '~/types';
import { useAuthStore } from '~/stores/auth';

interface UseAuthReturn {
  user: Ref<AuthUser | null>;
  isAuthenticated: Ref<boolean>;
  isLoading: Ref<boolean>;
  errorMessage: Ref<string | null>;
  login: (payload: AuthLoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  ensureProfile: () => Promise<AuthUser | null>;
}

export const useAuth = (): UseAuthReturn => {
  const authStore = useAuthStore();
  const { user, isAuthenticated } = storeToRefs(authStore);

  const nuxtApp = useNuxtApp();
  const apiFetch = ((
    nuxtApp as unknown as {
      $apiFetch?: <T>(request: string, options?: ApiFetchOptions) => Promise<T>;
    }
  ).$apiFetch ?? $fetch) as <T>(
    request: string,
    options?: ApiFetchOptions
  ) => Promise<T>;

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const login = async (payload: AuthLoginPayload): Promise<AuthUser> => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await apiFetch<AuthLoginResponse>('/api/auth/login', {
        method: 'POST',
        body: payload,
        auth: false,
      });

      authStore.setTokens(response.tokens);
      authStore.setUser(response.user);

      return response.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      errorMessage.value = message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const ensureProfile = async (): Promise<AuthUser | null> => {
    try {
      await authStore.initialize();
      return user.value;
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Unable to load profile';
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await authStore.logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    errorMessage,
    login,
    logout,
    ensureProfile,
  };
};
