/**
 * File upload related types
 */

export type UploadAdditionalData = Record<
  string,
  string | number | boolean | Blob
>;

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type?: string;
  message: string;
}

export interface FileUploadParams {
  file: File;
  url: string;
  additionalData?: UploadAdditionalData;
}

export interface MultiFileUploadParams {
  files: File[];
  url: string;
  additionalData?: UploadAdditionalData;
}

export interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}
