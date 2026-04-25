import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

const getAllCategoriesForPublic = async () => {
  const res = await httpClient.get(API_ENDPOINTS.CATEGORY.GET_ALL_FOR_PUBLIC);
  return res.data; // ✅ only data return
};

const getAllCategoriesForAdmin = async () => {
  const res = await httpClient.get(API_ENDPOINTS.CATEGORY.GET_ALL_FOR_ADMIN);
  return res.data;
};

const createCategory = async (payload: {
  title: string;
  description?: string;
  image?: string;
}) => {
  const res = await httpClient.post(API_ENDPOINTS.CATEGORY.CREATE, payload);
  return res.data;
};

const updateCategory = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    image?: string;
  },
) => {
  const res = await httpClient.put(API_ENDPOINTS.CATEGORY.UPDATE(id), payload);
  return res.data;
};

export const categoryService = {
  getAllCategoriesForPublic,
  getAllCategoriesForAdmin,
  createCategory,
  updateCategory,
};
