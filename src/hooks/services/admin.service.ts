import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

export interface PlatformStats {
  // 👤 USERS
  totalUsers: number;
  totalUsersChange: number;

  activeUsers: number;
  activeUsersChange: number;

  totalCustomers: number;
  totalCustomersChange: number;

  totalProviders: number;
  totalProvidersChange: number;

  // 🚫 USER STATUS
  blockedUsers: number;
  blockedUsersChange: number;

  totalDeletedUsers: number;
  totalDeletedUsersChange: number;

  // 🍔 PLATFORM DATA
  totalFoods: number;
  totalFoodsChange: number;

  totalRestaurants: number;
  totalRestaurantsChange: number;

  // 📦 ORDERS
  totalOrders: number;
  totalOrdersChange: number;

  // 💰 REVENUE
  totalRevenue: number;
  totalRevenueChange: number;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  createdAt: string; // ISO string
}

const adminSignIn = async (payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: any }> => {
  const res = await httpClient.post(API_ENDPOINTS.ADMIN.SIGN_IN, payload);
  return res.data as { token: string; user: any };
};

const getPlatformStats = async (): Promise<PlatformStats> => {
  const res = await httpClient.get(API_ENDPOINTS.ADMIN.PLATFORM_STATS);
  return res.data as PlatformStats;
};

const getPlatformActivityLogs = async (): Promise<AuditLogEntry[]> => {
  const res = await httpClient.get(API_ENDPOINTS.ADMIN.GET_ACTIVITY_LOGS);
  return res.data as AuditLogEntry[];
};

export const adminService = {
  adminSignIn,
  getPlatformStats,
  getPlatformActivityLogs,
};
