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
          {{ t('dashboards.storeOwner.title') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('dashboards.storeOwner.subtitle') }}
        </p>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700">
          {{
            t('dashboards.storeOwner.description', {
              name: user.name,
            })
          }}
        </p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.storeOwner.stats.totalSales.title') }}
            </h3>
            <p class="text-3xl font-bold text-green-600">$12,450</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.storeOwner.stats.totalSales.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.storeOwner.stats.orders.title') }}
            </h3>
            <p class="text-3xl font-bold text-blue-600">89</p>
            <p class="text-sm text-gray-500">
              {{
                t('dashboards.storeOwner.stats.orders.subtitle', { pending: 5 })
              }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.storeOwner.stats.products.title') }}
            </h3>
            <p class="text-3xl font-bold text-purple-600">124</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.storeOwner.stats.products.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.storeOwner.stats.customers.title') }}
            </h3>
            <p class="text-3xl font-bold text-orange-600">456</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.storeOwner.stats.customers.subtitle') }}
            </p>
          </UCard>
        </div>
        <div class="flex gap-2">
          <UButton
            :to="localePath('/store')"
            :label="t('dashboards.storeOwner.actions.manageStore')"
            color="primary"
          />
          <UButton
            :to="localePath('/profile')"
            :label="t('dashboards.storeOwner.actions.storeSettings')"
            variant="outline"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
