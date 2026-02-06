import API_ENDPOINTS from "@/api/ApiEndpoints";

export interface UserData {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";

const isBrowser = typeof window !== "undefined";

const request = async <T = unknown>(path: string, options: RequestInit = {}, withAuth = false): Promise<ApiResponse<T>> => {
  const headers = new Headers(options.headers as HeadersInit);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (withAuth && isBrowser) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  const payload = text ? (JSON.parse(text) as ApiResponse<T>) : undefined;

  if (!res.ok) {
    const message = payload?.message || res.statusText || "Request failed";
    throw new Error(message);
  }

  return (payload as ApiResponse<T>) ?? { data: (payload as unknown) as T };
};

// Local storage helpers
export const storeTokens = (accessToken: string, refreshToken: string) => {
  if (!isBrowser) return;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  if (!isBrowser) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const storeUser = (user: UserData) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    // noop
  }
};

export const getStoredUser = (): UserData | null => {
  if (!isBrowser) return null;
  try {
    const v = localStorage.getItem("user");
    return v ? (JSON.parse(v) as UserData) : null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  return Boolean(localStorage.getItem("accessToken"));
};

// API methods
export const registerUser = (name: string, email: string, password: string) =>
  request<{ user: UserData }>(API_ENDPOINTS.REGISTER_API, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

export const verifyAccount = (email: string, otp: string) =>
  request<{ user: UserData }>(API_ENDPOINTS.VERIFY_EMAIL, {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

export const loginRequest = (email: string, password: string) =>
  request(API_ENDPOINTS.LOGIN_API, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const loginVerify = (email: string, otp: string) =>
  request<{ accessToken: string; refreshToken: string }>(API_ENDPOINTS.VERIFY_OTP, {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

export const googleLogin = (token: string) =>
  request<{ accessToken: string; refreshToken: string }>(API_ENDPOINTS.GOOGLE_LOGIN, {
    method: "POST",
    body: JSON.stringify({ token }),
  });

export default {
  // types + helpers
  storeTokens,
  clearTokens,
  storeUser,
  getStoredUser,
  isAuthenticated,

  // api
  registerUser,
  verifyAccount,
  loginRequest,
  loginVerify,
  googleLogin,
};