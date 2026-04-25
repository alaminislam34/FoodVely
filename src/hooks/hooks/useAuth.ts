"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AuthServices } from "../services/auth.service";

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
        const profile = await AuthServices.getMe();
        return profile;
      } catch (error: any) {
        if (error.status === 401 || error.status === 403) {
          Cookies.remove("better-auth.session_token");
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          return null;
        }
        return null;
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes (can be adjusted based on needs)
    gcTime: 1000 * 60 * 60, // 1 hour (garbage collection time for unused cache)
    retry: false,
    enabled: true,
  });

  const handleAuthSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  }, [queryClient]);

  const registerMutation = useMutation({
    mutationFn: AuthServices.register,
    onSuccess: () => handleAuthSuccess(),
    onError: (err: any) => {
      setError(err?.message || "Registration failed");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      AuthServices.verifyEmail(payload),
    onSuccess: () => handleAuthSuccess(),
    onError: (err: any) => {
      setError(err?.message || "Email verification failed");
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (email: string) => AuthServices.resendOtp(email),
    onError: (err: any) => {
      setError(err?.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string, rememberMe?: boolean }) => {
      const response = await AuthServices.loginUser(payload);
      return response;
    },
    onSuccess: () => handleAuthSuccess(),
    onError: (err: any) => {
      setError(err?.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthServices.logoutUser,
    onSettled: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      window.location.href = "/";
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await AuthServices.forgotPassword(email);
      return res.message;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      const res = await AuthServices.resetPassword(payload);
      return res.message;
    },
  });

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading: isLoading || isFetching,
    isProcessing:
      registerMutation.isPending ||
      loginMutation.isPending ||
      logoutMutation.isPending ||
      verifyEmailMutation.isPending,
    loginRequest: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
    verifyAccount: verifyEmailMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resendOtp: resendOtpMutation.mutateAsync,
    error,
    clearError: () => setError(null),
  };
}
