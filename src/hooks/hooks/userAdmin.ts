import { useMutation, useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admin.service";
import { adminApi } from "@/api/adminApi";

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

export function useAdminUsersList(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: [
      "adminUsers",
      params.page,
      params.limit,
      params.search,
      params.role,
      params.status,
    ],
    queryFn: async () => {
      const response = await adminApi.listUsersPaged({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        role:
          params.role && params.role !== "all"
            ? params.role.toUpperCase()
            : undefined,
        status:
          params.status && params.status !== "all"
            ? params.status.toUpperCase()
            : undefined,
      });
      const mappedUsers: AdminUserMapped[] = (response.items ?? []).map(
        (item) => ({
          id: String(item.id ?? ""),
          name: String(item.name ?? ""),
          email: String(item.email ?? ""),

          role: (item.role ?? "CUSTOMER") as AdminUserMapped["role"],
          status: (item.status ?? "ACTIVE") as AdminUserMapped["status"],

          createdAt: String(item.createdAt ?? new Date().toISOString()),
          totalOrders: Number(item.totalOrders ?? 0),
          emailVerified: Boolean(item.emailVerified ?? false),

          image: String(item.image ?? ""),
        }),
      );
      return {
        users: mappedUsers,
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
