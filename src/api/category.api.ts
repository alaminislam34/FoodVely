import api from "@/api/Base_Api";

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const createCategory = async (payload: CategoryPayload) => {
  const response = await api.post("/categories", payload);
  return response.data;
};

export const updateCategory = async (
  id: string,
  payload: Partial<CategoryPayload>,
) => {
  const response = await api.patch(`/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const getCategories = async (params: CategoryQueryParams = {}) => {
  const response = await api.get("/categories", { params });
  return response.data;
};

export const getAdminCategories = async (params: CategoryQueryParams = {}) => {
  const response = await api.get("/admin/categories", { params });
  return response.data;
};
