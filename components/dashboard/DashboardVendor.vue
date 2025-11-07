<script setup lang="ts">
import type { User } from '~/types/auth';

const localePath = useLocalePath();
const { t } = useI18n();

defineProps<{
  user: User;
}>();
</script>

<template>
  <div class="space-y-6">
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          {{ t('dashboards.vendor.title') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('dashboards.vendor.subtitle') }}
        </p>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700">
          {{
            t('dashboards.vendor.description', {
              name: user.name,
            })
          }}
        </p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.vendor.stats.purchaseOrders.title') }}
            </h3>
            <p class="text-3xl font-bold text-blue-600">15</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.vendor.stats.purchaseOrders.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.vendor.stats.productsListed.title') }}
            </h3>
            <p class="text-3xl font-bold text-purple-600">89</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.vendor.stats.productsListed.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.vendor.stats.pendingShipments.title') }}
            </h3>
            <p class="text-3xl font-bold text-orange-600">7</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.vendor.stats.pendingShipments.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.vendor.stats.revenue.title') }}
            </h3>
            <p class="text-3xl font-bold text-green-600">$45K</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.vendor.stats.revenue.subtitle') }}
            </p>
          </UCard>
        </div>
        <div class="flex gap-2">
          <UButton
            :to="localePath('/internal')"
            :label="t('dashboards.vendor.actions.vendorPortal')"
            color="primary"
          />
          <UButton
            :to="localePath('/profile')"
            :label="t('dashboards.vendor.actions.myProfile')"
            variant="outline"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
