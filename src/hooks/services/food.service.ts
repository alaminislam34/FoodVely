import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

export interface IFoodInfo {
  isVeg: boolean;
  isSpicy: boolean;
  calories?: number;
  preparationTime?: number;
}

export interface IFoodPayload {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  discountPrice?: number;
  currency?: string;
  providerId?: string;
  categoryId: string;
  stock?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  foodInfo: IFoodInfo; // Nested object
  metaTitle?: string;
  metaDescription?: string;
  images?: File[]; // Files for Multer
}

const createFood = async (data: IFoodPayload) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (key === "foodInfo") {
      // CRITICAL: Stringify the nested object for FormData
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await httpClient.post(API_ENDPOINTS.FOOD.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const updateFood = async (id: string, data: Partial<IFoodPayload>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (key === "foodInfo") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await httpClient.patch(
    `${API_ENDPOINTS.FOOD.UPDATE}/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
};

export const foodService = { createFood, updateFood };
