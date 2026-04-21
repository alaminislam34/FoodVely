/**
 * Auth Service - Handles all authentication API calls
 * Base URL: http://localhost:5000/api/v1/auth
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const AUTH_ENDPOINT = `${API_BASE_URL}/api/v1/auth`;

interface AuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const readErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as
      | { message?: string; error?: { message?: string } }
      | undefined;

    return payload?.message || payload?.error?.message || fallback;
  } catch {
    return fallback;
  }
};

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  [key: string]: any;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface PasswordResetRequestData {
  message?: string;
  email?: string;
}

export interface PasswordResetVerifyData {
  message?: string;
  resetToken?: string;
  email?: string;
}

export interface ProviderRestaurantPayload {
  restaurantName: string;
  city: string;
  address: string;
  contactNumber?: string;
  cuisine?: string;
  openingHours?: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  foodCategories?: string[];
}

export interface CreateProviderPayload {
  password: string;
  user: {
    name: string;
    email: string;
    role: "PROVIDER";
  };
  restaurant: ProviderRestaurantPayload;
}

export interface CreateProviderResponseData {
  accessToken?: string;
  refreshToken?: string;
  user?: UserData;
  message?: string;
  [key: string]: unknown;
}

const FAKE_LOGIN = {
  email: "user@gmail.com",
  password: "alamin",
  user: {
    id: "demo-user",
    name: "Foodvely Member",
    email: "user@gmail.com",
    role: "CUSTOMER",
    status: "active",
  } satisfies UserData,
};

// Register User
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse<UserData>> {
  const response = await fetch(`${AUTH_ENDPOINT}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Registration failed"));
  }

  return response.json();
}

// Verify Account (OTP verification after registration)
export async function verifyAccount(
  email: string,
  otp: string,
): Promise<AuthResponse<UserData>> {
  const response = await fetch(`${AUTH_ENDPOINT}/verify-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Account verification failed"),
    );
  }

  return response.json();
}

export async function createProviderAccount(
  payload: CreateProviderPayload,
): Promise<AuthResponse<CreateProviderResponseData>> {
  const response = await fetch(`${AUTH_ENDPOINT}/create-provider`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Provider account creation failed"),
    );
  }

  return response.json();
}

// Login Request (Step 1 - Send OTP)
export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthResponse<{ message: string }>> {
  if (email === FAKE_LOGIN.email && password === FAKE_LOGIN.password) {
    return {
      success: true,
      message: "Login accepted",
      data: { message: "Login accepted" },
    };
  }

  throw new Error("Invalid email or password");
}

// Login Verify (Step 2 - Verify OTP and get tokens)
export async function loginVerify(
  email: string,
  otp: string,
): Promise<AuthResponse<TokenData>> {
  if (email === FAKE_LOGIN.email && otp.trim()) {
    return {
      success: true,
      message: "OTP verified",
      data: {
        accessToken: "demo-access-token",
        refreshToken: "demo-refresh-token",
      },
    };
  }

  throw new Error("OTP verification failed");
}

// Password Reset Request (Step 1 - Send OTP)
export async function requestPasswordReset(
  email: string,
): Promise<AuthResponse<PasswordResetRequestData>> {
  const response = await fetch(`${AUTH_ENDPOINT}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Password reset request failed"),
    );
  }

  return response.json();
}

// Password Reset OTP Verification (Step 2)
export async function verifyPasswordResetOtp(
  email: string,
  otp: string,
): Promise<AuthResponse<PasswordResetVerifyData>> {
  const response = await fetch(`${AUTH_ENDPOINT}/forgot-password/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Password reset verification failed"),
    );
  }

  return response.json();
}

// Password Reset (Step 3 - Update password)
export async function resetPassword(payload: {
  email?: string;
  resetToken?: string;
  password: string;
}): Promise<AuthResponse<{ message?: string }>> {
  const response = await fetch(`${AUTH_ENDPOINT}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Password reset failed"));
  }

  return response.json();
}

// Google Login
export async function googleLogin(
  token: string,
): Promise<AuthResponse<TokenData>> {
  const response = await fetch(`${AUTH_ENDPOINT}/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Google login failed"));
  }

  return response.json();
}

// Store tokens in localStorage
export function storeTokens(accessToken: string, refreshToken: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
}

// Get stored access token
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

// Get stored refresh token
export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
}

// Clear tokens (Logout)
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

// Get stored user data
export function getStoredUser(): UserData | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

// Store user data
export function storeUser(user: UserData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

// Make authenticated API requests with token
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
