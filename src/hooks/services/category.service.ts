import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";
import { Category } from "../hooks/useCategory";

const getAllCategoriesForPublic = async (): Promise<Category[]> => {
  const res = await httpClient.get(API_ENDPOINTS.CATEGORY.GET_ALL_FOR_PUBLIC);
  return res.data as Category[]; // ✅ only data return
};

const getAllCategoriesForAdmin = async (): Promise<Category[]> => {
  const res = await httpClient.get(API_ENDPOINTS.CATEGORY.GET_ALL_FOR_ADMIN);
  return res.data as Category[];
};

const createCategory = async (payload: FormData): Promise<Category> => {
  const res = await httpClient.post(API_ENDPOINTS.CATEGORY.CREATE, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data as Category;
};

const updateCategory = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    image?: string;
  },
): Promise<Category> => {
  const res = await httpClient.put(API_ENDPOINTS.CATEGORY.UPDATE(id), payload);
  return res.data as Category;
};

export const categoryService = {
  getAllCategoriesForPublic,
  getAllCategoriesForAdmin,
  createCategory,
  updateCategory,
};
