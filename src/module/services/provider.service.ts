import API_ENDPOINTS from "@/api/ApiEndpoints";
import { httpClient } from "@/api/httpClient";

const getProviderPlatformStats = async () => {
  const res = await httpClient.get(API_ENDPOINTS.PROVIDER.DASHBOARD_STATS);
  return res.data;
};

export const providerService = {
  getProviderPlatformStats,
};
