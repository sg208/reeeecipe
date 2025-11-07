export default defineNuxtRouteMiddleware((to, _from) => {
  // Client-side only middleware - checks localStorage token
  if (import.meta.server) {
    return;
  }

  const { hasToken } = useAuthToken();
  const localePath = useLocalePath();

  // Check if user has auth token
  if (!hasToken()) {
    console.log('[MIDDLEWARE] No token found, redirecting to login');
    return navigateTo({
      path: localePath('/auth/login'),
      query: { redirect: to.fullPath },
    });
  }

  // Token exists - user will be validated by useUserQuery in the page
  console.log('[MIDDLEWARE] Token found, allowing access to:', to.path);
});
