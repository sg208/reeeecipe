<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { t } = useI18n();
const router = useRouter();

const { isAuthenticated, user, logout } = useAuth();

const accountMenuOpen = ref(false);

const displayName = computed(() => user.value?.name ?? t('auth.account'));

const handleLogout = async (): Promise<void> => {
  accountMenuOpen.value = false;
  await logout();
  await router.push('/dashboard');
};
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-primary-900 bg-blue-800 shadow-sm"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-2xl font-bold text-white transition-colors hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-800"
        >
          reeeecipe
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex items-center gap-4">
          <LanguageSwitcher />
          <NuxtLink
            v-if="!isAuthenticated"
            to="/dashboard"
            class="rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-800"
          >
            {{ t('auth.signInButton') }}
          </NuxtLink>
          <UPopover
            v-else
            v-model:open="accountMenuOpen"
            :ui="{ trigger: 'text-left' }"
          >
            <template #trigger>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md border border-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-800"
              >
                <Icon
                  name="heroicons:user-circle"
                  class="h-5 w-5 text-primary-100"
                />
                <span>{{ displayName }}</span>
                <Icon
                  name="heroicons:chevron-down"
                  class="h-4 w-4 text-primary-100"
                />
              </button>
            </template>
            <template #panel>
              <div
                class="w-56 rounded-lg border border-gray-100 bg-white p-3 shadow-lg"
              >
                <p
                  class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {{ t('auth.accountMenuTitle') }}
                </p>
                <div class="rounded-md bg-gray-50 p-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ user?.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ user?.email }}
                  </p>
                </div>
                <div class="mt-3 space-y-2">
                  <NuxtLink
                    to="/dashboard"
                    class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    @click="accountMenuOpen = false"
                  >
                    <Icon
                      name="heroicons:squares-2x2"
                      class="h-4 w-4 text-primary-500"
                    />
                    <span>{{ t('auth.dashboardLink') }}</span>
                  </NuxtLink>
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    @click="handleLogout"
                  >
                    <Icon
                      name="heroicons:arrow-right-on-rectangle"
                      class="h-4 w-4"
                    />
                    <span>{{ t('auth.logout') }}</span>
                  </button>
                </div>
              </div>
            </template>
          </UPopover>
        </nav>
      </div>
    </div>
  </header>
</template>
