import {
  useMutation,
  useQueryClient,
  type UseMutationReturnType,
} from '@tanstack/vue-query';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
  UserRole,
} from '~/types/auth';
import { authKeys } from './authKeys';

/**
 * Login mutation - authenticates user and stores JWT token
 */
export const useLoginMutation = (): UseMutationReturnType<
  AuthResponse,
  Error,
  LoginCredentials,
  unknown
> => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setToken } = useAuthToken();
  const localePath = useLocalePath();

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<AuthResponse> => {
      // MOCK IMPLEMENTATION (for testing without Laravel backend)
      // Different mock users with different role combinations

      // user@example.com - Customer + Store Owner (end user with multiple roles)
      if (
        credentials.email === 'user@example.com' &&
        credentials.password === 'password'
      ) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Test User',
          roles: ['customer', 'store_owner'] as UserRole[],
          created_at: new Date().toISOString(),
        };

        return {
          user: mockUser,
          token: mockToken,
          message: 'Login successful',
        };
      }

      // support@example.com - Support staff
      if (
        credentials.email === 'support@example.com' &&
        credentials.password === 'password'
      ) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser: User = {
          id: '2',
          email: credentials.email,
          name: 'Support Staff',
          roles: ['support'] as UserRole[],
          created_at: new Date().toISOString(),
        };

        return {
          user: mockUser,
          token: mockToken,
          message: 'Login successful',
        };
      }

      // admin@example.com - User with all roles (super admin)
      if (
        credentials.email === 'admin@example.com' &&
        credentials.password === 'password'
      ) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser: User = {
          id: '3',
          email: credentials.email,
          name: 'Admin User',
          roles: [
            'customer',
            'store_owner',
            'support',
            'employee',
            'vendor',
          ] as UserRole[],
          created_at: new Date().toISOString(),
        };

        return {
          user: mockUser,
          token: mockToken,
          message: 'Login successful',
        };
      }

      throw new Error('Invalid credentials');

      /* LARAVEL PASSPORT IMPLEMENTATION (uncomment when Laravel backend is ready)
      
      const config = useRuntimeConfig();
      
      try {
        const response = await $fetch<AuthResponse>(
          `${config.public.laravelApiUrl}/api/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: credentials,
          }
        );
        
        return response;
      } catch (error: any) {
        throw new Error(error.data?.message || 'Authentication failed');
      }
      
      */
    },
    onSuccess: (data) => {
      // Store token in localStorage
      if (data.token) {
        setToken(data.token);
      }

      // Update cache with user data
      queryClient.setQueryData(authKeys.user(), data.user);

      // Redirect to dashboard
      void router.push(localePath('/dashboard'));
    },
  });
};

/**
 * Register mutation - creates new user account
 */
export const useRegisterMutation = (): UseMutationReturnType<
  AuthResponse,
  Error,
  RegisterCredentials,
  unknown
> => {
  const queryClient = useQueryClient();
  const { setToken } = useAuthToken();
  const router = useRouter();
  const localePath = useLocalePath();

  return useMutation({
    mutationFn: async (
      credentials: RegisterCredentials
    ): Promise<AuthResponse> => {
      // MOCK IMPLEMENTATION (for testing without Laravel backend)
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        roles: ['customer'] as UserRole[], // New users start as customers by default
        created_at: new Date().toISOString(),
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        user: mockUser,
        token: mockToken,
        message: 'Registration successful',
      };

      /* LARAVEL PASSPORT IMPLEMENTATION (uncomment when Laravel backend is ready)
      
      const config = useRuntimeConfig();
      
      try {
        const response = await $fetch<AuthResponse>(
          `${config.public.laravelApiUrl}/api/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: credentials,
          }
        );
        
        return response;
      } catch (error: any) {
        throw new Error(error.data?.message || 'Registration failed');
      }
      
      */
    },
    onSuccess: (data) => {
      // Store token in localStorage
      if (data.token) {
        setToken(data.token);
      }

      // Update cache with user data
      queryClient.setQueryData(authKeys.user(), data.user);

      // Redirect to dashboard
      void router.push(localePath('/dashboard'));
    },
  });
};

/**
 * Logout mutation - revokes token and clears auth state
 */
export const useLogoutMutation = (): UseMutationReturnType<
  { message: string },
  Error,
  void,
  unknown
> => {
  const queryClient = useQueryClient();
  const { removeToken } = useAuthToken();
  const router = useRouter();
  const localePath = useLocalePath();

  return useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      // MOCK IMPLEMENTATION (for testing without Laravel backend)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        message: 'Logout successful',
      };

      /* LARAVEL PASSPORT IMPLEMENTATION (uncomment when Laravel backend is ready)
      
      const config = useRuntimeConfig();
      const token = getToken();
      
      if (!token) {
        return { message: 'No active session' };
      }
      
      try {
        await $fetch(`${config.public.laravelApiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        return { message: 'Logout successful' };
      } catch (error: any) {
        // Even if API call fails, we still clear local state
        console.error('Logout API error:', error);
        return { message: 'Logged out locally' };
      }
      
      */
    },
    onSuccess: () => {
      // Clear token from localStorage
      removeToken();

      // Clear all cached data
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.clear();

      // Redirect to home
      void router.push(localePath('/'));
    },
  });
};
