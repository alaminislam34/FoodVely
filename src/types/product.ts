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
