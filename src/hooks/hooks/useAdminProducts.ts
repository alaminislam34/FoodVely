import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";

export interface AdminProductMapped {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  thumbnail: string;
  category: {
    name: string;
    slug: string;
  };
  provider: {
    name: string;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  availability: {
    stock: number;
    status: string;
    isAvailable: boolean;
  };
  foodInfo: {
    calories: number;
  };
}

export function useAdminProductsList(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  inStock?: boolean;
  minRating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: [
      "adminFoods",
      params.page,
      params.limit,
      params.search,
      params.category,
      params.inStock,
      params.minRating,
      params.sortBy,
      params.sortOrder,
    ],
    queryFn: async () => {
      const response = await adminApi.listProductsPaged({
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        category: params.category && params.category !== "All" ? params.category : undefined,
        inStock: typeof params.inStock === "boolean" ? String(params.inStock) : undefined,
        minRating: params.minRating,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });

      const mappedProducts: AdminProductMapped[] = (response.items ?? []).map((item: any) => ({
        id: String(item.id ?? ""),
        name: String(item.name ?? item.title ?? "Unnamed Product"),
        shortDescription: String(item.shortDescription ?? item.description ?? ""),
        price: Number(item.price ?? 0),
        thumbnail: String(item.thumbnail ?? item.image ?? ""),
        category: {
          name: String((item.category as { name?: string } | undefined)?.name ?? "Uncategorized"),
          slug: String((item.category as { slug?: string } | undefined)?.slug ?? "uncategorized"),
        },
        provider: {
          name: String((item.provider as { name?: string } | undefined)?.name ?? "Unknown Provider"),
        },
        rating: {
          average: Number((item.rating as { average?: number } | undefined)?.average ?? 0),
          totalReviews: Number((item.rating as { totalReviews?: number } | undefined)?.totalReviews ?? 0),
        },
        availability: {
          stock: Number((item.availability as { stock?: number } | undefined)?.stock ?? 0),
          status: String((item.availability as { status?: string } | undefined)?.status ?? "inactive"),
          isAvailable: Boolean((item.availability as { isAvailable?: boolean } | undefined)?.isAvailable ?? false),
        },
        foodInfo: {
          calories: Number((item.foodInfo as { calories?: number } | undefined)?.calories ?? 0),
        },
      }));

      return {
        products: mappedProducts,
        totalPages: Math.max(response.meta?.totalPages ?? 1, 1),
        totalItems: response.meta?.total ?? mappedProducts.length,
      };
    },
  });
}
