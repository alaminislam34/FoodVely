import { useQuery } from "@tanstack/react-query";
import { providerService } from "../services/provider.service";

export function useProvider() {
  const {
    data: platformStats,
    isLoading: PlatformStatsLoading,
    isError: platformStatsError,
  } = useQuery({
    queryKey: ["provider-stats"],
    queryFn: async () => {
      const res = await providerService.getProviderPlatformStats();
      return res as {
        todaysOrders: number;
        totalOrders: number;
        todaysRevenue: number;
        totalRevenue: number;
        activeProducts: number;
        outOfStock: number;
        pendingOrders: number;
        rating: number;
      };
    },
  });
  return { platformStats, PlatformStatsLoading, platformStatsError };
}
