export type ProductStatus = "active" | "inactive";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  rating: number;
}

export interface Rating {
  average: number;
  totalReviews: number;
}

export interface FoodInfo {
  isVeg: boolean;
  isSpicy: boolean;
  calories: number;
  preparationTime: number; // in minutes
}

export interface Availability {
  status: ProductStatus;
  isAvailable: boolean;
  stock: number;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  price: number;
  discountPrice?: number;
  currency?: string;

  images: string[];
  thumbnail?: string;

  category: Category;
  provider: Provider;

  rating?: Rating;
  foodInfo?: FoodInfo;
  availability?: Availability;

  tags?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;

  seo?: SEO;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type ProductImage = {
  url: string;
  alt: string;
  isPrimary?: boolean;
};

export type ProductOffer = {
  label: string; // "10% OFF", "Buy 1 Get 1"
  type: "DISCOUNT" | "BUNDLE" | "FREEBIE";
};

export type ProductBadge =
  | "BEST_SELLER"
  | "HOT"
  | "NEW"
  | "POPULAR"
  | "LIMITED_TIME"
  | "CHEFS_CHOICE";

export interface ShowUpProduct {
  id: string;
  slug: string;
  name: string;
  description: string;

  price: number;
  discountPrice?: number;
  currency: "BDT" | "USD";

  images: ProductImage[];

  badge?: ProductBadge;
  offer?: ProductOffer;

  category: string;
  providerId: string;

  rating: number;
  totalReviews: number;

  isAvailable: boolean;
  tags?: string[];

  createdAt: string;
}
