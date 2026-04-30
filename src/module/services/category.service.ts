import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface ICategory {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  image: string; // Changed from imageUrl to image to match Backend/Prisma
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const getAllCategoriesForPublic = async (): Promise<ICategory[]> => {
  const res = await httpClient.get<ICategory[]>(
    API_ENDPOINTS.CATEGORY.GET_ALL_FOR_PUBLIC,
  );
  return res.data as ICategory[]; // Explicitly cast to ICategory[]
};

const getAllCategoriesForAdmin = async (): Promise<ICategory[]> => {
  const res = await httpClient.get<ICategory[]>(
    API_ENDPOINTS.CATEGORY.GET_ALL_FOR_ADMIN,
  );
  return res.data as ICategory[]; // Explicitly cast to ICategory[]
};

// Use FormData so Multer on backend can grab the file
const createCategory = async (payload: FormData): Promise<ICategory> => {
  const res = await httpClient.post<ICategory>(
    API_ENDPOINTS.CATEGORY.CREATE,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

// Update also uses FormData to handle new image uploads
const updateCategory = async (
  id: string,
  payload: FormData,
): Promise<ICategory> => {
  const res = await httpClient.patch<ICategory>(
    API_ENDPOINTS.CATEGORY.UPDATE(id),
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await httpClient.del(API_ENDPOINTS.CATEGORY.DELETE(id));
};

const activateCategory = async (id: string): Promise<ICategory> => {
  const res = await httpClient.patch<ICategory>(
    API_ENDPOINTS.CATEGORY.ACTIVATE(id),
  );
  return res.data;
};

const deactivateCategory = async (id: string): Promise<ICategory> => {
  const res = await httpClient.patch<ICategory>(
    API_ENDPOINTS.CATEGORY.DEACTIVATE(id),
  );
  return res.data;
};

export const categoryService = {
  getAllCategoriesForPublic,
  getAllCategoriesForAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  activateCategory,
  deactivateCategory,
};
