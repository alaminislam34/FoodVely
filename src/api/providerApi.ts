import api from "@/api/httpClient";

type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ProviderListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  stock?: "all" | "in-stock" | "out-of-stock";
  rating?: "all" | "4.0+" | "4.5+";
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating" | "name";
};

export type ProviderProductPayload = {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  prepTime: number;
  isVeg: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  thumbnail?: string;
};

export type ProviderProductUpdatePayload = Partial<
  Omit<ProviderProductPayload, "thumbnail"> & {
    thumbnail?: string;
    stock?: number;
  }
>;

export type ProviderProduct = {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  category?: {
    name?: string;
    title?: string;
    slug?: string;
  };
  provider?: {
    name?: string;
  };
  rating?: {
    average?: number;
    totalReviews?: number;
  };
  availability?: {
    stock?: number;
    status?: string;
    isAvailable?: boolean;
  };
  foodInfo?: {
    calories?: number;
  };
};

export type ProviderOrder = {
  orderId?: string;
  orderNumber?: string;
  user?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  items?: Array<{
    foodId?: string;
    name?: string;
    thumbnail?: string;
    quantity?: number;
    totalPrice?: number;
  }>;
  pricing?: {
    totalAmount?: number;
    currency?: string;
  };
  payment?: {
    method?: string;
    status?: string;
  };
  delivery?: {
    address?: string;
    city?: string;
    estimatedTime?: string;
  };
  orderStatus?: string;
  timestamps?: {
    orderedAt?: string;
  };
};

export type ProviderOrderListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
};

export type ProviderReview = {
  id?: string;
  rating?: {
    value?: number;
    outOf?: number;
  };
  comment?: string;
  customer?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  product?: {
    id?: string;
    name?: string;
    category?: string;
  };
  createdAt?: string;
  reply?: string;
};

export type ProviderReviewListParams = {
  page?: number;
  limit?: number;
  search?: string;
  rating?: string;
};

export type ProviderCoupon = {
  id?: string | number;
  code?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minSpend?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  status?: "active" | "expired" | "scheduled";
  active?: boolean;
  validFrom?: string;
  validUntil?: string;
  type?: "percentage" | "fixed";
  value?: number;
  maxUses?: number;
  usedCount?: number;
  minOrder?: number;
};

export type ProviderCouponListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type ProviderCouponPayload = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend: number;
  usageLimit: number;
  expiryDate: string;
};

export type ProviderListResult<T> = {
  items: T[];
  meta?: ApiMeta;
};

const normalizeItems = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const objectValue = raw as { items?: unknown[]; data?: unknown[] };
    if (Array.isArray(objectValue.items)) return objectValue.items as T[];
    if (Array.isArray(objectValue.data)) return objectValue.data as T[];
  }
  return [];
};

const sanitizeParams = (params?: ProviderListParams) => {
  if (!params) return undefined;

  const query: Record<string, string | number | undefined> = {
    page: params.page,
    limit: params.limit,
    search: params.search,
    sortBy: params.sortBy,
  };

  if (params.category && params.category !== "All") {
    query.category = params.category;
  }

  if (params.stock && params.stock !== "all") {
    query.stock = params.stock;
  }

  if (params.rating && params.rating !== "all") {
    query.rating = params.rating;
  }

  return query;
};

export const providerApi = {
  listProducts: async (
    params?: ProviderListParams,
  ): Promise<ProviderListResult<ProviderProduct>> => {
    const { data } = await api.get<ApiResponse<unknown>>(
      "/api/v1/provider/products",
      {
        params: sanitizeParams(params),
      },
    );

    return {
      items: normalizeItems<ProviderProduct>(data.data),
      meta: data.meta,
    };
  },

  createProduct: async (
    payload: ProviderProductPayload,
  ): Promise<ProviderProduct> => {
    const { data } = await api.post<ApiResponse<ProviderProduct>>(
      "/api/v1/provider/products",
      payload,
    );
    return data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/provider/products/${id}`);
  },

  updateProduct: async (
    id: string,
    payload: ProviderProductUpdatePayload,
  ): Promise<ProviderProduct> => {
    const { data } = await api.patch<ApiResponse<ProviderProduct>>(
      `/api/v1/provider/products/${id}`,
      payload,
    );
    return data.data;
  },

  updateProductStock: async (
    id: string,
    payload: { isAvailable?: boolean; stock?: number; reason?: string },
  ): Promise<ProviderProduct> => {
    const { data } = await api.patch<ApiResponse<ProviderProduct>>(
      `/api/v1/provider/products/${id}/stock`,
      payload,
    );
    return data.data;
  },

  listOrders: async (
    params?: ProviderOrderListParams,
  ): Promise<ProviderListResult<ProviderOrder>> => {
    const { data } = await api.get<ApiResponse<unknown>>(
      "/api/v1/provider/orders",
      {
        params,
      },
    );

    return {
      items: normalizeItems<ProviderOrder>(data.data),
      meta: data.meta,
    };
  },

  updateOrderStatus: async (
    orderId: string,
    payload: { status: string; note?: string },
  ): Promise<ProviderOrder> => {
    const { data } = await api.patch<ApiResponse<ProviderOrder>>(
      `/api/v1/provider/orders/${orderId}/status`,
      payload,
    );
    return data.data;
  },

  listReviews: async (
    params?: ProviderReviewListParams,
  ): Promise<ProviderListResult<ProviderReview>> => {
    const { data } = await api.get<ApiResponse<unknown>>(
      "/api/v1/provider/reviews",
      {
        params,
      },
    );

    return {
      items: normalizeItems<ProviderReview>(data.data),
      meta: data.meta,
    };
  },

  replyToReview: async (
    reviewId: string,
    payload: { message: string },
  ): Promise<ProviderReview> => {
    const { data } = await api.post<ApiResponse<ProviderReview>>(
      `/api/v1/provider/reviews/${reviewId}/reply`,
      payload,
    );
    return data.data;
  },

  listCoupons: async (
    params?: ProviderCouponListParams,
  ): Promise<ProviderListResult<ProviderCoupon>> => {
    const { data } = await api.get<ApiResponse<unknown>>(
      "/api/v1/provider/coupons",
      {
        params,
      },
    );

    return {
      items: normalizeItems<ProviderCoupon>(data.data),
      meta: data.meta,
    };
  },

  createCoupon: async (
    payload: ProviderCouponPayload,
  ): Promise<ProviderCoupon> => {
    const { data } = await api.post<ApiResponse<ProviderCoupon>>(
      "/api/v1/provider/coupons",
      payload,
    );
    return data.data;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/provider/coupons/${id}`);
  },

  activateCoupon: async (id: string): Promise<ProviderCoupon> => {
    const { data } = await api.post<ApiResponse<ProviderCoupon>>(
      `/api/v1/provider/coupons/${id}/activate`,
      {},
    );
    return data.data;
  },

  deactivateCoupon: async (id: string): Promise<ProviderCoupon> => {
    const { data } = await api.post<ApiResponse<ProviderCoupon>>(
      `/api/v1/provider/coupons/${id}/deactivate`,
      {},
    );
    return data.data;
  },
};
