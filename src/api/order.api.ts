import api from "@/api/Base_Api";

export interface OrderPayload {
  items: Array<{ foodId: string; quantity: number }>;
  deliveryAddress?: string;
  notes?: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateOrderStatusPayload {
  status: string;
}

export const createOrder = async (payload: OrderPayload) => {
  const response = await api.post("/orders", payload);
  return response.data;
};

export const getMyOrders = async (params: OrderQueryParams = {}) => {
  const response = await api.get("/orders/my", { params });
  return response.data;
};

export const getRestaurantOrders = async (params: OrderQueryParams = {}) => {
  const response = await api.get("/orders/restaurant", { params });
  return response.data;
};

export const getAdminOrders = async (params: OrderQueryParams = {}) => {
  const response = await api.get("/admin/orders", { params });
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  payload: UpdateOrderStatusPayload,
) => {
  const response = await api.patch(`/admin/orders/${id}`, payload);
  return response.data;
};
