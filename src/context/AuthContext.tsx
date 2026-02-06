"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useAuth,
  UseAuthReturn,
  UserProfile,
} from "@/app/(home)/account/hooks/useAuth";

interface AuthContextType extends UseAuthReturn {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const auth = useAuth();
  const { getProfile } = auth;
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  });

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }

    const getUser = async () => {
      try {
        const profile = await getProfile();
        const data =
          (profile as { data?: UserProfile } | undefined)?.data ?? profile;
        setUser((data as UserProfile) ?? null);
      } catch {
        setUser(null);
      }
    };

    void getUser();
  }, [accessToken, getProfile]);

  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
