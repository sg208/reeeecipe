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
          {{ t('dashboards.customer.title', { name: user.name }) }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('dashboards.customer.subtitle') }}
        </p>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700">
          {{ t('dashboards.customer.description') }}
        </p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.customer.stats.recentOrders.title') }}
            </h3>
            <p class="text-3xl font-bold text-primary-600">5</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.customer.stats.recentOrders.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.customer.stats.savedItems.title') }}
            </h3>
            <p class="text-3xl font-bold text-primary-600">12</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.customer.stats.savedItems.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.customer.stats.rewardPoints.title') }}
            </h3>
            <p class="text-3xl font-bold text-primary-600">450</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.customer.stats.rewardPoints.subtitle') }}
            </p>
          </UCard>
        </div>
        <div class="flex gap-2">
          <UButton
            :to="localePath('/store')"
            :label="t('dashboards.customer.actions.browseStore')"
            color="primary"
          />
          <UButton
            :to="localePath('/profile')"
            :label="t('dashboards.customer.actions.myProfile')"
            variant="outline"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
