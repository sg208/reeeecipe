import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const { accessToken, user, isAuthenticated } = storeToRefs(authStore);

  if (accessToken.value && !user.value) {
    try {
      await authStore.syncProfile();
    } catch {
      // Ignore errors here; syncProfile already clears invalid sessions.
    }
  }

  const isLoggedIn = isAuthenticated.value;

  if (!isLoggedIn && to.path !== '/dashboard') {
    const redirectQuery =
      to.fullPath !== '/dashboard' ? { redirect: to.fullPath } : undefined;
    return navigateTo({ path: '/dashboard', query: redirectQuery });
  }

  if (isLoggedIn && to.path === '/dashboard') {
    const redirect = Array.isArray(to.query.redirect)
      ? to.query.redirect[0]
      : to.query.redirect;

    if (typeof redirect === 'string' && redirect.length > 0) {
      return navigateTo(redirect);
    }
  }
});
