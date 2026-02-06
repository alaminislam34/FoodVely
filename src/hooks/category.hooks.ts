import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getCategories,
  updateCategory,
  type CategoryPayload,
  type CategoryQueryParams,
} from "@/api/category.api";

const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: CategoryQueryParams) =>
    [...categoryKeys.all, "list", params ?? {}] as const,
  admin: (params?: CategoryQueryParams) =>
    [...categoryKeys.all, "admin", params ?? {}] as const,
};

export const useCategories = (params?: CategoryQueryParams) =>
  useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
  });

export const useAdminCategories = (params?: CategoryQueryParams) =>
  useQuery({
    queryKey: categoryKeys.admin(params),
    queryFn: () => getAdminCategories(params),
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryPayload> }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
};
