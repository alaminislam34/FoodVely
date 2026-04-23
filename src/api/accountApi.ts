import api from "@/api/httpClient";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AccountAddress = {
  id?: string;
  label: string;
  line: string;
  city: string;
  phone: string;
};

export type AccountPaymentMethod = {
  id?: string;
  label: string;
  brand: string;
  last4: string;
  expiry: string;
};

export type AccountSettings = {
  name: string;
  phone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
};

const normalizeArray = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const value = raw as { items?: unknown[]; data?: unknown[] };
    if (Array.isArray(value.items)) return value.items as T[];
    if (Array.isArray(value.data)) return value.data as T[];
  }
  return [];
};

export const accountApi = {
  listAddresses: async (): Promise<AccountAddress[]> => {
    const { data } = await api.get<ApiResponse<unknown>>(
      "/api/v1/account/addresses",
    );
    return normalizeArray<AccountAddress>(data.data);
  },

  createAddress: async (payload: AccountAddress): Promise<AccountAddress> => {
    const { data } = await api.post<ApiResponse<AccountAddress>>(
      "/api/v1/account/addresses",
      payload,
    );
    return data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/account/addresses/${id}`);
  },

  listPaymentMethods: async (): Promise<AccountPaymentMethod[]> => {
    const { data } = await api.get<ApiResponse<unknown>>(
      "/api/v1/account/payment-methods",
    );
    return normalizeArray<AccountPaymentMethod>(data.data);
  },

  createPaymentMethod: async (
    payload: AccountPaymentMethod,
  ): Promise<AccountPaymentMethod> => {
    const { data } = await api.post<ApiResponse<AccountPaymentMethod>>(
      "/api/v1/account/payment-methods",
      payload,
    );
    return data.data;
  },

  deletePaymentMethod: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/account/payment-methods/${id}`);
  },

  getSettings: async (): Promise<AccountSettings> => {
    const { data } = await api.get<ApiResponse<AccountSettings>>(
      "/api/v1/account/settings",
    );
    return data.data;
  },

  updateSettings: async (
    payload: AccountSettings,
  ): Promise<AccountSettings> => {
    const { data } = await api.patch<ApiResponse<AccountSettings>>(
      "/api/v1/account/settings",
      payload,
    );
    return data.data;
  },
};
