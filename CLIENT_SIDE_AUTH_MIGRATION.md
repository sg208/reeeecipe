# Client-Side Auth Migration Summary

## What Changed?

We've migrated from **server-side cookie-based auth** to **client-side localStorage + JWT auth** to support pure static site generation with `npm run generate`.

## Changes Made

### ✅ New Files Created

1. **`composables/useAuthToken.ts`**
   - Manages JWT token in localStorage
   - `getToken()`, `setToken()`, `removeToken()`, `hasToken()`

2. **`composables/useApiClient.ts`**
   - Wrapper for authenticated API calls
   - Automatically attaches `Authorization: Bearer {token}` header

### ✅ Files Updated

1. **`composables/queries/useAuthMutation.ts`**
   - Login now stores token in localStorage (not cookie)
   - Calls Laravel API directly (or mock)
   - Commented Laravel Passport code included

2. **`composables/queries/useAuthQuery.ts`**
   - Checks token from localStorage
   - Returns user data based on token
   - Commented Laravel Passport code included

3. **`middleware/auth.ts`**
   - Now checks token in localStorage
   - No longer calls server API route
   - Pure client-side check

4. **`nuxt.config.ts`**
   - Updated route rules for static generation
   - Pre-renders static pages (`/`, `/about`, etc.)
   - Client-side only for auth routes

5. **`AUTH_IMPLEMENTATION.md`**
   - Completely rewritten for client-side approach
   - Added Laravel integration guide
   - Added security considerations

### ❌ Files Deleted

1. **`server/api/auth/login.post.ts`** - No longer needed
2. **`server/api/auth/register.post.ts`** - No longer needed
3. **`server/api/auth/logout.post.ts`** - No longer needed
4. **`server/api/auth/me.get.ts`** - No longer needed

**Result:** The entire `/server` directory is now empty/deleted.

## Architecture Comparison

### Before (Server Routes + Cookies)

```
Client Request
    ↓
Nuxt Server Route (/api/auth/*)
    ↓
Set httpOnly Cookie
    ↓
Cookie sent with each request
```

### After (Client-Side + localStorage)

```
Client Request
    ↓
Direct Laravel API Call
    ↓
Receive JWT Token
    ↓
Store in localStorage
    ↓
Token attached to each API call
```

## How to Test

### 1. Test Mock Login

```bash
# Start dev server
npm run dev
```

1. Navigate to http://localhost:3000/auth/login
2. Enter credentials:
   - Email: `user@example.com`
   - Password: `password`
3. Click "Sign In"
4. Should redirect to `/dashboard`
5. Check localStorage in browser DevTools:
   ```javascript
   localStorage.getItem('auth_token');
   // Should show: mock-jwt-token-{timestamp}
   ```

### 2. Test Route Protection

1. Logout (if logged in)
2. Try to access http://localhost:3000/dashboard
3. Should redirect to `/auth/login?redirect=/dashboard`
4. Login
5. Should redirect back to `/dashboard`

### 3. Test Persistence

1. Login
2. Refresh the page
3. User should still be logged in (token persists in localStorage)

### 4. Test Logout

1. While logged in, click logout button
2. Check localStorage - token should be removed
3. Should redirect to home page
4. Cannot access `/dashboard` anymore

### 5. Test Static Generation

```bash
# Generate static site
npm run generate

# Preview the generated site
npx serve dist
```

Navigate to http://localhost:3000 and test:

- Static pages load instantly (/, /about, /privacy, /terms)
- Auth pages work client-side
- Login/logout functionality works

## Laravel Integration Checklist

When ready to connect to real Laravel backend:

### Step 1: Environment Setup

```bash
# .env
LARAVEL_API_URL=https://your-laravel-api.com
```

### Step 2: Uncomment Laravel Code

Find and uncomment sections in:

- [ ] `composables/queries/useAuthMutation.ts`
  - [ ] `useLoginMutation` - lines ~40-60
  - [ ] `useRegisterMutation` - lines ~105-125
  - [ ] `useLogoutMutation` - lines ~165-185

- [ ] `composables/queries/useAuthQuery.ts`
  - [ ] `useUserQuery` - lines ~40-55

### Step 3: Laravel Endpoints Required

Ensure your Laravel API has these endpoints:

| Method | Endpoint             | Request Body                                       | Response                          |
| ------ | -------------------- | -------------------------------------------------- | --------------------------------- |
| POST   | `/api/auth/login`    | `{ email, password }`                              | `{ user, token, message }`        |
| POST   | `/api/auth/register` | `{ name, email, password, password_confirmation }` | `{ user, token, message }`        |
| POST   | `/api/auth/logout`   | -                                                  | `{ message }`                     |
| GET    | `/api/auth/me`       | -                                                  | `{ id, email, name, created_at }` |

### Step 4: Test with Postman

Before integrating, test Laravel endpoints:

```bash
# Login
POST https://your-laravel-api.com/api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

# Should return:
{
  "user": { "id": 1, "email": "user@example.com", "name": "Test" },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "message": "Login successful"
}
```

### Step 5: Update Nuxt App

1. Set environment variable
2. Uncomment Laravel code
3. Test login/register/logout
4. Verify token storage
5. Test protected routes

## Security Notes

### ⚠️ localStorage vs Cookies

**localStorage:**

- ✅ Works with static sites
- ✅ Simple implementation
- ⚠️ Accessible via JavaScript (XSS risk)

**Mitigation strategies:**

1. Use HTTPS in production (always)
2. Implement Content Security Policy (CSP)
3. Sanitize all user inputs
4. Use short token expiration (e.g., 1 hour)
5. Implement refresh tokens
6. Regular security audits

### 🔒 Recommended Security Headers

Add to your static hosting (Netlify/Vercel):

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

## Troubleshooting

### Token Not Saving

**Check:**

```javascript
// Browser console
localStorage.getItem('auth_token');
```

**Fix:**

- Ensure browser allows localStorage
- Check if running in incognito/private mode
- Clear browser cache

### CORS Errors

**Symptom:**

```
Access to fetch at 'https://api.example.com' from origin 'https://app.example.com'
has been blocked by CORS policy
```

**Fix in Laravel:**

```php
// config/cors.php
'allowed_origins' => ['https://your-nuxt-app.com'],
'supports_credentials' => true,
```

### User Not Persisting

**Check:**

1. Token exists: `localStorage.getItem('auth_token')`
2. Token format: Should start with expected prefix
3. Network tab: Check API call to `/api/auth/me`
4. Laravel returns valid user data

### Protected Routes Not Working

**Check:**

1. Middleware is applied: `definePageMeta({ middleware: 'auth' })`
2. Token exists in localStorage
3. Route rules in `nuxt.config.ts` are correct

## Benefits of This Approach

### ✅ Pros

1. **Static Site Compatible** - Works with `npm run generate`
2. **No Server Required** - Pure client-side (cheaper hosting)
3. **Simple Deployment** - Just upload to Netlify/Vercel
4. **Direct API Calls** - No proxy needed
5. **Fast Performance** - Pre-rendered static pages

### ⚠️ Considerations

1. **localStorage Security** - More vulnerable to XSS than httpOnly cookies
2. **Manual Token Management** - Need to handle token in every request
3. **No SSR for Auth** - Auth happens client-side only

## Next Steps

1. ✅ Test mock authentication locally
2. ✅ Verify static generation works
3. ⏳ Set up Laravel backend
4. ⏳ Configure CORS
5. ⏳ Uncomment Laravel code
6. ⏳ Test with real API
7. ⏳ Deploy to production

## Questions?

Refer to:

- `AUTH_IMPLEMENTATION.md` - Detailed auth documentation
- `composables/queries/useAuthMutation.ts` - Mock implementation examples
- `composables/queries/useAuthQuery.ts` - User query example

---

**Migration Date:** 2024-11-07  
**Status:** ✅ Complete - Ready for Laravel integration  
**Deployment:** Compatible with Netlify, Vercel, and all static hosts
