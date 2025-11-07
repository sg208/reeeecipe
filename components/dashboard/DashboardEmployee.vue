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
          {{ t('dashboards.employee.title') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('dashboards.employee.subtitle') }}
        </p>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700">
          {{
            t('dashboards.employee.description', {
              name: user.name,
            })
          }}
        </p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.employee.stats.ordersToProcess.title') }}
            </h3>
            <p class="text-3xl font-bold text-orange-600">34</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.employee.stats.ordersToProcess.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.employee.stats.inventoryAlerts.title') }}
            </h3>
            <p class="text-3xl font-bold text-red-600">8</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.employee.stats.inventoryAlerts.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.employee.stats.shippedToday.title') }}
            </h3>
            <p class="text-3xl font-bold text-green-600">67</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.employee.stats.shippedToday.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.employee.stats.returns.title') }}
            </h3>
            <p class="text-3xl font-bold text-blue-600">12</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.employee.stats.returns.subtitle') }}
            </p>
          </UCard>
        </div>
        <div class="flex gap-2">
          <UButton
            :to="localePath('/internal')"
            :label="t('dashboards.employee.actions.operationsTools')"
            color="primary"
          />
          <UButton
            :to="localePath('/profile')"
            :label="t('dashboards.employee.actions.myProfile')"
            variant="outline"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
