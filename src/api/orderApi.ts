import api from "@/api/httpClient";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CreateOrderPayload = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  delivery: {
    fullName: string;
    phone: string;
    address: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    total: number;
    currency: string;
  };
  coupon?: {
    code: string;
    type: "percentage" | "fixed";
    value: number;
  };
};

export type CreateOrderResult = {
  id?: string;
  orderId?: string;
  orderNumber?: string;
  [key: string]: unknown;
};

export type OrderListResult = Record<string, unknown>[];

export type OrderDetailResult = Record<string, unknown>;

export type ReorderResult = {
  orderId?: string;
  orderNumber?: string;
  [key: string]: unknown;
};

const normalizeItems = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const objectValue = raw as { items?: unknown[]; data?: unknown[] };
    if (Array.isArray(objectValue.items)) return objectValue.items as T[];
    if (Array.isArray(objectValue.data)) return objectValue.data as T[];
  }
  return [];
};

export const orderApi = {
  createOrder: async (
    payload: CreateOrderPayload,
  ): Promise<CreateOrderResult> => {
    const { data } = await api.post<ApiResponse<CreateOrderResult>>(
      "/api/v1/orders",
      payload,
    );
    return data.data;
  },

  listMyOrders: async (): Promise<OrderListResult> => {
    const { data } = await api.get<ApiResponse<unknown>>("/api/v1/orders/me");
    return normalizeItems<Record<string, unknown>>(data.data);
  },

  getMyOrder: async (orderId: string): Promise<OrderDetailResult> => {
    const { data } = await api.get<ApiResponse<OrderDetailResult>>(
      `/api/v1/orders/${orderId}`,
    );
    return data.data;
  },

  cancelOrder: async (
    orderId: string,
    note?: string,
  ): Promise<OrderDetailResult> => {
    const { data } = await api.patch<ApiResponse<OrderDetailResult>>(
      `/api/v1/orders/${orderId}/cancel`,
      { note },
    );
    return data.data;
  },

  reorder: async (orderId: string): Promise<ReorderResult> => {
    const { data } = await api.post<ApiResponse<ReorderResult>>(
      `/api/v1/orders/${orderId}/reorder`,
      {},
    );
    return data.data;
  },
};
