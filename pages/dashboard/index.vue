<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { AuthLoginPayload } from '~/types';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  middleware: ['dashboard-auth'],
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const { login, user, isAuthenticated, isLoading, errorMessage } = useAuth();

const formState = reactive({
  email: '',
  password: '',
});

const redirectTarget = computed(() => {
  const redirect = route.query.redirect;
  if (Array.isArray(redirect)) {
    return redirect[0];
  }
  return typeof redirect === 'string' ? redirect : null;
});

const authFields = computed(() => [
  {
    name: 'email',
    label: t('auth.emailLabel'),
    type: 'email' as const,
    placeholder: t('auth.emailPlaceholder'),
    required: true,
  },
  {
    name: 'password',
    label: t('auth.passwordLabel'),
    type: 'password' as const,
    placeholder: '••••••••',
    required: true,
  },
]);

type AuthFormSubmitEvent = SubmitEvent & { data: AuthLoginPayload };

const handleSubmit = async (event: AuthFormSubmitEvent): Promise<void> => {
  try {
    await login(event.data);

    if (redirectTarget.value) {
      await router.replace(redirectTarget.value);
    }
  } catch {
    // Error message is managed inside useAuth
  }
};

const dashboardSections = computed(() => [
  {
    icon: 'heroicons:chart-bar-20-solid',
    title: t('dashboard.placeholder.metricsTitle'),
    description: t('dashboard.placeholder.metricsDescription'),
  },
  {
    icon: 'heroicons:document-text-20-solid',
    title: t('dashboard.placeholder.recipesTitle'),
    description: t('dashboard.placeholder.recipesDescription'),
  },
  {
    icon: 'heroicons:user-group-20-solid',
    title: t('dashboard.placeholder.communityTitle'),
    description: t('dashboard.placeholder.communityDescription'),
  },
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-16">
      <div v-if="isAuthenticated" class="space-y-10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase tracking-wider text-gray-500">
              {{ t('dashboard.placeholder.welcome') }}
            </p>
            <h1 class="mt-2 text-4xl font-bold text-gray-900">
              {{ t('dashboard.placeholder.heading') }}
            </h1>
            <p v-if="user" class="mt-2 text-sm text-gray-600">
              {{
                t('dashboard.placeholder.userSummary', {
                  name: user.name,
                })
              }}
            </p>
            <p class="mt-3 max-w-2xl text-lg text-gray-600">
              {{ t('dashboard.placeholder.subheading') }}
            </p>
          </div>
          <div
            class="hidden shrink-0 rounded-full border border-primary-200 bg-primary-50 p-4 text-primary-700 lg:block"
          >
            <Icon name="heroicons:swatch-20-solid" class="h-10 w-10" />
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <div
            v-for="section in dashboardSections"
            :key="section.title"
            class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <Icon :name="section.icon" class="h-6 w-6 text-primary-600" />
              <h2 class="text-xl font-semibold text-gray-900">
                {{ section.title }}
              </h2>
            </div>
            <p class="mt-4 text-sm text-gray-600">
              {{ section.description }}
            </p>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-2xl font-semibold text-gray-900">
            {{ t('dashboard.placeholder.nextStepsTitle') }}
          </h2>
          <p class="mb-6 text-gray-600">
            {{ t('dashboard.placeholder.nextStepsDescription') }}
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-lg border border-primary-100 bg-primary-50 p-4">
              <h3 class="text-lg font-semibold text-primary-900">
                {{ t('dashboard.placeholder.setupProfileTitle') }}
              </h3>
              <p class="mt-2 text-sm text-primary-800">
                {{ t('dashboard.placeholder.setupProfileDescription') }}
              </p>
            </div>
            <div class="rounded-lg border border-secondary-100 bg-white p-4">
              <h3 class="text-lg font-semibold text-secondary-900">
                {{ t('dashboard.placeholder.exploreTitle') }}
              </h3>
              <p class="mt-2 text-sm text-secondary-800">
                {{ t('dashboard.placeholder.exploreDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mx-auto max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <UAuthForm
          icon="heroicons:lock-closed"
          :title="t('auth.title')"
          :description="t('auth.description')"
          :fields="authFields"
          :loading="isLoading"
          :submit="{ label: t('auth.signInButton') }"
          :ui="{
            title: 'text-gray-900',
            description: 'text-gray-700',
            leadingIcon: 'text-primary-600',
            base: 'space-y-6',
            container: 'space-y-6',
            default: {
              size: 'md',
              color: 'gray',
            },
          }"
          @submit="handleSubmit"
        >
          <template #password="{ field }">
            <UFormGroup
              :label="field.label"
              :name="field.name"
              :ui="{ label: 'text-gray-900 font-medium mb-2' }"
            >
              <UInput
                v-model="formState.password"
                type="password"
                :placeholder="field.placeholder"
                :required="field.required"
                size="lg"
                :ui="{
                  base: '!bg-white !text-gray-900 !border-gray-300',
                  rounded: 'rounded-md',
                  placeholder: 'placeholder-gray-400',
                  size: {
                    lg: 'text-base',
                  },
                  variant: {
                    outline:
                      '!bg-white !text-gray-900 !border !border-gray-300 focus:!border-primary-500 focus:!ring-2 focus:!ring-primary-500',
                  },
                  icon: {
                    trailing: {
                      pointer: '',
                      padding: {
                        lg: 'px-3',
                      },
                      color: {
                        gray: {
                          outline: '!text-gray-500',
                        },
                      },
                    },
                  },
                }"
                variant="outline"
              />
            </UFormGroup>
          </template>

          <template #email="{ field }">
            <UFormGroup
              :label="field.label"
              :name="field.name"
              :ui="{ label: 'text-gray-900 font-medium mb-2' }"
            >
              <UInput
                v-model="formState.email"
                type="email"
                :placeholder="field.placeholder"
                :required="field.required"
                size="lg"
                :ui="{
                  base: '!bg-white !text-gray-900 !border-gray-300',
                  rounded: 'rounded-md',
                  placeholder: 'placeholder-gray-400',
                  size: {
                    lg: 'text-base',
                  },
                  variant: {
                    outline:
                      '!bg-white !text-gray-900 !border !border-gray-300 focus:!border-primary-500 focus:!ring-2 focus:!ring-primary-500',
                  },
                }"
                variant="outline"
              />
            </UFormGroup>
          </template>
          <template v-if="errorMessage" #validation>
            <div
              class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {{ errorMessage }}
            </div>
          </template>

          <template #footer>
            <p class="text-center text-sm text-gray-600">
              <NuxtLink
                to="/forgot-password"
                class="font-medium text-primary-600 transition-colors hover:text-primary-500 hover:underline"
              >
                {{ t('auth.forgotPassword') }}
              </NuxtLink>
            </p>
          </template>
        </UAuthForm>
      </div>
    </div>
  </div>
</template>
