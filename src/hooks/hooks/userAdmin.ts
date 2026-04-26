import { useMutation, useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import { httpClient } from "@/api/httpClient";
import API_ENDPOINTS from "@/api/ApiEndpoints";

export interface AdminUserMapped {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "RESTAURANT" | "ADMIN";
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  createdAt: string;
  totalOrders: number;
  emailVerified: boolean;
  image: string;
}

export interface AdminUserParams {
  page?: number; // Keep these as numbers here
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}

export function useAdminUsersList(params: AdminUserParams) {
  return useQuery({
    queryKey: [
      "adminUsers",
      params.page,
      params.limit,
      params.search,
      params.status,
      params.role,
    ],
    queryFn: async () => {
      const response = await httpClient.get(API_ENDPOINTS.ADMIN.GET_USERS, {
        params: {
          page: params.page ? Number(params.page) : undefined,
          limit: params.limit ? Number(params.limit) : undefined,
          search: params.search || undefined,
          status: params.status,
          role: params.role,
        },
      });

      return {
        users: response.data,
        totalPages: response.meta?.totalPages ?? 1,
        totalItems: response.meta?.total ?? 0,
      };
    },
  });
}

export function useAdmin() {
  const loginMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const response = await adminService.adminSignIn(payload);
      return response;
    },
  });

  const getPlatformStatsMutation = useQuery({
    queryFn: async () => {
      const response = await adminService.getPlatformStats();
      return response;
    },
    queryKey: ["platformStats"],
  });

  const getPlatformActivityLogsMutation = useQuery({
    queryFn: async () => {
      const response = await adminService.getPlatformActivityLogs();
      return response;
    },
    queryKey: ["platformActivityLogs"],
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    platformStats: getPlatformStatsMutation.data,
    isGettingPlatformStats: getPlatformStatsMutation.isPending,
    platformStatsError: getPlatformStatsMutation.error,
    platformActivityLogs: getPlatformActivityLogsMutation.data,
    isGettingPlatformActivityLogs: getPlatformActivityLogsMutation.isPending,
    platformActivityLogsError: getPlatformActivityLogsMutation.error,
  };
}
