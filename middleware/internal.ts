/**
 * Middleware to protect internal routes (/internal)
 * Only allows support, employee, and vendor roles
 */
export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth();
  const { isInternalStaff } = useRoleCheck();
  const localePath = useLocalePath();

  if (!user.value) {
    return navigateTo(localePath('/auth/login'));
  }

  if (!isInternalStaff()) {
    // End users shouldn't access internal routes
    console.log('[MIDDLEWARE] End users cannot access internal routes');
    return navigateTo(localePath('/dashboard'));
  }
});
