<script setup lang="ts">
import { useFileUploadMutation } from '~/composables/queries/useFileUploadMutation';
import { useMultiFileUploadMutation } from '~/composables/queries/useMultiFileUploadMutation';
import type { FileWithProgress } from '~/types/upload';

definePageMeta({
  title: 'File Upload Demo',
});

const toast = useToast();
const { t } = useI18n();

useHead({
  title: computed(() => t('uploadDemo.title')),
});

const getStatusLabel = (status: FileWithProgress['status']): string => {
  return t(`uploadDemo.statuses.${status}`);
};

// Single file upload
const {
  mutate: uploadSingle,
  isPending: isSingleUploading,
  isSuccess: isSingleSuccess,
  isError: isSingleError,
  error: singleError,
  uploadProgress: singleProgress,
} = useFileUploadMutation();

// Multiple file upload
const {
  mutate: uploadMultiple,
  isPending: isMultipleUploading,
  files: multipleFiles,
} = useMultiFileUploadMutation();

// Single file upload handler
const handleSingleUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  uploadSingle(
    {
      file,
      url: '/api/upload/single',
      additionalData: {
        category: 'recipe-image',
        alt_text: 'Recipe image',
      },
    },
    {
      onSuccess: (data) => {
        toast.add({
          title: t('uploadDemo.toast.singleSuccessTitle'),
          description: t('uploadDemo.toast.singleSuccessDescription', {
            filename: data.filename,
          }),
          color: 'green',
        });
      },
      onError: (error) => {
        toast.add({
          title: t('uploadDemo.toast.singleErrorTitle'),
          description: t('uploadDemo.toast.singleErrorDescription', {
            message: error.message,
          }),
          color: 'red',
        });
      },
    }
  );
};

// Multiple file upload handler
const handleMultipleUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const fileList = target.files;

  if (!fileList || fileList.length === 0) return;

  uploadMultiple(
    {
      files: Array.from(fileList),
      url: '/api/upload/multiple',
      additionalData: {
        category: 'recipe-images',
      },
    },
    {
      onSuccess: (data) => {
        toast.add({
          title: t('uploadDemo.toast.multipleSuccessTitle'),
          description: t('uploadDemo.toast.multipleSuccessDescription', {
            count: data.length,
          }),
          color: 'green',
        });
      },
    }
  );
};
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-8 text-3xl font-bold">
      {{ t('uploadDemo.title') }}
    </h1>

    <!-- Single File Upload -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="text-xl font-semibold">
          {{ t('uploadDemo.single.title') }}
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">
            {{ t('uploadDemo.single.chooseLabel') }}
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            :disabled="isSingleUploading"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
            @change="handleSingleUpload"
          />
        </div>

        <!-- Upload Progress -->
        <div v-if="isSingleUploading" class="space-y-2">
          <UProgress :value="singleProgress" :max="100" color="primary" />
          <p class="text-sm text-gray-600">
            {{ t('uploadDemo.single.uploading', { progress: singleProgress }) }}
          </p>
        </div>

        <!-- Success Message -->
        <UAlert
          v-if="isSingleSuccess"
          color="green"
          icon="i-heroicons-check-circle"
          :title="t('uploadDemo.single.successAlert.title')"
          :description="t('uploadDemo.single.successAlert.description')"
        />

        <!-- Error Message -->
        <UAlert
          v-if="isSingleError"
          color="red"
          icon="i-heroicons-exclamation-circle"
          :title="
            singleError?.message || t('uploadDemo.single.errorAlert.title')
          "
        />
      </div>
    </UCard>

    <!-- Multiple File Upload -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">
          {{ t('uploadDemo.multiple.title') }}
        </h2>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">
            {{ t('uploadDemo.multiple.chooseLabel') }}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            :disabled="isMultipleUploading"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
            @change="handleMultipleUpload"
          />
        </div>

        <!-- Individual File Progress -->
        <div v-if="multipleFiles.size > 0" class="space-y-3">
          <div
            v-for="[fileId, fileData] in multipleFiles"
            :key="fileId"
            class="rounded-lg border border-gray-200 p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <UIcon
                  :name="
                    fileData.status === 'success'
                      ? 'i-heroicons-check-circle'
                      : fileData.status === 'error'
                        ? 'i-heroicons-x-circle'
                        : 'i-heroicons-arrow-path'
                  "
                  :class="
                    fileData.status === 'success'
                      ? 'text-green-500'
                      : fileData.status === 'error'
                        ? 'text-red-500'
                        : 'text-blue-500'
                  "
                />
                <p class="text-sm font-medium truncate max-w-xs">
                  {{ fileData.file.name }}
                </p>
              </div>
              <UBadge
                :color="
                  fileData.status === 'success'
                    ? 'green'
                    : fileData.status === 'error'
                      ? 'red'
                      : 'blue'
                "
              >
                {{ getStatusLabel(fileData.status) }}
              </UBadge>
            </div>

            <UProgress
              :value="fileData.progress"
              :max="100"
              :color="
                fileData.status === 'error'
                  ? 'red'
                  : fileData.status === 'success'
                    ? 'green'
                    : 'primary'
              "
            />

            <div class="flex justify-between items-center mt-2">
              <p class="text-xs text-gray-500">
                {{
                  t('uploadDemo.sizeLabel', {
                    size: (fileData.file.size / 1024).toFixed(2),
                  })
                }}
              </p>
              <p class="text-xs text-gray-600">{{ fileData.progress }}%</p>
            </div>

            <p v-if="fileData.error" class="text-xs text-red-500 mt-1">
              {{ fileData.error }}
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Documentation -->
    <UCard class="mt-8">
      <template #header>
        <h2 class="text-xl font-semibold">
          {{ t('uploadDemo.documentation.title') }}
        </h2>
      </template>

      <div class="prose prose-sm max-w-none">
        <h3>{{ t('uploadDemo.documentation.singleHeading') }}</h3>
        <pre
          class="bg-gray-50 p-4 rounded-lg overflow-x-auto"
        ><code>const { mutate, isPending, uploadProgress } = useFileUploadMutation();

const handleUpload = (file: File) => {
  mutate({
    file,
    url: '/api/recipes/upload-image',
    additionalData: { recipe_id: '123' }
  });
};</code></pre>

        <h3 class="mt-6">
          {{ t('uploadDemo.documentation.multipleHeading') }}
        </h3>
        <pre
          class="bg-gray-50 p-4 rounded-lg overflow-x-auto"
        ><code>const { mutate, files, isPending } = useMultiFileUploadMutation();

const handleUpload = (fileList: FileList) => {
  mutate({
    files: Array.from(fileList),
    url: '/api/recipes/upload-images'
  });
};</code></pre>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>{{ t('uploadDemo.documentation.noteLabel') }}</strong>
            {{ ' ' }}
            {{ t('uploadDemo.documentation.noteText') }}
            <code>composables/queries/useFileUploadMutation.ts</code>
            {{ t('uploadDemo.documentation.noteAnd') }}
            <code>composables/queries/useMultiFileUploadMutation.ts</code>
            {{ t('uploadDemo.documentation.noteSuffix') }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
