<script setup lang="ts">
definePageMeta({
  title: 'Auth Debug',
});

const { t } = useI18n();
const { user, isAuthenticated, isLoading, error } = useAuth();
const { getToken, hasToken } = useAuthToken();
const localePath = useLocalePath();

const tokenInfo = ref({
  exists: false,
  value: '',
  length: 0,
});

const checkLocalStorage = (): void => {
  if (import.meta.client) {
    const token = getToken();
    tokenInfo.value = {
      exists: hasToken(),
      value: token
        ? `${token.substring(0, 20)}...${token.substring(token.length - 10)}`
        : '',
      length: token?.length || 0,
    };

    console.log('=== Auth Debug Info ===');
    console.log('Token exists:', hasToken());
    console.log('Token (truncated):', tokenInfo.value.value);
    console.log('Token length:', tokenInfo.value.length);
    console.log('User:', user.value);
    console.log('Is authenticated:', isAuthenticated.value);
    console.log('======================');
  }
};

onMounted(() => {
  checkLocalStorage();
});

useHead({
  title: computed(() => t('debugAuth.title')),
});
</script>

<template>
  <div class="container mx-auto p-8">
    <div class="max-w-2xl space-y-6">
      <h1 class="text-3xl font-bold">
        {{ t('debugAuth.title') }}
      </h1>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('debugAuth.sections.status.title') }}
          </h2>
        </template>
        <div class="space-y-4">
          <div>
            <strong>{{ t('debugAuth.sections.status.statusLabel') }}</strong>
            <UBadge :color="isAuthenticated ? 'success' : 'error'" class="ml-2">
              {{ isAuthenticated ? t('common.yes') : t('common.no') }}
            </UBadge>
          </div>
          <div>
            <strong>{{ t('debugAuth.sections.status.loadingLabel') }}</strong>
            <span class="ml-2">
              {{ isLoading ? t('common.yes') : t('common.no') }}
            </span>
          </div>
          <div v-if="error">
            <strong>{{ t('debugAuth.sections.status.errorLabel') }}</strong>
            <pre class="mt-2 rounded bg-red-100 p-4 text-sm">{{ error }}</pre>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('debugAuth.sections.userData.title') }}
          </h2>
        </template>
        <div class="space-y-4">
          <div v-if="user">
            <pre class="rounded bg-gray-100 p-4 text-sm">{{
              JSON.stringify(user, null, 2)
            }}</pre>
          </div>
          <div v-else>
            <p class="text-gray-500">
              {{ t('debugAuth.sections.userData.empty') }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('debugAuth.sections.token.title') }}
          </h2>
        </template>
        <div class="space-y-4">
          <div>
            <strong>{{ t('debugAuth.sections.token.existsLabel') }}</strong>
            <UBadge
              :color="tokenInfo.exists ? 'success' : 'error'"
              class="ml-2"
            >
              {{ tokenInfo.exists ? t('common.yes') : t('common.no') }}
            </UBadge>
          </div>
          <div v-if="tokenInfo.exists">
            <strong>{{ t('debugAuth.sections.token.valueLabel') }}</strong>
            <pre class="mt-2 rounded bg-gray-100 p-4 text-xs break-all">{{
              tokenInfo.value
            }}</pre>
          </div>
          <div v-if="tokenInfo.exists">
            <strong>{{ t('debugAuth.sections.token.lengthLabel') }}</strong>
            <span class="ml-2">
              {{ t('debugAuth.tokenCharacters', { count: tokenInfo.length }) }}
            </span>
          </div>
          <UButton
            icon="i-heroicons-arrow-path"
            :label="t('debugAuth.buttons.checkConsole')"
            @click="checkLocalStorage"
          />
          <div>
            <p class="text-sm text-gray-500">
              {{ t('debugAuth.hints.console') }}
            </p>
            <p class="mt-2 text-sm text-gray-500">
              {{ t('debugAuth.hints.storage') }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">
            {{ t('debugAuth.sections.instructions.title') }}
          </h2>
        </template>
        <div class="space-y-2 text-sm">
          <p>
            1. {{ t('debugAuth.sections.instructions.steps.login') }}
            <ULink :to="localePath('/auth/login')" class="text-primary"
              >/auth/login</ULink
            >
          </p>
          <p>
            • {{ t('debugAuth.sections.instructions.steps.email') }}
            <code class="rounded bg-gray-100 px-2 py-1">user@example.com</code>
          </p>
          <p>
            • {{ t('debugAuth.sections.instructions.steps.password') }}
            <code class="rounded bg-gray-100 px-2 py-1">password</code>
          </p>
          <p>2. {{ t('debugAuth.sections.instructions.steps.return') }}</p>
          <p>3. {{ t('debugAuth.sections.instructions.steps.checkData') }}</p>
          <p>4. {{ t('debugAuth.sections.instructions.steps.checkToken') }}</p>
          <p>5. {{ t('debugAuth.sections.instructions.steps.newTab') }}</p>
          <p>6. {{ t('debugAuth.sections.instructions.steps.persist') }}</p>
          <p>
            7. {{ t('debugAuth.sections.instructions.steps.dashboard') }}
            <ULink :to="localePath('/dashboard')" class="text-primary"
              >/dashboard</ULink
            >
          </p>
        </div>
      </UCard>

      <div class="flex gap-4">
        <UButton
          v-if="!isAuthenticated"
          :to="localePath('/auth/login')"
          :label="t('debugAuth.buttons.goToLogin')"
          color="primary"
          icon="i-heroicons-arrow-right-on-rectangle"
        />
        <UButton
          v-else
          :to="localePath('/dashboard')"
          :label="t('debugAuth.buttons.goToDashboard')"
          color="primary"
          icon="i-heroicons-home"
        />
        <UButton
          :to="localePath('/')"
          :label="t('debugAuth.buttons.goHome')"
          variant="outline"
          icon="i-heroicons-arrow-left"
        />
      </div>
    </div>
  </div>
</template>
