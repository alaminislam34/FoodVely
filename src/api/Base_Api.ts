import axios, { type CreateAxiosDefaults } from "axios";

const BASE_API: CreateAxiosDefaults<any> = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
};

const isBrowser = typeof window !== "undefined";

const getTokens = () => {
  if (!isBrowser) return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
};

const setTokens = (newAccessToken: string, newRefreshToken: string) => {
  if (!isBrowser) return;
  localStorage.setItem("accessToken", newAccessToken);
  localStorage.setItem("refreshToken", newRefreshToken);
};

const clearTokens = () => {
  if (!isBrowser) return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const api = axios.create(BASE_API);

api.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { refreshToken } = getTokens();
      if (!refreshToken) {
        clearTokens();
        if (isBrowser && window.location.pathname.startsWith("/admin")) {
          window.location.href = "/account/signin";
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          },
        );
        const newAccessToken = data.data.accessToken as string;
        const newRefreshToken = data.data.refreshToken as string;
        setTokens(newAccessToken, newRefreshToken);
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshError) {
        clearTokens();
        if (isBrowser && window.location.pathname.startsWith("/admin")) {
          window.location.href = "/account/signin";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
