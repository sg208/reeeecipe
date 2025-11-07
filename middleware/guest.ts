export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuth();
  const localePath = useLocalePath();

  // If authenticated, redirect to home page
  if (isAuthenticated.value) {
    return navigateTo(localePath('/'));
  }
});
