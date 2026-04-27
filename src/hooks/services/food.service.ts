import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

export interface IFoodPayload {
  title: string;
  slug: string;
  description?: string;
  basePrice: number;
  currency?: string;
  providerId: string;
  categoryId: string;
  stock?: number;
  images?: File[];
}

const createFood = async (data: IFoodPayload) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (value !== undefined) {
      formData.append(key, value as any);
    }
  });

  const res = await httpClient.post(API_ENDPOINTS.FOOD.CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

const updateFood = async (id: string, data: IFoodPayload) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (value !== undefined) {
      formData.append(key, value as any);
    }
  });

  const res = await httpClient.patch(
    `${API_ENDPOINTS.FOOD.UPDATE}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res;
};

export const foodService = {
  createFood,
  updateFood,
};
