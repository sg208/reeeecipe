# File Upload Implementation Guide

## Overview

A complete file upload system combining **axios** (for upload progress tracking) with **TanStack Query** (for state management). This implementation supports both single and multiple file uploads with real-time progress indicators.

## Architecture

```
┌─────────────────────────────────────┐
│   Vue Component                     │
│                                     │
│  - File input                       │
│  - Progress bars                    │
│  - Status indicators                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   TanStack Query Mutation           │
│                                     │
│  - Loading states                   │
│  - Error handling                   │
│  - Cache invalidation               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   useApiClient (axios)              │
│                                     │
│  - FormData construction            │
│  - Auth token injection             │
│  - Progress callback (0-100%)       │
└─────────────────────────────────────┘
              ↓
    Direct HTTP Request
              ↓
┌─────────────────────────────────────┐
│      Laravel API                    │
│                                     │
│  - File validation                  │
│  - Storage handling                 │
│  - Response with URL                │
└─────────────────────────────────────┘
```

## Features

### ✅ Single File Upload

- Real-time progress tracking (0-100%)
- Loading states
- Success/Error feedback
- Automatic cache invalidation

### ✅ Multiple File Upload

- Individual progress per file
- Concurrent uploads
- Per-file status tracking
- Error handling per file

### ✅ Integration

- Works with TanStack Query
- Axios for progress tracking
- $fetch for regular API calls
- JWT token auto-injection

## Installation

Already installed! Dependencies:

- ✅ `axios` - For upload progress
- ✅ `@tanstack/vue-query` - For state management

## File Structure

```
composables/
├── useApiClient.ts                           # API client with uploadFile method
├── queries/
│   ├── useFileUploadMutation.ts             # Single file upload
│   └── useMultiFileUploadMutation.ts        # Multiple file upload

types/
└── upload.ts                                 # Upload-related types

pages/
└── upload-demo.vue                           # Demo page with examples
```

## Usage

### 1. Single File Upload

```vue
<script setup lang="ts">
import { useFileUploadMutation } from '~/composables/queries/useFileUploadMutation';

const {
  mutate: uploadFile,
  isPending: isUploading,
  isSuccess,
  isError,
  error,
  uploadProgress, // 0-100%
} = useFileUploadMutation();

const handleUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) return;

  uploadFile(
    {
      file,
      url: '/api/recipes/upload-image',
      additionalData: {
        recipe_id: '123',
        alt_text: 'Chocolate cake',
      },
    },
    {
      onSuccess: (data) => {
        console.log('Upload complete!', data.url);
      },
      onError: (error) => {
        console.error('Upload failed:', error);
      },
    }
  );
};
</script>

<template>
  <div>
    <!-- File Input -->
    <input
      type="file"
      accept="image/*,.pdf"
      :disabled="isUploading"
      @change="handleUpload"
    />

    <!-- Progress Bar -->
    <div v-if="isUploading">
      <UProgress :value="uploadProgress" :max="100" />
      <p>Uploading: {{ uploadProgress }}%</p>
    </div>

    <!-- Success Message -->
    <UAlert v-if="isSuccess" color="green" title="Upload successful!" />

    <!-- Error Message -->
    <UAlert v-if="isError" color="red" :title="error?.message" />
  </div>
</template>
```

### 2. Multiple File Upload

```vue
<script setup lang="ts">
import { useMultiFileUploadMutation } from '~/composables/queries/useMultiFileUploadMutation';

const {
  mutate: uploadMultiple,
  isPending,
  files, // Map of files with individual progress
} = useMultiFileUploadMutation();

const handleMultipleUpload = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files;

  if (!fileList) return;

  uploadMultiple({
    files: Array.from(fileList),
    url: '/api/recipes/upload-images',
    additionalData: {
      recipe_id: '123',
    },
  });
};
</script>

<template>
  <div>
    <!-- Multiple File Input -->
    <input
      type="file"
      multiple
      accept="image/*"
      :disabled="isPending"
      @change="handleMultipleUpload"
    />

    <!-- Individual File Progress -->
    <div v-for="[fileId, fileData] in files" :key="fileId">
      <p>{{ fileData.file.name }}</p>
      <UProgress :value="fileData.progress" />
      <UBadge :color="fileData.status === 'success' ? 'green' : 'blue'">
        {{ fileData.status }}
      </UBadge>
    </div>
  </div>
</template>
```

### 3. Recipe Form with Image Upload

```vue
<script setup lang="ts">
import { useFileUploadMutation } from '~/composables/queries/useFileUploadMutation';

const { mutateAsync: uploadImage, uploadProgress } = useFileUploadMutation();
const { apiFetch } = useApiClient();

const recipeForm = reactive({
  title: '',
  description: '',
  image: null as File | null,
});

const isSubmitting = ref(false);

const submitRecipe = async () => {
  if (!recipeForm.image) {
    alert('Please select an image');
    return;
  }

  isSubmitting.value = true;

  try {
    // 1. Upload image first
    const uploadResult = await uploadImage({
      file: recipeForm.image,
      url: '/api/recipes/upload-image',
    });

    // 2. Create recipe with uploaded image URL
    await apiFetch('/api/recipes', {
      method: 'POST',
      body: {
        title: recipeForm.title,
        description: recipeForm.description,
        image_url: uploadResult.url,
      },
    });

    // 3. Redirect to recipes
    await navigateTo('/recipes');
  } catch (error: any) {
    alert(error.message);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitRecipe">
    <UInput v-model="recipeForm.title" placeholder="Recipe title" />
    <UTextarea v-model="recipeForm.description" placeholder="Description" />

    <!-- File Input -->
    <input
      type="file"
      accept="image/*"
      @change="recipeForm.image = $event.target.files[0]"
    />

    <!-- Upload Progress -->
    <div v-if="uploadProgress > 0 && uploadProgress < 100">
      <UProgress :value="uploadProgress" />
      <p>Uploading image: {{ uploadProgress }}%</p>
    </div>

    <UButton type="submit" :loading="isSubmitting"> Create Recipe </UButton>
  </form>
</template>
```

## API Client Methods

### `apiFetch<T>()` - Regular API Calls

```typescript
const { apiFetch } = useApiClient();

// GET request
const recipes = await apiFetch<Recipe[]>('/api/recipes');

// POST request
const newRecipe = await apiFetch<Recipe>('/api/recipes', {
  method: 'POST',
  body: { title: 'New Recipe' },
});
```

### `uploadFile<T>()` - File Upload with Progress

```typescript
const { uploadFile } = useApiClient();

const result = await uploadFile(
  '/api/upload',
  file,
  { recipe_id: '123' },
  (percent) => {
    console.log(`Upload: ${percent}%`);
  }
);
```

## Mock vs Laravel Implementation

### Current: Mock Data (For Testing)

Both mutation composables currently use **mock data** for testing without a Laravel backend:

- Simulates upload progress (0-100%)
- Returns mock response with fake URLs
- No actual file upload happens

### Switch to Laravel

To connect to your Laravel backend:

1. **Set environment variable:**

```bash
# .env
LARAVEL_API_URL=https://your-laravel-api.com
```

2. **Uncomment Laravel code in:**
   - `composables/queries/useFileUploadMutation.ts` (lines ~48-58)
   - `composables/queries/useMultiFileUploadMutation.ts` (lines ~62-80)

3. **Look for comments:**

```typescript
/* LARAVEL IMPLEMENTATION (uncomment when Laravel backend is ready)
```

## Laravel Backend Setup

### Required Endpoints

| Method | Endpoint                    | Request                          | Response                           |
| ------ | --------------------------- | -------------------------------- | ---------------------------------- |
| POST   | `/api/upload/single`        | FormData with `file`             | `{ url, filename, size, message }` |
| POST   | `/api/upload/multiple`      | FormData with multiple `files[]` | Array of upload responses          |
| POST   | `/api/recipes/upload-image` | FormData with `file` + data      | `{ url, filename, size, message }` |

### Laravel Controller Example

```php
// app/Http/Controllers/UploadController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadSingle(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');
        $url = Storage::url($path);

        return response()->json([
            'url' => $url,
            'filename' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'message' => 'File uploaded successfully',
        ]);
    }

    public function uploadMultiple(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:10240',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store('uploads', 'public');

            $uploadedFiles[] = [
                'url' => Storage::url($path),
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ];
        }

        return response()->json($uploadedFiles);
    }
}
```

### Laravel Routes

```php
// routes/api.php
use App\Http\Controllers\UploadController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/upload/single', [UploadController::class, 'uploadSingle']);
    Route::post('/upload/multiple', [UploadController::class, 'uploadMultiple']);
    Route::post('/recipes/upload-image', [UploadController::class, 'uploadRecipeImage']);
});
```

### Laravel Storage Configuration

```php
// config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

Create storage symlink:

```bash
php artisan storage:link
```

## Testing

### View Demo Page

Visit the demo page to test uploads:

```
http://localhost:3000/upload-demo
```

Features demonstrated:

- Single file upload with progress bar
- Multiple file upload with individual progress
- Success/error states
- Real-time progress tracking
- Usage examples

### Test Single Upload

```typescript
const { mutate } = useFileUploadMutation();

mutate({
  file: myFile,
  url: '/api/upload/single',
});
```

### Test Multiple Upload

```typescript
const { mutate } = useMultiFileUploadMutation();

mutate({
  files: [file1, file2, file3],
  url: '/api/upload/multiple',
});
```

## File Types & Validation

### Accepted File Types

**Images:**

```html
<input type="file" accept="image/*" />
```

**PDFs:**

```html
<input type="file" accept=".pdf,application/pdf" />
```

**Images + PDFs:**

```html
<input type="file" accept="image/*,.pdf" />
```

**Specific types:**

```html
<input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.pdf" />
```

### Laravel Validation

```php
$request->validate([
    'file' => 'required|file|mimes:jpeg,png,gif,webp,pdf|max:10240', // 10MB
]);
```

## Advanced Features

### Cancel Upload

```typescript
// TODO: Implement with AbortController
const controller = new AbortController();

axios.post(url, formData, {
  signal: controller.signal,
});

// Cancel upload
controller.abort();
```

### Retry Failed Upload

```typescript
const { mutate, retry } = useFileUploadMutation();

// Automatic retry (built into TanStack Query)
// Or manual retry:
retry();
```

### Optimistic Updates

```typescript
const { mutate } = useFileUploadMutation();

mutate(
  { file, url },
  {
    onMutate: async (variables) => {
      // Optimistically show image preview
      const preview = URL.createObjectURL(variables.file);
      // Update UI immediately
    },
  }
);
```

## Troubleshooting

### Progress Not Updating

**Issue:** `uploadProgress` stays at 0%

**Solution:**

- Check if Laravel code is uncommented
- Verify axios is installed: `npm list axios`
- Check browser console for errors

### CORS Errors

**Issue:** Upload fails with CORS error

**Solution:**

```php
// config/cors.php
'allowed_origins' => ['https://your-nuxt-app.com'],
'supports_credentials' => true,
```

### File Too Large

**Issue:** 413 Request Entity Too Large

**Solution:**

```php
// .htaccess or nginx config
php_value upload_max_filesize 20M
php_value post_max_size 20M
```

### Token Not Attached

**Issue:** 401 Unauthorized on upload

**Solution:**

- Verify token exists: `localStorage.getItem('auth_token')`
- Check `useApiClient` attaches token to FormData requests
- Laravel should accept token from `Authorization` header

## Performance Tips

### 1. Compress Images Client-Side

```typescript
// TODO: Add image compression before upload
import imageCompression from 'browser-image-compression';

const compressedFile = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
});
```

### 2. Concurrent Upload Limit

```typescript
// Upload in batches of 3
const batchSize = 3;
for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  await Promise.all(batch.map(uploadFile));
}
```

### 3. Lazy Load Upload Components

```vue
<script setup lang="ts">
const FileUploader = defineAsyncComponent(
  () => import('~/components/FileUploader.vue')
);
</script>
```

## Bundle Size Impact

**Before (just $fetch):** ~5KB  
**After (with axios):** ~18KB (+13KB)

**Worth it?** ✅ Yes, for professional file upload UX with progress tracking!

## Next Steps

1. ✅ Test upload demo page (`/upload-demo`)
2. ⏳ Set up Laravel backend
3. ⏳ Uncomment Laravel code in mutations
4. ⏳ Configure CORS
5. ⏳ Test with real uploads
6. ⏳ Add to recipe submission form

## Summary

You now have:

- ✅ Single file upload with progress
- ✅ Multiple file upload with individual progress
- ✅ TanStack Query integration
- ✅ Axios for progress tracking
- ✅ Mock data for testing
- ✅ Ready for Laravel integration
- ✅ Demo page with examples

---

**Status:** ✅ Complete - Ready for Laravel backend integration  
**Demo:** http://localhost:3000/upload-demo  
**Type:** Hybrid approach (axios for uploads, $fetch for API calls)  
**Last Updated:** 2024-11-07
