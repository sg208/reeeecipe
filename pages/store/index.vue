<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'end-user'],
  title: 'Store',
});

const { t } = useI18n();
const { hasRole } = useRoleCheck();

const isStoreOwner = computed(() => hasRole('store_owner'));

useHead({
  title: computed(() => t('storePage.title')),
});
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">
      {{ t('storePage.title') }}
    </h1>

    <!-- Store Owner View -->
    <div v-if="isStoreOwner" class="space-y-6">
      <UAlert
        icon="i-heroicons-building-storefront"
        color="primary"
        :title="t('storePage.ownerAlert.title')"
        :description="t('storePage.ownerAlert.description')"
      />

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">
              {{ t('storePage.sections.products.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('storePage.sections.products.description') }}
            </p>
            <UButton
              :label="t('storePage.sections.products.action')"
              icon="i-heroicons-shopping-bag"
              block
            />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">
              {{ t('storePage.sections.orders.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('storePage.sections.orders.description') }}
            </p>
            <UButton
              :label="t('storePage.sections.orders.action')"
              icon="i-heroicons-shopping-cart"
              block
            />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">
              {{ t('storePage.sections.analytics.title') }}
            </h2>
          </template>
          <div class="space-y-4">
            <p class="text-gray-600">
              {{ t('storePage.sections.analytics.description') }}
            </p>
            <UButton
              :label="t('storePage.sections.analytics.action')"
              icon="i-heroicons-chart-bar"
              block
            />
          </div>
        </UCard>
      </div>
    </div>

    <!-- Customer View -->
    <div v-else class="space-y-6">
      <UAlert
        icon="i-heroicons-shopping-bag"
        color="primary"
        :title="t('storePage.customerAlert.title')"
        :description="t('storePage.customerAlert.description')"
      />

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UCard v-for="i in 8" :key="i">
          <div class="aspect-square rounded-lg bg-gray-200" />
          <div class="mt-4 space-y-2">
            <h3 class="font-semibold">
              {{ t('storePage.productCard.name', { index: i }) }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ t('storePage.productCard.description') }}
            </p>
            <div class="flex items-center justify-between">
              <p class="text-lg font-bold text-primary-600">$29.99</p>
              <UButton
                :label="t('storePage.productCard.action')"
                size="sm"
                icon="i-heroicons-shopping-cart"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
