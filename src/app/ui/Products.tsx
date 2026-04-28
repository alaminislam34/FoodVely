"use client";

import { Product } from "@/types/product";
import { addToCart } from "@/utils/commerceStorage";
import CommonProductCard from "@/components/CommonProductCard";

export const ProductCard = ({
  product,
  basePath = "/menu",
}: {
  product: Product;
  basePath?: string;
}) => {
  if (!product || !product.images || product.images.length === 0) {
    return null;
  }
  return (
    <CommonProductCard
      product={product}
      basePath={basePath}
      isPreview={false}
      onAdd={() => {
        addToCart(String(product.id), 1);
      }}
    />
  );
};

export default ProductCard;
