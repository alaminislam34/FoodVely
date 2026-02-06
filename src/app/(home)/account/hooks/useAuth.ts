"use client";

import { useCallback, useState } from "react";
import API_ENDPOINTS from "@/api/ApiEndpoints";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface EmailOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtp {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface GoogleLoginPayload {
  credential: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type UserProfile = Record<string, unknown>;

export interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  register: (payload: RegisterPayload) => Promise<unknown>;
  verifyAccount: (payload: EmailOtpPayload) => Promise<unknown>;
  login: (payload: LoginPayload) => Promise<unknown>;
  googleLogin: (payload: GoogleLoginPayload) => Promise<unknown>;
  verifyOtp: (payload: EmailOtpPayload) => Promise<unknown>;
  resendOtp: (payload: ResendOtp) => Promise<unknown>;
  refreshToken: (payload: RefreshTokenPayload) => Promise<unknown>;
  getProfile: () => Promise<UserProfile | unknown>;
  clearError: () => void;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

type ApiError = {
  message: string;
  status?: number;
  details?: unknown;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
  withAuth = false,
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (withAuth) {
    const accessToken = getAccessToken();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiResponse<T>) : undefined;

  if (!response.ok) {
    const message = payload?.message || response.statusText || "Request failed";
    const error: ApiError = { message, status: response.status, details: payload };
    throw error;
  }

  return (payload?.data ?? (payload as T)) as T;
};

const storeTokens = (tokens: AuthTokens) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
};

const extractTokens = (payload: unknown): AuthTokens | null => {
  const data = (payload as { data?: AuthTokens } | undefined)?.data ?? payload;
  const accessToken = (data as AuthTokens | undefined)?.accessToken;
  const refreshToken = (data as AuthTokens | undefined)?.refreshToken;
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
};

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T>(task: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      return await task();
    } catch (err) {
      let message = "Request failed";
      const apiErr = err as ApiError | undefined;
      if (apiErr?.message) message = apiErr.message;
      else if (err instanceof Error) message = err.message;
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const register = useCallback(
    async (payload: RegisterPayload) =>
      run(async () => {
        return request<unknown>(API_ENDPOINTS.REGISTER_API, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }),
    [run],
  );

  const verifyAccount = useCallback(
    async (payload: EmailOtpPayload) =>
      run(async () => {
        return request<unknown>(API_ENDPOINTS.VERIFY_EMAIL, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }),
    [run],
  );
  const resendOtp = useCallback(
    async (payload: ResendOtp) =>
      run(async () => {
        return request<unknown>(API_ENDPOINTS.RESEND_VERIFICATION, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }),
    [run],
  );

  const login = useCallback(
    async (payload: LoginPayload) =>
      run(async () => {
        return request<unknown>(API_ENDPOINTS.LOGIN_API, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }),
    [run],
  );

  const googleLogin = useCallback(
    async (payload: GoogleLoginPayload) =>
      run(async () => {
        const response = await request<unknown>(API_ENDPOINTS.GOOGLE_LOGIN, {
          method: "POST",
          body: JSON.stringify({ token: payload.credential }),
        });
        const tokens = extractTokens(response);
        if (tokens) storeTokens(tokens);
        return response;
      }),
    [run],
  );

  const verifyOtp = useCallback(
    async (payload: EmailOtpPayload) =>
      run(async () => {
        const response = await request<unknown>(API_ENDPOINTS.VERIFY_OTP, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const tokens = extractTokens(response);
        if (tokens) storeTokens(tokens);
        return response;
      }),
    [run],
  );

  const refreshToken = useCallback(
    async (payload: RefreshTokenPayload) =>
      run(async () => {
        const response = await request<unknown>(API_ENDPOINTS.REFRESH_TOKEN, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const tokens = extractTokens(response);
        if (tokens) storeTokens(tokens);
        return response;
      }),
    [run],
  );

  const getProfile = useCallback(
    async () =>
      run(async () => {
        return request<UserProfile>(API_ENDPOINTS.GET_PROFILE, { method: "GET" }, true);
      }),
    [run],
  );

  return {
    isLoading,
    error,
    register,
    verifyAccount,
    login,
    googleLogin,
    verifyOtp,
    refreshToken,
    getProfile,
    clearError,
    resendOtp,
  };
}
