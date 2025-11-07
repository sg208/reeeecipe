/**
 * Middleware to protect end-user routes (/store)
 * Only allows customers and store owners
 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth();
  const { isEndUser } = useRoleCheck();
  const localePath = useLocalePath();

  if (!user.value) {
    return navigateTo(localePath('/auth/login'));
  }

  if (!isEndUser()) {
    // Internal staff shouldn't access end-user routes
    console.log('[MIDDLEWARE] Internal staff cannot access end-user routes');
    return navigateTo(localePath('/dashboard'));
  }
});
