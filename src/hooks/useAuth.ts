"use client";

import { useState, useCallback, useEffect } from "react";
import * as authService from "@/services/authService";

interface AuthError {
  message: string;
  code?: string;
}

export interface UseAuthReturn {
  // States
  isLoading: boolean;
  error: AuthError | null;
  user: authService.UserData | null;
  isAuthenticated: boolean;

  // Auth Methods
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyAccount: (email: string, otp: string) => Promise<void>;
  loginRequest: (email: string, password: string) => Promise<void>;
  loginVerify: (email: string, otp: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [user, setUser] = useState<authService.UserData | null>(
    authService.getStoredUser(),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.registerUser(name, email, password);
        if (response.success) {
          setUser(response.data);
          authService.storeUser(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Registration failed";
        setError({ message: errorMessage });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const verifyAccount = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyAccount(email, otp);
      if (response.success) {
        setUser(response.data);
        authService.storeUser(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Account verification failed";
      setError({ message: errorMessage });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginRequest = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.loginRequest(email, password);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login request failed";
      setError({ message: errorMessage });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginVerify = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.loginVerify(email, otp);
      if (response.success) {
        authService.storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );
        setIsAuthenticated(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login verification failed";
      setError({ message: errorMessage });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(token);
      if (response.success) {
        authService.storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );
        setIsAuthenticated(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Google login failed";
      setError({ message: errorMessage });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return {
    isLoading,
    error,
    user,
    isAuthenticated,
    register,
    verifyAccount,
    loginRequest,
    loginVerify,
    googleLogin,
    logout,
    clearError,
  };
}
