import { computed } from 'vue';
import type { LoginCredentials, RegisterCredentials } from '~/types/auth';
import { useUserQuery } from './queries/useAuthQuery';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from './queries/useAuthMutation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAuth = () => {
  // Fetch current user with TanStack Query
  const { data: user, isLoading, error, refetch } = useUserQuery();

  // Mutations
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // Computed properties
  const isAuthenticated = computed(() => user.value !== null);
  const isAuthLoading = computed(
    () =>
      isLoading.value ||
      loginMutation.isPending.value ||
      registerMutation.isPending.value ||
      logoutMutation.isPending.value
  );

  // Actions
  const login = async (credentials: LoginCredentials): Promise<void> => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    await registerMutation.mutateAsync(credentials);
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  return {
    // State
    user: computed(() => user.value ?? null),
    isAuthenticated,
    isLoading: isAuthLoading,
    error: computed(() => (error.value as Error | null) ?? null),
    // Actions
    login,
    register,
    logout,
    refetch: (): Promise<unknown> => refetch(),
  };
};
