<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

definePageMeta({
  middleware: 'guest',
  layout: 'default',
});

const { t } = useI18n();
const { login } = useAuth();
const router = useRouter();
const route = useRoute();
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
  {
    name: 'password',
    label: t('auth.fields.password.label'),
    type: 'password',
    placeholder: t('auth.fields.password.placeholder'),
    required: true,
  },
]);

const schema = z.object({
  email: z.string().email(t('auth.validation.invalidEmail')),
  password: z.string().min(6, t('auth.validation.passwordLength')),
});

type Schema = z.output<typeof schema>;

const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit(payload: FormSubmitEvent<Schema>): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    await login({
      email: payload.data.email,
      password: payload.data.password,
    });

    toast.add({
      title: t('auth.login.toast.successTitle'),
      description: t('auth.login.toast.successDescription'),
      color: 'success',
    });

    // Redirect to original page or home
    const redirectQuery = route.query.redirect as string | undefined;
    const redirectTo = redirectQuery ?? localePath('/');
    await router.push(redirectTo);
  } catch (err: unknown) {
    const fallbackDescription = t('auth.login.toast.errorDescription');
    const invalidCredentials = t('auth.login.toast.invalidCredentials', {
      email: 'user@example.com',
      password: 'password',
    });

    if (err instanceof Error) {
      error.value = err.message;
      toast.add({
        title: t('auth.login.toast.errorTitle'),
        description: err.message || fallbackDescription,
        color: 'error',
      });
    } else {
      error.value = fallbackDescription;
      toast.add({
        title: t('auth.login.toast.errorTitle'),
        description: invalidCredentials,
        color: 'error',
      });
    }
  } finally {
    loading.value = false;
  }
}

useHead({
  title: computed(() => t('navigation.login')),
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :title="t('auth.login.title')"
        :description="t('auth.login.description')"
        icon="i-heroicons-lock-closed"
        :loading="loading"
        :submit="{ label: t('auth.login.submit'), block: true }"
        @submit="onSubmit"
      >
        <template #description>
          {{ t('auth.login.noAccount') }}
          <ULink
            :to="localePath('/auth/register')"
            class="font-medium text-primary"
          >
            {{ t('auth.login.signUp') }}
          </ULink>
          .
        </template>

        <template #password-hint>
          <ULink
            :to="localePath('/auth/forgot-password')"
            class="font-medium text-primary"
            tabindex="-1"
          >
            {{ t('auth.login.forgotPassword') }}
          </ULink>
        </template>

        <template v-if="error" #validation>
          <UAlert
            color="error"
            icon="i-heroicons-information-circle"
            :title="error"
          />
        </template>

        <template #footer>
          <p class="text-sm text-muted">
            {{
              t('auth.login.testingNotice', {
                email: 'user@example.com',
                password: 'password',
              })
            }}
          </p>
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>
