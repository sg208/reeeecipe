# Authentication Implementation Summary

## Overview

A complete **client-side authentication system** using localStorage + JWT tokens. Perfect for static site generation (`npm run generate`) and deployment to platforms like Netlify. The system uses **mock data** for local testing with Laravel Passport integration code commented out and ready for production.

## Architecture

```
┌─────────────────────────────────────┐
│   Nuxt Static App (Client-Side)    │
│                                     │
│  - localStorage (JWT token)         │
│  - TanStack Query (state mgmt)      │
│  - Direct API calls to Laravel      │
└─────────────────────────────────────┘
              ↓
    Direct HTTP Requests
              ↓
┌─────────────────────────────────────┐
│      Laravel API (Backend)          │
│                                     │
│  - Laravel Passport (JWT)           │
│  - Authentication endpoints         │
│  - CORS enabled                     │
└─────────────────────────────────────┘
```

## Key Features

### 🎯 Pure Client-Side Auth

- ✅ No Nuxt server routes required
- ✅ Perfect for static hosting (Netlify, Vercel, etc.)
- ✅ Works with `npm run generate`
- ✅ Direct Laravel API calls

### 🔐 Security

- JWT tokens stored in localStorage
- Token auto-attached to all API requests
- XSS protection via input sanitization
- CORS configured on Laravel side

### 🚀 TanStack Query

- Automatic caching and refetching
- Loading and error states
- Cache invalidation on mutations
- Optimized performance

### 🎨 Nuxt UI Components

- Beautiful, accessible forms with `UAuthForm`
- Consistent UI with `UButton`, `UCard`, `UDropdownMenu`
- Toast notifications for user feedback

## Features Implemented

### ✅ Authentication Flow

- **Login** - Email and password authentication
- **Registration** - User account creation with password confirmation
- **Logout** - Clears token and cache
- **Forgot Password** - Password reset flow (UI only, backend TBD)

### ✅ Route Protection

- **Auth Middleware** - Protects routes requiring authentication
- **Guest Middleware** - Redirects authenticated users from auth pages
- **Protected Dashboard** - Example of a protected route

### ✅ State Management

- **TanStack Query Integration** - Efficient data fetching and caching
- **Query Keys Factory** - Organized cache management
- **Mutations** - Login, register, and logout with automatic cache updates
- **localStorage Token Management** - Persistent authentication

### ✅ UI Components

- **Login Page** (`/auth/login`) - Clean login form
- **Register Page** (`/auth/register`) - Registration with validation
- **Forgot Password Page** (`/auth/forgot-password`) - Password reset UI
- **Dashboard Page** (`/dashboard`) - Protected user dashboard
- **AppHeader Updates** - Dynamic login/logout button and user menu

## File Structure

```
├── types/auth.ts                              # TypeScript interfaces
├── composables/
│   ├── useAuthToken.ts                        # localStorage token management
│   ├── useApiClient.ts                        # Authenticated API client
│   ├── queries/
│   │   ├── authKeys.ts                        # Query key factory
│   │   ├── useAuthQuery.ts                    # User query hook
│   │   └── useAuthMutation.ts                 # Auth mutations (login, register, logout)
│   └── useAuth.ts                             # Main auth composable
├── middleware/
│   ├── auth.ts                                # Protect authenticated routes
│   └── guest.ts                               # Redirect authenticated users
├── pages/
│   ├── auth/
│   │   ├── login.vue                          # Login page
│   │   ├── register.vue                       # Registration page
│   │   └── forgot-password.vue                # Forgot password page
│   └── dashboard.vue                          # Protected dashboard example
└── components/AppHeader.vue                   # Updated with auth UI
```

## Testing the Implementation

### Mock Credentials

Use these credentials to test the login:

- **Email:** `user@example.com`
- **Password:** `password`

### Test Checklist

- [x] Access login page at `/auth/login`
- [x] Access register page at `/auth/register`
- [x] Login with mock credentials works
- [x] Token stored in localStorage
- [x] User state persists on page refresh
- [x] Logout clears token and redirects
- [x] Cannot access `/dashboard` when logged out
- [x] Redirects to `/auth/login` when accessing protected routes
- [x] Logged-in users redirected from `/auth/login` to home
- [x] AppHeader shows correct buttons based on auth state
- [x] Forgot password link navigates to `/auth/forgot-password`
- [x] User dropdown menu shows in header when authenticated

## How It Works

### 1. Token Storage (`useAuthToken.ts`)

```typescript
// Store token
setToken('jwt-token-here');

// Retrieve token
const token = getToken();

// Remove token
removeToken();
```

### 2. Authenticated API Calls (`useApiClient.ts`)

```typescript
// Automatically adds Authorization header
const { apiFetch } = useApiClient();
const user = await apiFetch('/api/user');
// Header: Authorization: Bearer {token}
```

### 3. Login Flow

```
User enters credentials
       ↓
Login mutation called
       ↓
API call to Laravel (or mock)
       ↓
Receive JWT token + user data
       ↓
Store token in localStorage
       ↓
Update TanStack Query cache
       ↓
Redirect to dashboard
```

### 4. Authentication Check

```
Page loads
       ↓
Check localStorage for token
       ↓
If token exists → Call /api/auth/me
       ↓
Laravel validates token
       ↓
Return user data
       ↓
User authenticated ✅
```

### 5. Logout Flow

```
User clicks logout
       ↓
Call Laravel /api/auth/logout
       ↓
Remove token from localStorage
       ↓
Clear TanStack Query cache
       ↓
Redirect to home
```

## Laravel Passport Integration (Ready to Implement)

All auth composables include commented Laravel Passport code. To integrate:

### Step 1: Set Up Environment Variable

```bash
# Add to .env
LARAVEL_API_URL=https://your-laravel-api.com
```

### Step 2: Uncomment Laravel Code

In the following files, find the commented sections marked with:

```typescript
/* LARAVEL PASSPORT IMPLEMENTATION (uncomment when Laravel backend is ready)
```

And uncomment the code in:

- `composables/queries/useAuthMutation.ts` (login, register, logout)
- `composables/queries/useAuthQuery.ts` (user check)

### Step 3: Laravel API Endpoints Required

Your Laravel API needs these endpoints:

| Method | Endpoint             | Returns                           | Headers                         |
| ------ | -------------------- | --------------------------------- | ------------------------------- |
| `POST` | `/api/auth/login`    | `{ user, token, message }`        | -                               |
| `POST` | `/api/auth/register` | `{ user, token, message }`        | -                               |
| `POST` | `/api/auth/logout`   | `{ message }`                     | `Authorization: Bearer {token}` |
| `GET`  | `/api/auth/me`       | `{ id, email, name, created_at }` | `Authorization: Bearer {token}` |

### Step 4: Laravel CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://your-nuxt-app.com'], // Your Nuxt app URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Step 5: Laravel Passport Setup

```bash
# Install Laravel Passport
composer require laravel/passport

# Run migrations
php artisan migrate

# Generate keys
php artisan passport:install
```

```php
// app/Models/User.php
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}
```

```php
// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],
```

### Step 6: Laravel Auth Controller Example

```php
// app/Http/Controllers/AuthController.php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('auth_token')->accessToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
        'message' => 'Login successful',
    ]);
}

public function logout(Request $request)
{
    $request->user()->token()->revoke();
    return response()->json(['message' => 'Logout successful']);
}

public function me(Request $request)
{
    return response()->json($request->user());
}
```

## Configuration

### Runtime Config (nuxt.config.ts)

```typescript
runtimeConfig: {
  public: {
    laravelApiUrl: process.env.LARAVEL_API_URL || 'http://localhost:8000',
  },
}
```

### Route Rules (nuxt.config.ts)

```typescript
routeRules: {
  // Static pages - fully pre-rendered for SEO
  '/': { prerender: true },
  '/about': { prerender: true },
  '/privacy': { prerender: true },
  '/terms': { prerender: true },

  // Auth & protected pages - client-side only (SPA mode)
  '/auth/**': { ssr: false },
  '/dashboard': { ssr: false },
}
```

## Security Considerations

### ✅ Current Security Measures

1. **Input Validation** - All forms validated
2. **HTTPS Only** - Use HTTPS in production
3. **CORS Protection** - Laravel CORS configuration
4. **Token Expiration** - JWT tokens should expire
5. **Route Protection** - Middleware guards routes

### ⚠️ localStorage vs httpOnly Cookies

**localStorage + JWT:**

- ✅ Works with static sites
- ✅ Simple implementation
- ✅ No server required
- ⚠️ Vulnerable to XSS (if site is compromised)
- ⚠️ Manual token management

**httpOnly Cookies (alternative):**

- ✅ More secure (JS can't access)
- ✅ Auto-sent with requests
- ❌ Requires server (doesn't work with static sites)

**Mitigation:**

- Use Content Security Policy (CSP) headers
- Sanitize all user inputs
- Regular security audits
- Short token expiration times

## Usage Examples

### Protecting a Route

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth', // Requires authentication
});
</script>
```

### Using Auth in Components

```vue
<script setup lang="ts">
const { user, isAuthenticated, login, logout } = useAuth();

// Access user data
console.log(user.value?.name);

// Login programmatically
await login({ email: 'user@example.com', password: 'password' });

// Logout
await logout();
</script>
```

### Making Authenticated API Calls

```vue
<script setup lang="ts">
const { apiFetch } = useApiClient();

// Automatically includes Authorization header
const data = await apiFetch('/api/user/profile');
</script>
```

### Checking Authentication Status

```vue
<template>
  <div v-if="isAuthenticated">Welcome, {{ user?.name }}!</div>
  <div v-else>Please log in</div>
</template>
```

## Deployment

### Build for Static Hosting

```bash
# Generate static files
npm run generate

# Output in dist/ directory
# Upload to Netlify, Vercel, or any static host
```

### Environment Variables

Set on your hosting platform:

```bash
LARAVEL_API_URL=https://your-laravel-api.com
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run generate"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Code Quality

- ✅ **ESLint**: No errors
- ✅ **Prettier**: All files formatted
- ✅ **TypeScript**: Strict mode, all types defined
- ✅ **Best Practices**: SOLID principles, functional composition
- ✅ **No Server Routes**: Pure client-side implementation

## Next Steps

1. **Set Up Laravel Backend:**
   - Install Laravel Passport
   - Create auth endpoints
   - Configure CORS
   - Test with Postman

2. **Enable Laravel Integration:**
   - Uncomment Laravel code in composables
   - Set `LARAVEL_API_URL` environment variable
   - Test with real backend

3. **Additional Features (Optional):**
   - Email verification
   - Password reset functionality (with email)
   - Social login (OAuth)
   - Two-factor authentication
   - Remember me functionality
   - Refresh token rotation
   - Rate limiting

## Technical Decisions

### Why localStorage + JWT?

- ✅ Works perfectly with static sites
- ✅ No server required on Nuxt side
- ✅ Simple implementation
- ✅ Direct API communication
- ✅ Works with `npm run generate`

### Why TanStack Query?

- Superior caching and state management
- Automatic refetching and cache invalidation
- Better developer experience
- Optimized performance

### Why No Server Routes?

- Eliminates need for Node.js server
- Perfect for static hosting (cheaper)
- Simpler deployment
- Direct Laravel API communication

### Why Nuxt UI?

- Beautiful, accessible components out of the box
- Built specifically for Nuxt
- Consistent design system
- Great developer experience

## Troubleshooting

### Token Not Persisting

Check browser localStorage:

```javascript
// In browser console
localStorage.getItem('auth_token');
```

### CORS Issues

Ensure Laravel CORS is configured correctly:

- `supports_credentials: true`
- Add your Nuxt app URL to `allowed_origins`

### User Not Loading After Page Refresh

- Check if token exists in localStorage
- Check browser Network tab for `/api/auth/me` call
- Verify Laravel endpoint returns user data

## Support

For issues or questions:

1. Check the commented Laravel code in composable files
2. Review mock implementation for expected data structure
3. Test with mock credentials first before integrating Laravel

---

**Status:** ✅ Client-side auth complete and ready for Laravel backend integration  
**Type:** localStorage + JWT (Static Site Compatible)  
**Last Updated:** 2024-11-07
