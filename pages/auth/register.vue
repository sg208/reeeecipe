<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

definePageMeta({
  middleware: 'guest',
  layout: 'default',
});

const { t } = useI18n();
const { register } = useAuth();
const router = useRouter();
const toast = useToast();
const localePath = useLocalePath();

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'name',
    type: 'text',
    label: t('auth.fields.name.label'),
    placeholder: t('auth.fields.name.placeholder'),
    required: true,
  },
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
  {
    name: 'password_confirmation',
    label: t('auth.fields.passwordConfirmation.label'),
    type: 'password',
    placeholder: t('auth.fields.passwordConfirmation.placeholder'),
    required: true,
  },
]);

const schema = z
  .object({
    name: z.string().min(2, t('auth.validation.nameLength')),
    email: z.string().email(t('auth.validation.invalidEmail')),
    password: z.string().min(6, t('auth.validation.passwordLength')),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: t('auth.validation.passwordMismatch'),
    path: ['password_confirmation'],
  });

type Schema = z.output<typeof schema>;

const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit(payload: FormSubmitEvent<Schema>): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    await register({
      name: payload.data.name,
      email: payload.data.email,
      password: payload.data.password,
      password_confirmation: payload.data.password_confirmation,
    });

    toast.add({
      title: t('auth.register.toast.successTitle'),
      description: t('auth.register.toast.successDescription'),
      color: 'success',
    });

    await router.push(localePath('/'));
  } catch (err: unknown) {
    const fallbackDescription = t('auth.register.toast.errorDescription');

    if (err instanceof Error) {
      error.value = err.message;
      toast.add({
        title: t('auth.register.toast.errorTitle'),
        description: err.message,
        color: 'error',
      });
    } else {
      error.value = fallbackDescription;
      toast.add({
        title: t('auth.register.toast.errorTitle'),
        description: fallbackDescription,
        color: 'error',
      });
    }
  } finally {
    loading.value = false;
  }
}

useHead({
  title: computed(() => t('auth.register.title')),
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :title="t('auth.register.title')"
        :description="t('auth.register.description')"
        icon="i-heroicons-user-plus"
        :loading="loading"
        :submit="{ label: t('auth.register.submit'), block: true }"
        @submit="onSubmit"
      >
        <template #description>
          {{ t('auth.register.alreadyHaveAccount') }}
          <ULink
            :to="localePath('/auth/login')"
            class="font-medium text-primary"
          >
            {{ t('auth.register.signIn') }}
          </ULink>
          .
        </template>

        <template v-if="error" #validation>
          <UAlert
            color="error"
            icon="i-heroicons-information-circle"
            :title="error"
          />
        </template>

        <template #footer>
          {{ t('auth.register.agreementPrefix') }}
          <ULink :to="localePath('/terms')" class="font-medium text-primary">{{
            t('common.termsOfService')
          }}</ULink>
          {{ t('auth.register.agreementAnd') }}
          <ULink
            :to="localePath('/privacy')"
            class="font-medium text-primary"
            >{{ t('common.privacyPolicy') }}</ULink
          >.
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>
