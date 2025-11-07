<script setup lang="ts">
// Protected route - requires authentication
definePageMeta({
  middleware: 'auth',
  title: 'Dashboard',
});

const { t } = useI18n();
const { user } = useAuth();
const { getAllRoles } = useRoleCheck();

// Get all user roles
const userRoles = computed(() => getAllRoles());

// Determine which dashboard components to show based on user's roles
const dashboardComponents = computed(() => {
  if (!user.value || !userRoles.value.length) return [];

  const components = [];

  // Show a dashboard component for each role the user has
  for (const role of userRoles.value) {
    switch (role) {
      case 'customer':
        components.push({
          key: 'customer',
          component: resolveComponent('DashboardCustomer'),
        });
        break;
      case 'store_owner':
        components.push({
          key: 'store_owner',
          component: resolveComponent('DashboardStoreOwner'),
        });
        break;
      case 'support':
        components.push({
          key: 'support',
          component: resolveComponent('DashboardSupport'),
        });
        break;
      case 'employee':
        components.push({
          key: 'employee',
          component: resolveComponent('DashboardEmployee'),
        });
        break;
      case 'vendor':
        components.push({
          key: 'vendor',
          component: resolveComponent('DashboardVendor'),
        });
        break;
    }
  }

  return components;
});

useHead({
  title: computed(() => t('dashboardPage.title')),
});
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">
        {{ t('dashboardPage.title') }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ t('dashboardPage.welcome', { name: user?.name ?? '' }) }}
        <span v-if="userRoles.length > 1" class="text-sm text-gray-500">
          {{ t('dashboardPage.roleCount', { count: userRoles.length }) }}
        </span>
      </p>
      <div v-if="userRoles.length > 0" class="mt-2 flex flex-wrap gap-2">
        <UBadge
          v-for="role in userRoles"
          :key="role"
          :label="role.replace('_', ' ').toUpperCase()"
          color="primary"
          variant="subtle"
        />
      </div>
    </div>

    <div class="space-y-8">
      <!-- Render a dashboard component for each role -->
      <component
        :is="item.component"
        v-for="item in dashboardComponents"
        :key="item.key"
        :user="user!"
      />

      <!-- Fallback if no roles -->
      <UCard v-if="dashboardComponents.length === 0">
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('dashboardPage.emptyTitle') }}
          </h2>
        </template>
        <p class="text-gray-600">
          {{ t('dashboardPage.emptyDescription') }}
        </p>
      </UCard>
    </div>
  </div>
</template>
