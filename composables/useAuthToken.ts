/**
 * Composable for managing authentication token in localStorage
 * This is a client-side only implementation for static sites
 */
interface AuthTokenApi {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  hasToken: () => boolean;
}

export const useAuthToken = (): AuthTokenApi => {
  const TOKEN_KEY = 'auth_token';

  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  };

  const setToken = (token: string): void => {
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  };

  const removeToken = (): void => {
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const hasToken = (): boolean => {
    return getToken() !== null;
  };

  return {
    getToken,
    setToken,
    removeToken,
    hasToken,
  };
};
