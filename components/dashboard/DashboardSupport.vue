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
          {{ t('dashboards.support.title') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('dashboards.support.subtitle') }}
        </p>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700">
          {{
            t('dashboards.support.description', {
              name: user.name,
            })
          }}
        </p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.support.stats.openTickets.title') }}
            </h3>
            <p class="text-3xl font-bold text-red-600">23</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.support.stats.openTickets.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.support.stats.resolvedToday.title') }}
            </h3>
            <p class="text-3xl font-bold text-green-600">45</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.support.stats.resolvedToday.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.support.stats.avgResponse.title') }}
            </h3>
            <p class="text-3xl font-bold text-blue-600">2.5h</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.support.stats.avgResponse.subtitle') }}
            </p>
          </UCard>
          <UCard>
            <h3 class="font-semibold text-gray-700">
              {{ t('dashboards.support.stats.satisfaction.title') }}
            </h3>
            <p class="text-3xl font-bold text-purple-600">4.8★</p>
            <p class="text-sm text-gray-500">
              {{ t('dashboards.support.stats.satisfaction.subtitle') }}
            </p>
          </UCard>
        </div>
        <div class="flex gap-2">
          <UButton
            :to="localePath('/internal')"
            :label="t('dashboards.support.actions.supportTools')"
            color="primary"
          />
          <UButton
            :to="localePath('/profile')"
            :label="t('dashboards.support.actions.myProfile')"
            variant="outline"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
