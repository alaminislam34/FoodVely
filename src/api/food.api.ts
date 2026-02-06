import api from "@/api/Base_Api";

export interface FoodPayload {
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
  isAvailable?: boolean;
}

export interface FoodQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const createFood = async (payload: FoodPayload) => {
  const response = await api.post("/foods", payload);
  return response.data;
};

export const updateFood = async (id: string, payload: Partial<FoodPayload>) => {
  const response = await api.patch(`/foods/${id}`, payload);
  return response.data;
};

export const deleteFood = async (id: string) => {
  const response = await api.delete(`/foods/${id}`);
  return response.data;
};

export const getFoods = async (params: FoodQueryParams = {}) => {
  const response = await api.get("/foods", { params });
  return response.data;
};

export const getAdminFoods = async (params: FoodQueryParams = {}) => {
  const response = await api.get("/admin/foods", { params });
  return response.data;
};
