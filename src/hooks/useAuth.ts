"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/authService";
import { httpClient } from "@/api/httpClient";
import API_ENDPOINTS from "@/api/ApiEndpoints";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  [key: string]: unknown;
}

const AUTH_QUERY_KEY = ["authUser"];

export function useAuth() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const profile = await authService.getProfile();
        return profile;
      } catch {
        Cookies.remove("better-auth.session_token");
        return null;
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
    enabled: true,
  });

  // After login/register/verify, refetch user profile to update user store
  const handleAuthSuccess = useCallback(
    async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    },
    [queryClient],
  );

  const registerMutation = useMutation({
    mutationFn: authService.registerUser,
    onSuccess: () => handleAuthSuccess(),
    onError: (err: any) => {
      setError(err?.message || "Registration failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await authService.loginUser(payload);
      return (
        response.data?.user ??
        (response.data as unknown as authService.UserData) ??
        null
      );
    },
    onSuccess: () => handleAuthSuccess(),
    onError: (err: any) => {
      setError(err?.message || "Login failed");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (vars: { email: string; otp: string }) =>
      authService.verifyEmail(vars.email, vars.otp),
    onSuccess: () => handleAuthSuccess(),
    onError: (err: any) => {
      setError(err?.message || "Verification failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logoutApi,
    onSettled: () => {
      authService.clearAuthTokens();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      window.location.href = "/";
    },
  });

  const forgotPassword = useCallback(async (email: string) => {
    const res = await httpClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    if (!res.success) {
      toast.error(res.message);
      throw new Error(res.message);
    }
    return res;
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string): Promise<{ resetToken?: string }> => {
      const res = await httpClient.post(
        API_ENDPOINTS.VERIFY_PASSWORD_RESET_OTP,
        {
          email,
          otp,
        },
      );
      if (!res.success) {
        toast.error(res.message);
        throw new Error(res.message);
      }
      return { resetToken: res.data as string };
    },
    [],
  );

  const resetPassword = useCallback(
    async (email: string, oldPassword: string, newPassword: string) => {
      const res = await httpClient.post(API_ENDPOINTS.RESET_PASSWORD, {
        email,
        oldPassword,
        newPassword,
      });
      if (!res.success) {
        toast.error(res.message);
        throw new Error(res.message);
      }
      return res;
    },
    [],
  );

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading: isLoading || isFetching,
    isProcessing:
      registerMutation.isPending ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      verifyEmailMutation.isPending,
    login: loginMutation.mutateAsync,
    loginRequest: async (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    register: registerMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
    verifyAccount: verifyEmailMutation.mutateAsync,
    logout: logoutMutation.mutate,
    forgotPassword,
    verifyOtp,
    resetPassword,
    error,
    clearError: () => setError(null),
  };
}
