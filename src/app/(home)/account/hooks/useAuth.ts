"use client";

import { useCallback, useState } from "react";
import axios from "axios";
import api from "@/api/Base_Api";
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
      if (axios.isAxiosError(err)) {
        if (!err.response)
          message = "Network error. Please check your connection.";
        else {
          const apiMessage = (
            err.response?.data as { message?: string } | undefined
          )?.message;
          message = apiMessage || err.message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
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
        const response = await api.post<ApiResponse<unknown>>(
          API_ENDPOINTS.REGISTER_API,
          payload,
        );
        return response.data;
      }),
    [run],
  );

  const verifyAccount = useCallback(
    async (payload: EmailOtpPayload) =>
      run(async () => {
        const response = await api.post<ApiResponse<unknown>>(
          API_ENDPOINTS.VERIFY_EMAIL,
          payload,
        );
        return response.data;
      }),
    [run],
  );
  const resendOtp = useCallback(
    async (payload: ResendOtp) =>
      run(async () => {
        const response = await api.post<ApiResponse<unknown>>(
          API_ENDPOINTS.RESEND_VERIFICATION,
          payload,
        );
        return response.data;
      }),
    [run],
  );

  const login = useCallback(
    async (payload: LoginPayload) =>
      run(async () => {
        const response = await api.post<ApiResponse<unknown>>(
          API_ENDPOINTS.LOGIN_API,
          payload,
        );
        if (response.data.success === true) {
          const tokens = response?.data?.data as AuthTokens;
          storeTokens(tokens);
        }
        return response.data;
      }),
    [run],
  );

  const verifyOtp = useCallback(
    async (payload: EmailOtpPayload) =>
      run(async () => {
        const response = await api.post<ApiResponse<unknown>>(
          API_ENDPOINTS.VERIFY_OTP,
          payload,
        );
        const tokens = extractTokens(response.data);
        if (tokens) storeTokens(tokens);
        return response.data;
      }),
    [run],
  );

  const refreshToken = useCallback(
    async (payload: RefreshTokenPayload) =>
      run(async () => {
        const response = await api.post<ApiResponse<unknown>>(
          API_ENDPOINTS.REFRESH_TOKEN,
          payload,
        );
        const tokens = extractTokens(response.data);
        if (tokens) storeTokens(tokens);
        return response.data;
      }),
    [run],
  );

  const getProfile = useCallback(
    async () =>
      run(async () => {
        const response = await api.get<ApiResponse<UserProfile>>(
          API_ENDPOINTS.GET_PROFILE,
        );
        return response.data;
      }),
    [run],
  );

  return {
    isLoading,
    error,
    register,
    verifyAccount,
    login,
    verifyOtp,
    refreshToken,
    getProfile,
    clearError,
    resendOtp,
  };
}
