import { Product } from "@/types/product";

const normalizeProducts = (items: Record<string, unknown>[]): Product[] => {
  return items.map((item) => {
    const category =
      (item.category as Record<string, unknown> | undefined) ?? {};
    const provider =
      (item.provider as Record<string, unknown> | undefined) ?? {};
    const providerRating =
      (provider.rating as Record<string, unknown> | undefined) ?? {};
    const rating = (item.rating as Record<string, unknown> | undefined) ?? {};
    const availability =
      (item.availability as Record<string, unknown> | undefined) ?? {};
    const foodInfo =
      (item.foodInfo as Record<string, unknown> | undefined) ?? {};

    return {
      id: String(item.id ?? ""),
      name: String(item.name ?? "Unnamed Product"),
      slug: String(item.slug ?? ""),
      description: String(item.description ?? ""),
      shortDescription: String(item.shortDescription ?? ""),
      price: Number(item.price ?? 0),
      thumbnail: String(item.thumbnail ?? "/images/food.png"),
      images: Array.isArray(item.images) ? (item.images as string[]) : [],
      category: {
        id: String(category.id ?? ""),
        name: String(category.name ?? category.title ?? "Uncategorized"),
        title: String(category.title ?? category.name ?? "Uncategorized"),
        slug: String(category.slug ?? "uncategorized"),
      },
      provider: {
        id: String(provider.id ?? ""),
        name: String(provider.name ?? "FoodValy"),
        slug: String(provider.slug ?? "foodvaly"),
        logo: String(provider.logo ?? "/images/provider.png"),
        rating: Number(providerRating.average ?? 0),
      },
      rating: {
        average: Number(rating.average ?? 0),
        totalReviews: Number(rating.totalReviews ?? 0),
      },
      availability: {
        stock: Number(availability.stock ?? 0),
        status: String(availability.status ?? "active"),
        isAvailable: Boolean(availability.isAvailable ?? true),
      },
      foodInfo: {
        calories: Number(foodInfo.calories ?? 0),
        isVeg: Boolean(foodInfo.isVeg ?? false),
        isSpicy: Boolean(foodInfo.isSpicy ?? false),
        preparationTime: Number(foodInfo.preparationTime ?? 0),
      },
      createdAt: String(item.createdAt ?? new Date().toISOString()),
      updatedAt: String(item.updatedAt ?? new Date().toISOString()),
    };
  });
};

export default normalizeProducts;
