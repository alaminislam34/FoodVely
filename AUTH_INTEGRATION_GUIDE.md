# Auth Integration Guide

This guide explains how to use the authentication system integrated with your backend API running at `http://localhost:5000`.

## 📁 Files Created

### Services
- **`src/services/authService.ts`** - Core authentication API service
  - `registerUser()` - Register new user
  - `verifyAccount()` - Verify account with OTP
  - `loginRequest()` - Request login OTP
  - `loginVerify()` - Verify login OTP and get tokens
  - `googleLogin()` - Google OAuth login
  - Token management functions (store, retrieve, clear)
  - Authenticated fetch helper

### Hooks
- **`src/hooks/useAuth.ts`** - Custom React hook for auth operations
  - Manages authentication state
  - Provides all auth methods
  - Handles loading and error states

### Context
- **`src/context/AuthContext.tsx`** - Auth context provider
  - Wraps entire app for auth state
  - Provides `useAuthContext()` hook

### Components
- **`src/components/Auth/SignUpForm.tsx`** - Sign-up form component
  - User registration form
  - OTP verification form
  
- **`src/components/Auth/SignInForm.tsx`** - Sign-in form component
  - Email/password login
  - OTP verification for 2FA
  
- **`src/components/Auth/GoogleLoginButton.tsx`** - Google OAuth button

### Configuration
- **`.env.local`** - Environment variables
  - `NEXT_PUBLIC_API_URL` - Backend API base URL

## 🚀 Setup Instructions

### 1. Wrap Your App with AuthProvider

Update your root layout (`src/app/layout.tsx`):

```tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Use Auth in Components

#### Using the Hook directly:
```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { loginRequest, loginVerify, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginRequest(email, password);
      // Then handle OTP verification
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // Your UI here
  );
}
```

#### Using the Context:
```tsx
'use client';

import { useAuthContext } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthContext();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Use Provided Components

#### Sign Up:
```tsx
import { SignUpForm } from '@/components/Auth/SignUpForm';

export default function SignUpPage() {
  return (
    <SignUpForm 
      onSuccess={() => {
        // Redirect or show success message
        console.log('Account created successfully!');
      }}
    />
  );
}
```

#### Sign In:
```tsx
import { SignInForm } from '@/components/Auth/SignInForm';

export default function SignInPage() {
  return (
    <SignInForm 
      onSuccess={() => {
        // Redirect to dashboard
        console.log('Logged in successfully!');
      }}
    />
  );
}
```

#### Google Login:
```tsx
import { GoogleLoginButton } from '@/components/Auth/GoogleLoginButton';

export default function LoginPage() {
  return (
    <GoogleLoginButton
      onSuccess={() => {
        console.log('Google login successful!');
      }}
    />
  );
}
```

## 🔐 API Endpoints

All endpoints are prefixed with `http://localhost:5000/api/v1/auth`

### Register
```
POST /register
Body: { name, email, password }
Response: { success, message, data: UserData }
```

### Verify Account
```
POST /verify-account
Body: { email, otp }
Response: { success, message, data: UserData }
```

### Login Request
```
POST /login
Body: { email, password }
Response: { success, message, data: { message } }
```

### Login Verify
```
POST /login-verify
Body: { email, otp }
Response: { success, message, data: { accessToken, refreshToken } }
```

### Google Login
```
POST /google
Body: { token }
Response: { success, message, data: { accessToken, refreshToken } }
```

## 💾 Token Management

Tokens are automatically stored in `localStorage`:
- `accessToken` - For API requests
- `refreshToken` - For refreshing access token
- `user` - User data

## 🔒 Making Authenticated Requests

Use the `authenticatedFetch()` helper:

```tsx
import { authenticatedFetch } from '@/services/authService';

const response = await authenticatedFetch(
  'http://localhost:5000/api/v1/users/profile',
  {
    method: 'GET',
  }
);

const data = await response.json();
```

Or manually add the token:

```tsx
import { getAccessToken } from '@/services/authService';

const token = getAccessToken();
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## ⚙️ Configuration

### Change API Base URL

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://your-backend-url
```

### Add Google OAuth

Add to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🧪 Testing the Auth Flow

### Test Flow 1: Complete Registration
1. Call `register()` with name, email, password
2. User receives OTP in email
3. Call `verifyAccount()` with email and OTP
4. Account is now active

### Test Flow 2: Complete Login
1. Call `loginRequest()` with email and password
2. User receives OTP in email
3. Call `loginVerify()` with email and OTP
4. Receive accessToken and refreshToken
5. Tokens stored in localStorage

### Test Flow 3: Google OAuth
1. User clicks Google Login button
2. Google authentication window opens
3. User authenticates with Google
4. Receive accessToken and refreshToken
5. Tokens stored in localStorage

## 🐛 Error Handling

All functions throw errors on failure:

```tsx
try {
  await register(name, email, password);
} catch (err) {
  console.error('Registration failed:', err.message);
}
```

The `useAuth()` hook also provides an `error` state:

```tsx
const { error, clearError } = useAuth();

if (error) {
  return <div>{error.message}</div>;
}

// Clear error
<button onClick={clearError}>Dismiss</button>
```

## 📝 Type Definitions

```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  [key: string]: any;
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

## 🔄 Auth State Management

The `useAuth()` hook provides:

```typescript
interface UseAuthReturn {
  // States
  isLoading: boolean;
  error: AuthError | null;
  user: UserData | null;
  isAuthenticated: boolean;

  // Methods
  register: (name, email, password) => Promise<void>;
  verifyAccount: (email, otp) => Promise<void>;
  loginRequest: (email, password) => Promise<void>;
  loginVerify: (email, otp) => Promise<void>;
  googleLogin: (token) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
```

## 🚨 Important Notes

1. **2FA is Required** - Login process requires OTP verification via email
2. **Token Storage** - Tokens are stored in `localStorage` (not httpOnly cookies)
3. **Environment Variables** - Set `NEXT_PUBLIC_API_URL` to your backend URL
4. **CORS** - Backend must allow CORS requests from your frontend domain
5. **SSL/HTTPS** - Use HTTPS in production for secure token transmission

## 📱 Mobile Considerations

For mobile apps, consider:
- Using secure storage instead of localStorage
- Handling token refresh on app resume
- Implementing biometric authentication
- Managing session timeouts

## 🔐 Security Recommendations

1. ✅ **Always use HTTPS** in production
2. ✅ **Implement token refresh** logic
3. ✅ **Validate tokens** on app startup
4. ✅ **Clear tokens** on logout
5. ✅ **Use secure storage** for sensitive data
6. ✅ **Implement rate limiting** on auth endpoints
7. ✅ **Add CSRF protection** if needed

## 📞 Support

For issues or questions:
1. Check backend logs at `http://localhost:5000`
2. Verify environment variables
3. Check browser console for errors
4. Ensure backend is running and accessible
