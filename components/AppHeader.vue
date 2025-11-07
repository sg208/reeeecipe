<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

type RouteName =
  | 'index'
  | 'store'
  | 'internal'
  | 'submit-recipe'
  | 'dashboard'
  | 'profile'
  | 'auth-login';

const toLocalePath = (name: RouteName): string => localePath({ name });
const { user, isAuthenticated, logout } = useAuth();
const { isEndUser, isInternalStaff } = useRoleCheck();

// Dynamic navigation items based on user roles
const navigationItems = computed(() => {
  if (!isAuthenticated.value || !user.value) return [];

  const items: Array<{
    label: string;
    to: string;
    icon: string;
  }> = [];

  // Add Store link for end users
  if (isEndUser()) {
    items.push({
      label: t('navigation.store'),
      to: toLocalePath('store'),
      icon: 'i-heroicons-shopping-bag',
    });
  }

  // Add Internal Tools for internal staff
  if (isInternalStaff()) {
    items.push({
      label: t('navigation.internal'),
      to: toLocalePath('internal'),
      icon: 'i-heroicons-wrench-screwdriver',
    });
  }

  return items;
});

interface UserMenuItem {
  label: string;
  icon?: string;
  to?: string;
  onSelect?: () => Promise<void>;
}

const userMenuItems = computed<Array<Array<UserMenuItem>>>(() => [
  [
    {
      label: t('navigation.dashboard'),
      icon: 'i-heroicons-home',
      to: toLocalePath('dashboard'),
    },
    {
      label: t('navigation.profile'),
      icon: 'i-heroicons-user',
      to: toLocalePath('profile'),
    },
  ],
  [
    {
      label: t('navigation.logout'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect: async (): Promise<void> => {
        await logout();
      },
    },
  ],
]);
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-primary-900 bg-blue-800 shadow-sm"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          :to="toLocalePath('index')"
          class="text-2xl font-bold text-white transition-colors hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-800"
        >
          reeeecipe
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex items-center gap-4">
          <!-- Role-based navigation links -->
          <UButton
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            :icon="item.icon"
            :label="item.label"
            variant="ghost"
            class="text-white hover:bg-white/10"
          />

          <LanguageSwitcher />
          <AppButton
            :to="toLocalePath('submit-recipe')"
            :label="t('recipes.submitRecipe')"
            size="xl"
          />

          <!-- Auth Section - No ClientOnly needed (full client-side app) -->
          <template v-if="isAuthenticated && user">
            <UDropdownMenu
              :items="userMenuItems"
              :content="{ class: 'z-[60]' }"
            >
              <UButton
                variant="ghost"
                trailing-icon="i-heroicons-chevron-down"
                class="text-white hover:bg-white/10"
              >
                <template #leading>
                  <UAvatar :alt="user.name" size="xs" />
                </template>
                {{ user.name }}
              </UButton>
            </UDropdownMenu>
          </template>
          <template v-else>
            <UButton
              :to="toLocalePath('auth-login')"
              color="primary"
              variant="solid"
              icon="i-heroicons-arrow-right-on-rectangle"
              :label="t('navigation.login')"
            />
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>
