export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;

  price: number;
  discountPrice?: number;

  images: string[];
  categoryId: string;
  providerId: string;

  status: ProductStatus;

  createdAt: Date;
  updatedAt: Date;
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
