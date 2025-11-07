import axios, { type AxiosProgressEvent } from 'axios';
import type { UploadAdditionalData } from '~/types/upload';

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

type ApiFetchOptions = Omit<RequestInit, 'method' | 'headers' | 'body'> & {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: BodyInit | Record<string, unknown> | null;
};

interface UseApiClientReturn {
  apiFetch: <T>(url: string, options?: ApiFetchOptions) => Promise<T>;
  uploadFile: <T>(
    url: string,
    file: File,
    additionalData?: UploadAdditionalData,
    onProgress?: (percent: number) => void
  ) => Promise<T>;
}

/**
 * Composable for making authenticated API requests
 * Supports both regular API calls ($fetch) and file uploads with progress (axios)
 */
export const useApiClient = (): UseApiClientReturn => {
  const config = useRuntimeConfig();
  const { getToken } = useAuthToken();

  /**
   * Authenticated fetch wrapper for regular API calls
   * Automatically adds Authorization header with JWT token
   */
  const apiFetch = async <T>(
    url: string,
    options: ApiFetchOptions = {}
  ): Promise<T> => {
    const token = getToken();

    const { body, headers, ...restOptions } = options;
    let payload: BodyInit | null | undefined = null;

    if (body instanceof FormData || body instanceof Blob || body == null) {
      payload = body ?? null;
    } else if (typeof body === 'string') {
      payload = body;
    } else {
      payload = JSON.stringify(body);
    }

    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (
      body instanceof FormData ||
      body instanceof Blob ||
      typeof body === 'string'
    ) {
      // Let the browser set the correct boundary/content-type when using FormData or raw payloads
      delete finalHeaders['Content-Type'];
    }

    return $fetch<T>(`${config.public.laravelApiUrl}${url}`, {
      ...restOptions,
      body: payload,
      headers: finalHeaders,
    });
  };

  /**
   * File upload with progress tracking using axios
   * @param url - API endpoint (e.g., '/api/recipes/upload')
   * @param file - File to upload
   * @param additionalData - Additional form fields to include
   * @param onProgress - Callback to track upload progress (0-100%)
   * @returns Upload response
   */
  const uploadFile = async <T>(
    url: string,
    file: File,
    additionalData?: UploadAdditionalData,
    onProgress?: (percent: number) => void
  ): Promise<T> => {
    const token = getToken();
    const formData = new FormData();

    // Add file to form data
    formData.append('file', file);

    // Add any additional fields
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });
    }

    const response = await axios.post<T>(
      `${config.public.laravelApiUrl}${url}`,
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Don't set Content-Type - browser will set it with boundary
        },
        onUploadProgress: onProgress
          ? (progressEvent: AxiosProgressEvent): void => {
              if (progressEvent.total) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(percent);
              }
            }
          : undefined,
      }
    );

    return response.data;
  };

  return {
    apiFetch,
    uploadFile,
  };
};
