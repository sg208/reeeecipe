import {
  useMutation,
  useQueryClient,
  type UseMutationReturnType,
} from '@tanstack/vue-query';
import { ref, type Ref } from 'vue';
import type { FileUploadParams, UploadResponse } from '~/types/upload';

interface UseFileUploadMutationOptions {
  useMock?: boolean;
}

type FileUploadMutationReturn = UseMutationReturnType<
  UploadResponse,
  Error,
  FileUploadParams,
  unknown
> & {
  uploadProgress: Ref<number>;
};

/**
 * File upload mutation with progress tracking
 * Combines axios upload progress + TanStack Query state management
 *
 * @example
 * ```vue
 * const { mutate, isPending, uploadProgress } = useFileUploadMutation();
 *
 * const handleUpload = (file: File) => {
 *   mutate({
 *     file,
 *     url: '/api/recipes/upload-image',
 *     additionalData: { recipe_id: '123' }
 *   });
 * };
 * ```
 */
export const useFileUploadMutation = (
  options: UseFileUploadMutationOptions = {}
): FileUploadMutationReturn => {
  const { uploadFile } = useApiClient();
  const queryClient = useQueryClient();
  const shouldUseMock = options.useMock ?? true;

  // Track upload progress (0-100%)
  const uploadProgress = ref(0);

  const mutation = useMutation<UploadResponse, Error, FileUploadParams>({
    mutationFn: async ({
      file,
      url,
      additionalData,
    }): Promise<UploadResponse> => {
      // Reset progress at start
      uploadProgress.value = 0;

      if (shouldUseMock) {
        await new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            uploadProgress.value = Math.min(progress, 100);

            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 200); // Simulate 2 second upload
        });

        return {
          url: `https://cdn.example.com/uploads/${file.name}`,
          filename: file.name,
          size: file.size,
          message: 'File uploaded successfully',
        };
      }

      const response = await uploadFile<UploadResponse>(
        url,
        file,
        additionalData,
        (percent) => {
          uploadProgress.value = percent;
        }
      );

      return response;
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful upload
      // Adjust queryKey based on your needs
      queryClient.invalidateQueries({ queryKey: ['recipes'] });

      // Reset progress
      uploadProgress.value = 0;
    },
    onError: (error) => {
      console.error('Upload failed:', error);

      // Reset progress on error
      uploadProgress.value = 0;
    },
  });

  return {
    ...mutation,
    uploadProgress, // Expose progress (0-100) to components
  };
};
