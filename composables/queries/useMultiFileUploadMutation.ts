import {
  useMutation,
  useQueryClient,
  type UseMutationReturnType,
} from '@tanstack/vue-query';
import { reactive } from 'vue';
import type {
  FileWithProgress,
  MultiFileUploadParams,
  UploadAdditionalData,
  UploadResponse,
} from '~/types/upload';

interface UseMultiFileUploadMutationOptions {
  useMock?: boolean;
}

type MultiFileUploadMutationReturn = UseMutationReturnType<
  UploadResponse[],
  Error,
  MultiFileUploadParams,
  unknown
> & {
  files: Map<string, FileWithProgress>;
};

/**
 * Multiple file upload mutation with individual progress tracking
 * Each file gets its own progress indicator and status
 *
 * @example
 * ```vue
 * const { mutate, files, isPending } = useMultiFileUploadMutation();
 *
 * const handleUpload = (fileList: FileList) => {
 *   mutate({
 *     files: Array.from(fileList),
 *     url: '/api/recipes/upload-images'
 *   });
 * };
 *
 * // Access individual file progress
 * files.forEach((fileData) => {
 *   console.log(`${fileData.file.name}: ${fileData.progress}%`);
 * });
 * ```
 */
export const useMultiFileUploadMutation = (
  options: UseMultiFileUploadMutationOptions = {}
): MultiFileUploadMutationReturn => {
  const { uploadFile } = useApiClient();
  const queryClient = useQueryClient();
  const shouldUseMock = options.useMock ?? true;

  // Track multiple files with individual progress
  const files = reactive<Map<string, FileWithProgress>>(new Map());

  /**
   * Upload a single file and track its progress
   */
  const uploadSingleFile = async (
    fileId: string,
    file: File,
    url: string,
    additionalData?: UploadAdditionalData
  ): Promise<UploadResponse> => {
    // Initialize file tracking
    files.set(fileId, {
      file,
      progress: 0,
      status: 'uploading',
    });

    try {
      if (shouldUseMock) {
        await new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(
            () => {
              progress += 10;
              const fileData = files.get(fileId);
              if (fileData) {
                fileData.progress = Math.min(progress, 100);
              }

              if (progress >= 100) {
                clearInterval(interval);
                resolve();
              }
            },
            Math.random() * 300 + 200
          ); // Random upload time
        });

        const mockResponse: UploadResponse = {
          url: `https://cdn.example.com/uploads/${file.name}`,
          filename: file.name,
          size: file.size,
          message: 'File uploaded successfully',
        };

        const fileData = files.get(fileId);
        if (fileData) {
          fileData.status = 'success';
          fileData.url = mockResponse.url;
        }

        return mockResponse;
      }

      const response = await uploadFile<UploadResponse>(
        url,
        file,
        additionalData,
        (percent) => {
          const fileData = files.get(fileId);
          if (fileData) {
            fileData.progress = percent;
          }
        }
      );

      const fileData = files.get(fileId);
      if (fileData) {
        fileData.status = 'success';
        fileData.url = response.url;
      }

      return response;
    } catch (error: unknown) {
      // Update error status
      const fileData = files.get(fileId);
      if (fileData) {
        fileData.status = 'error';
        fileData.error =
          error instanceof Error ? error.message : 'Upload failed';
      }

      throw error;
    }
  };

  const mutation = useMutation<UploadResponse[], Error, MultiFileUploadParams>({
    mutationFn: async ({ files: fileList, url, additionalData }) => {
      // Clear previous files
      files.clear();

      // Upload all files concurrently
      const uploadPromises = fileList.map((file, index) => {
        const fileId = `${file.name}-${index}-${Date.now()}`;
        const mergedAdditionalData: UploadAdditionalData | undefined =
          additionalData ? { ...additionalData, index } : { index };

        return uploadSingleFile(fileId, file, url, mergedAdditionalData);
      });

      // Wait for all uploads to complete
      const results = await Promise.allSettled(uploadPromises);

      // Return successful uploads
      return results
        .filter((result) => result.status === 'fulfilled')
        .map(
          (result) => (result as PromiseFulfilledResult<UploadResponse>).value
        );
    },
    onSuccess: (data) => {
      // Invalidate relevant queries after successful upload
      queryClient.invalidateQueries({ queryKey: ['recipes'] });

      console.log(`${data.length} files uploaded successfully`);
    },
    onError: (error) => {
      console.error('Multi-upload error:', error);
    },
  });

  return {
    ...mutation,
    files, // Map of all files with individual progress
  };
};
