import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import type { User } from '~/types/auth';
import { authKeys } from './authKeys';

interface HttpErrorLike {
  status?: number;
  statusCode?: number;
}

const isHttpErrorLike = (error: unknown): error is HttpErrorLike => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as Partial<HttpErrorLike>;
  return (
    typeof candidate.status === 'number' ||
    typeof candidate.statusCode === 'number'
  );
};

/**
 * Fetches current authenticated user
 * Returns null if no token or token is invalid
 */
export const useUserQuery = (): UseQueryReturnType<User | null, Error> => {
  const { getToken, removeToken } = useAuthToken();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      const token = getToken();

      // No token = not authenticated
      if (!token) {
        return null;
      }

      try {
        // MOCK IMPLEMENTATION (for testing without Laravel backend)
        // Return mock user if token exists and is valid format
        if (token.startsWith('mock-jwt-token-')) {
          // Extract a simple "user id" from token for demo purposes
          // In reality, you'd decode the JWT
          const mockUser: User = {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
            roles: ['customer', 'store_owner'], // Multiple roles
            created_at: new Date().toISOString(),
          };

          return mockUser;
        }

        // Invalid token format
        removeToken();
        return null;

        /* LARAVEL PASSPORT IMPLEMENTATION (uncomment when Laravel backend is ready)
        
        const config = useRuntimeConfig();
        
        const user = await $fetch<User>(
          `${config.public.laravelApiUrl}/api/auth/me`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        return user;
        
        */
      } catch (error: unknown) {
        // If token is invalid (401), remove it
        if (
          isHttpErrorLike(error) &&
          (error.statusCode ?? error.status) === 401
        ) {
          removeToken();
        }

        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - don't refetch too often
    retry: false, // Don't retry failed auth checks
  });
};
