import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFood,
  deleteFood,
  getAdminFoods,
  getFoods,
  updateFood,
  type FoodPayload,
  type FoodQueryParams,
} from "@/api/food.api";

const foodKeys = {
  all: ["foods"] as const,
  list: (params?: FoodQueryParams) =>
    [...foodKeys.all, "list", params ?? {}] as const,
  admin: (params?: FoodQueryParams) =>
    [...foodKeys.all, "admin", params ?? {}] as const,
};

export const useFoods = (params?: FoodQueryParams) =>
  useQuery({
    queryKey: foodKeys.list(params),
    queryFn: () => getFoods(params),
  });

export const useAdminFoods = (params?: FoodQueryParams) =>
  useQuery({
    queryKey: foodKeys.admin(params),
    queryFn: () => getAdminFoods(params),
  });

export const useCreateFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FoodPayload) => createFood(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodKeys.all });
    },
  });
};

export const useUpdateFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<FoodPayload> }) =>
      updateFood(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodKeys.all });
    },
  });
};

export const useDeleteFood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodKeys.all });
    },
  });
};
