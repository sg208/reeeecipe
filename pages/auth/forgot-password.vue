<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

definePageMeta({
  middleware: 'guest',
  layout: 'default',
});

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const localePath = useLocalePath();

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'email',
    type: 'email',
    label: t('auth.fields.email.label'),
    placeholder: t('auth.fields.email.placeholder'),
    required: true,
  },
]);

const schema = z.object({
  email: z.string().email(t('auth.validation.invalidEmail')),
});

type Schema = z.output<typeof schema>;

const loading = ref(false);
const success = ref(false);
const error = ref<string | null>(null);

async function onSubmit(_payload: FormSubmitEvent<Schema>): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    // Mock implementation - in real app, would call API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success.value = true;
    toast.add({
      title: t('auth.forgotPassword.toast.successTitle'),
      description: t('auth.forgotPassword.toast.successDescription'),
      color: 'success',
    });

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push(localePath('/auth/login'));
    }, 3000);

    /* LARAVEL PASSPORT IMPLEMENTATION (uncomment when Laravel backend is ready)
    
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: payload.data.email,
      },
    });
    
    */
  } catch (err: unknown) {
    const fallbackDescription = t('auth.forgotPassword.toast.errorDescription');

    if (err instanceof Error) {
      error.value = err.message;
      toast.add({
        title: t('auth.forgotPassword.toast.errorTitle'),
        description: err.message,
        color: 'error',
      });
    } else {
      error.value = fallbackDescription;
      toast.add({
        title: t('auth.forgotPassword.toast.errorTitle'),
        description: fallbackDescription,
        color: 'error',
      });
    }
  } finally {
    loading.value = false;
  }
}

useHead({
  title: computed(() => t('auth.forgotPassword.title')),
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <UAuthForm
        v-if="!success"
        :schema="schema"
        :fields="fields"
        :title="t('auth.forgotPassword.title')"
        :description="t('auth.forgotPassword.description')"
        icon="i-heroicons-key"
        :loading="loading"
        :submit="{ label: t('auth.forgotPassword.submit'), block: true }"
        @submit="onSubmit"
      >
        <template v-if="error" #validation>
          <UAlert
            color="error"
            icon="i-heroicons-information-circle"
            :title="error"
          />
        </template>

        <template #footer>
          <ULink
            :to="localePath('/auth/login')"
            class="font-medium text-primary"
          >
            {{ t('common.backToLogin') }}
          </ULink>
        </template>
      </UAuthForm>

      <div v-else class="space-y-4 p-6 text-center">
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100"
        >
          <UIcon name="i-heroicons-check" class="h-6 w-6 text-success-600" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-highlighted">
            {{ t('auth.forgotPassword.successHeading') }}
          </h3>
          <p class="mt-2 text-sm text-muted">
            {{ t('auth.forgotPassword.successDescription') }}
          </p>
          <p class="mt-4 text-sm text-muted">
            {{ t('common.redirecting') }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
