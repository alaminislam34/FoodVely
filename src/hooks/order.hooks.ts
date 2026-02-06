import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  getAdminOrders,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
  type OrderPayload,
  type OrderQueryParams,
  type UpdateOrderStatusPayload,
} from "@/api/order.api";

const orderKeys = {
  all: ["orders"] as const,
  my: (params?: OrderQueryParams) =>
    [...orderKeys.all, "my", params ?? {}] as const,
  restaurant: (params?: OrderQueryParams) =>
    [...orderKeys.all, "restaurant", params ?? {}] as const,
  admin: (params?: OrderQueryParams) =>
    [...orderKeys.all, "admin", params ?? {}] as const,
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useMyOrders = (params?: OrderQueryParams) =>
  useQuery({
    queryKey: orderKeys.my(params),
    queryFn: () => getMyOrders(params),
  });

export const useRestaurantOrders = (params?: OrderQueryParams) =>
  useQuery({
    queryKey: orderKeys.restaurant(params),
    queryFn: () => getRestaurantOrders(params),
  });

export const useAdminOrders = (params?: OrderQueryParams) =>
  useQuery({
    queryKey: orderKeys.admin(params),
    queryFn: () => getAdminOrders(params),
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusPayload }) =>
      updateOrderStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
