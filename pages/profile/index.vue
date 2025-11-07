<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  title: 'Profile',
});

const { t } = useI18n();
const { user } = useAuth();
const { getAllRoles } = useRoleCheck();

const userRoles = computed(() => getAllRoles());

useHead({
  title: computed(() => t('profilePage.title')),
});
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">
      {{ t('profilePage.title') }}
    </h1>

    <div class="space-y-6">
      <!-- User Profile Card -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('profilePage.personalInfo.title') }}
          </h2>
        </template>
        <div class="space-y-4">
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-gray-600">
                {{ t('profilePage.personalInfo.labels.name') }}
              </label>
              <p class="mt-1 text-lg">{{ user?.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">
                {{ t('profilePage.personalInfo.labels.email') }}
              </label>
              <p class="mt-1 text-lg">{{ user?.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">
                {{ t('profilePage.personalInfo.labels.userId') }}
              </label>
              <p class="mt-1 text-lg">{{ user?.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">
                {{ t('profilePage.personalInfo.labels.memberSince') }}
              </label>
              <p class="mt-1 text-lg">
                {{
                  user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : t('common.notAvailable')
                }}
              </p>
            </div>
          </div>
          <UButton
            :label="t('profilePage.personalInfo.actions.editProfile')"
            icon="i-heroicons-pencil"
          />
        </div>
      </UCard>

      <!-- Roles Card -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('profilePage.roles.title') }}
          </h2>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('profilePage.roles.description') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="role in userRoles"
              :key="role"
              :label="role.replace('_', ' ').toUpperCase()"
              size="lg"
              color="primary"
            />
          </div>
        </div>
      </UCard>

      <!-- Role-Specific Management -->
      <div v-if="userRoles.includes('customer')" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              {{ t('profilePage.sections.customer.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('profilePage.sections.customer.description') }}
            </p>
            <div class="grid gap-4 md:grid-cols-2">
              <UButton
                :label="t('profilePage.sections.customer.actions.orderHistory')"
                icon="i-heroicons-shopping-bag"
                block
              />
              <UButton
                :label="
                  t('profilePage.sections.customer.actions.savedAddresses')
                "
                icon="i-heroicons-map-pin"
                block
              />
              <UButton
                :label="
                  t('profilePage.sections.customer.actions.paymentMethods')
                "
                icon="i-heroicons-credit-card"
                block
              />
              <UButton
                :label="t('profilePage.sections.customer.actions.preferences')"
                icon="i-heroicons-cog-6-tooth"
                block
              />
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="userRoles.includes('store_owner')" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              {{ t('profilePage.sections.storeOwner.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('profilePage.sections.storeOwner.description') }}
            </p>
            <div class="grid gap-4 md:grid-cols-2">
              <UButton
                :label="
                  t('profilePage.sections.storeOwner.actions.storeSettings')
                "
                icon="i-heroicons-building-storefront"
                block
              />
              <UButton
                :label="
                  t('profilePage.sections.storeOwner.actions.paymentSettings')
                "
                icon="i-heroicons-banknotes"
                block
              />
              <UButton
                :label="
                  t('profilePage.sections.storeOwner.actions.shippingSettings')
                "
                icon="i-heroicons-truck"
                block
              />
              <UButton
                :label="
                  t('profilePage.sections.storeOwner.actions.taxSettings')
                "
                icon="i-heroicons-document"
                block
              />
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="userRoles.includes('support')" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              {{ t('profilePage.sections.support.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('profilePage.sections.support.description') }}
            </p>
            <div class="grid gap-4 md:grid-cols-2">
              <UButton
                :label="
                  t('profilePage.sections.support.actions.notificationSettings')
                "
                icon="i-heroicons-bell"
                block
              />
              <UButton
                :label="
                  t('profilePage.sections.support.actions.quickResponses')
                "
                icon="i-heroicons-chat-bubble-left-right"
                block
              />
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="userRoles.includes('employee')" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              {{ t('profilePage.sections.employee.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('profilePage.sections.employee.description') }}
            </p>
            <div class="grid gap-4 md:grid-cols-2">
              <UButton
                :label="t('profilePage.sections.employee.actions.workSchedule')"
                icon="i-heroicons-calendar"
                block
              />
              <UButton
                :label="t('profilePage.sections.employee.actions.timeTracking')"
                icon="i-heroicons-clock"
                block
              />
            </div>
          </div>
        </UCard>
      </div>

      <div v-if="userRoles.includes('vendor')" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">
              {{ t('profilePage.sections.vendor.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('profilePage.sections.vendor.description') }}
            </p>
            <div class="grid gap-4 md:grid-cols-2">
              <UButton
                :label="
                  t('profilePage.sections.vendor.actions.companyInformation')
                "
                icon="i-heroicons-building-office"
                block
              />
              <UButton
                :label="t('profilePage.sections.vendor.actions.bankDetails')"
                icon="i-heroicons-banknotes"
                block
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Account Security -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('profilePage.sections.security.title') }}
          </h2>
        </template>
        <div class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <UButton
              :label="t('profilePage.sections.security.actions.changePassword')"
              icon="i-heroicons-lock-closed"
              block
            />
            <UButton
              :label="t('profilePage.sections.security.actions.twoFactor')"
              icon="i-heroicons-shield-check"
              block
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
