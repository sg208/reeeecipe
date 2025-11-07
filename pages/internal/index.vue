<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'internal'],
  title: 'Internal Tools',
});

const { t } = useI18n();
const { hasRole } = useRoleCheck();

const canAccessSupport = computed(() => hasRole('support'));
const canAccessOperations = computed(
  () => hasRole('employee') || hasRole('support')
);
const canAccessVendor = computed(() => hasRole('vendor'));

useHead({
  title: computed(() => t('internalPage.title')),
});
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">
        {{ t('internalPage.title') }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ t('internalPage.description') }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Support Section -->
      <UCard v-if="canAccessSupport">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="h-5 w-5" />
            <h2 class="text-xl font-semibold">
              {{ t('internalPage.sections.support.title') }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('internalPage.sections.support.description') }}
          </p>
          <div class="space-y-2">
            <UButton
              :label="
                t('internalPage.sections.support.actions.customerTickets')
              "
              icon="i-heroicons-ticket"
              block
              variant="soft"
            />
            <UButton
              :label="
                t('internalPage.sections.support.actions.customerManagement')
              "
              icon="i-heroicons-users"
              block
              variant="soft"
            />
            <UButton
              :label="t('internalPage.sections.support.actions.liveChat')"
              icon="i-heroicons-chat-bubble-left-ellipsis"
              block
              variant="soft"
            />
          </div>
        </div>
      </UCard>

      <!-- Operations Section -->
      <UCard v-if="canAccessOperations">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-cog-6-tooth" class="h-5 w-5" />
            <h2 class="text-xl font-semibold">
              {{ t('internalPage.sections.operations.title') }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('internalPage.sections.operations.description') }}
          </p>
          <div class="space-y-2">
            <UButton
              :label="
                t(
                  'internalPage.sections.operations.actions.inventoryManagement'
                )
              "
              icon="i-heroicons-cube"
              block
              variant="soft"
            />
            <UButton
              :label="
                t('internalPage.sections.operations.actions.orderProcessing')
              "
              icon="i-heroicons-shopping-cart"
              block
              variant="soft"
            />
            <UButton
              :label="
                t('internalPage.sections.operations.actions.shippingLogistics')
              "
              icon="i-heroicons-truck"
              block
              variant="soft"
            />
          </div>
        </div>
      </UCard>

      <!-- Vendor Section -->
      <UCard v-if="canAccessVendor">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-building-office" class="h-5 w-5" />
            <h2 class="text-xl font-semibold">
              {{ t('internalPage.sections.vendor.title') }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('internalPage.sections.vendor.description') }}
          </p>
          <div class="space-y-2">
            <UButton
              :label="t('internalPage.sections.vendor.actions.productCatalog')"
              icon="i-heroicons-shopping-bag"
              block
              variant="soft"
            />
            <UButton
              :label="t('internalPage.sections.vendor.actions.purchaseOrders')"
              icon="i-heroicons-document-text"
              block
              variant="soft"
            />
            <UButton
              :label="t('internalPage.sections.vendor.actions.shipments')"
              icon="i-heroicons-truck"
              block
              variant="soft"
            />
          </div>
        </div>
      </UCard>

      <!-- Analytics Section (all internal staff) -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-chart-bar" class="h-5 w-5" />
            <h2 class="text-xl font-semibold">
              {{ t('internalPage.sections.analytics.title') }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('internalPage.sections.analytics.description') }}
          </p>
          <div class="space-y-2">
            <UButton
              :label="t('internalPage.sections.analytics.actions.salesReports')"
              icon="i-heroicons-chart-pie"
              block
              variant="soft"
            />
            <UButton
              :label="
                t('internalPage.sections.analytics.actions.performanceMetrics')
              "
              icon="i-heroicons-presentation-chart-line"
              block
              variant="soft"
            />
          </div>
        </div>
      </UCard>

      <!-- System Admin (all internal staff) -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-server" class="h-5 w-5" />
            <h2 class="text-xl font-semibold">
              {{ t('internalPage.sections.system.title') }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('internalPage.sections.system.description') }}
          </p>
          <div class="space-y-2">
            <UButton
              :label="t('internalPage.sections.system.actions.systemSettings')"
              icon="i-heroicons-cog-8-tooth"
              block
              variant="soft"
            />
            <UButton
              :label="t('internalPage.sections.system.actions.userManagement')"
              icon="i-heroicons-user-group"
              block
              variant="soft"
            />
          </div>
        </div>
      </UCard>

      <!-- Reports (all internal staff) -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-chart-bar" class="h-5 w-5" />
            <h2 class="text-xl font-semibold">
              {{ t('internalPage.sections.reports.title') }}
            </h2>
          </div>
        </template>
        <div class="space-y-4">
          <p class="text-gray-600">
            {{ t('internalPage.sections.reports.description') }}
          </p>
          <div class="space-y-2">
            <UButton
              :label="t('internalPage.sections.reports.actions.dailyReports')"
              icon="i-heroicons-document"
              block
              variant="soft"
            />
            <UButton
              :label="t('internalPage.sections.reports.actions.customReports')"
              icon="i-heroicons-document-plus"
              block
              variant="soft"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
