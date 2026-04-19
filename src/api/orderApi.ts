import api from "@/api/Base_Api";

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

export const orderApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<CreateOrderResult> => {
    const { data } = await api.post<ApiResponse<CreateOrderResult>>("/api/v1/orders", payload);
    return data.data;
  },
};
