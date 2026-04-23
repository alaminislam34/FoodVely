"use client";

import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

const storeAuthTokens = (payload: unknown) => {
  if (typeof window === "undefined") return;
  const parsed = (payload as { data?: any } | undefined)?.data ?? payload;
  const accessToken =
    parsed?.token?.accesssToken ?? parsed?.accessToken ?? null;
  const refreshToken = parsed?.token?.refreshToken ?? parsed?.refreshToken ?? null;

  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const clearAuthTokens = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// --- Interfaces ---
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

interface AuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export async function registerUser(
  payload: RegisterRequest,
): Promise<AuthResponse<UserData>> {
  try {
    const res = await httpClient.post<UserData>(API_ENDPOINTS.REGISTER_API, payload);
    storeAuthTokens(res);
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  [key: string]: unknown;
}

export async function loginUser(
  payload: LoginPayload,
): Promise<AuthResponse<{ user: UserData }>> {
  try {
    const res = await httpClient.post<{ user: UserData }>(
      API_ENDPOINTS.LOGIN_API,
      payload,
    );
    storeAuthTokens(res);
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function verifyEmail(
  email: string,
  otp: string,
): Promise<AuthResponse<UserData>> {
  try {
    const res = await httpClient.post<UserData>(API_ENDPOINTS.VERIFY_EMAIL, {
      email,
      otp,
    });
    storeAuthTokens(res);
    return res;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Verification failed");
  }
}

export async function logoutApi(): Promise<void> {
  try {
    await httpClient.post(API_ENDPOINTS.LOGOUT_API);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout failed");
  } finally {
    clearAuthTokens();
  }
}


export async function getProfile(): Promise<UserData> {
  const response = await httpClient.get<Record<string, unknown>>(API_ENDPOINTS.GET_CUSTOMER_PROFILE);
  const data = response.data as Record<string, unknown> | null;
  if (!data) {
    throw new Error("Failed to load profile");
  }
  return (data.user ?? data) as UserData;
}

export async function forgotPassword(email: string) {
  try {
    await httpClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to request password reset",
    );
  }
}

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await httpClient.post<{ resetToken?: string }>(
      API_ENDPOINTS.VERIFY_PASSWORD_RESET_OTP,
      { email, otp },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
};
