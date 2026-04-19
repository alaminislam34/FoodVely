import api from "@/api/Base_Api";

type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  requestId?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  meta?: ApiMeta;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
};

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
};

const getList = async <T>(url: string, params?: ListParams): Promise<T[]> => {
  const { data } = await api.get<ApiResponse<T[]>>(url, { params });
  return data.data ?? [];
};

const getListWithMeta = async <T>(
  url: string,
  params?: ListParams,
): Promise<PaginatedResult<T>> => {
  const { data } = await api.get<ApiResponse<T[]>>(url, { params });
  return {
    items: data.data ?? [],
    meta: data.meta,
  };
};

const getOne = async <T>(url: string, params?: ListParams): Promise<T> => {
  const { data } = await api.get<ApiResponse<T>>(url, { params });
  return data.data;
};

const postAction = async <T>(url: string, payload?: Record<string, unknown>): Promise<T> => {
  const { data } = await api.post<ApiResponse<T>>(url, payload ?? {});
  return data.data;
};

const patchAction = async <T>(url: string, payload: Record<string, unknown>): Promise<T> => {
  const { data } = await api.patch<ApiResponse<T>>(url, payload);
  return data.data;
};

const deleteAction = async (url: string, payload?: Record<string, unknown>): Promise<void> => {
  await api.delete(url, { data: payload ?? {} });
};

export const adminApi = {
  listUsers: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/users", params),
  listUsersPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/users", params),
  listBannedUsers: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/banned-users", params),
  unbanUser: (id: string, reason: string) => postAction(`/api/v1/admin/users/${id}/unban`, { reason }),
  listRoles: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/roles", params),
  listActivityLogs: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/activity-logs", params),
  listProducts: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/products", params),
  listProductsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/products", params),
  listCategories: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/categories", params),
  createCategory: (payload: Record<string, unknown>) => postAction("/api/v1/admin/categories", payload),
  deleteCategory: (id: string) => deleteAction(`/api/v1/admin/categories/${id}`),
  listOutOfStockProducts: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/stock/out-of-stock", params),
  listRestaurants: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/restaurants", params),
  listRestaurantsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/restaurants", params),
  listBestSellerRestaurants: (params?: ListParams) =>
    getList<Record<string, unknown>>("/api/v1/admin/best-sellers/restaurants", params),
  listBestSellerRestaurantsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/best-sellers/restaurants", params),
  getAnalyticsOverview: () => getOne<Record<string, unknown>>("/api/v1/admin/analytics/overview"),
  getRevenueTrend: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/analytics/revenue-trend", params),
  listReviews: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/reviews", params),
  listReviewsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/reviews", params),
  deleteReview: (id: string, reason: string) =>
    deleteAction(`/api/v1/admin/reviews/${id}`, { reason }),
  listReports: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/reports", params),
  listReportsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/reports", params),
  resolveReport: (id: string, note: string) => postAction(`/api/v1/admin/reports/${id}/resolve`, { note }),
  rejectReport: (id: string, note: string) => postAction(`/api/v1/admin/reports/${id}/reject`, { note }),
  listBlogPosts: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/blog-posts", params),
  listBlogPostsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/blog-posts", params),
  createBlogPost: (payload: Record<string, unknown>) => postAction("/api/v1/admin/blog-posts", payload),
  updateBlogPost: (id: string, payload: Record<string, unknown>) =>
    patchAction(`/api/v1/admin/blog-posts/${id}`, payload),
  deleteBlogPost: (id: string) => deleteAction(`/api/v1/admin/blog-posts/${id}`),
  listFaqs: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/faqs", params),
  listBanners: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/banners", params),
  listBannersPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/banners", params),
  activateBanner: (id: string) => postAction(`/api/v1/admin/banners/${id}/activate`),
  deactivateBanner: (id: string) => postAction(`/api/v1/admin/banners/${id}/deactivate`),
  deleteBanner: (id: string) => deleteAction(`/api/v1/admin/banners/${id}`),
  listCoupons: (params?: ListParams) => getList<Record<string, unknown>>("/api/v1/admin/coupons", params),
  listCouponsPaged: (params?: ListParams) =>
    getListWithMeta<Record<string, unknown>>("/api/v1/admin/coupons", params),
  activateCoupon: (id: string) => postAction(`/api/v1/admin/coupons/${id}/activate`),
  deactivateCoupon: (id: string) => postAction(`/api/v1/admin/coupons/${id}/deactivate`),
  deleteCoupon: (id: string) => deleteAction(`/api/v1/admin/coupons/${id}`),
  getAdminProfile: () => getOne<Record<string, unknown>>("/api/v1/admin/profile"),
  updateAdminProfile: (payload: Record<string, unknown>) => patchAction("/api/v1/admin/profile", payload),
};
