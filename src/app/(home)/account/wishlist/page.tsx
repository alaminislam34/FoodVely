"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { Provider } from "@/types/provider";
import toast from "react-hot-toast";

type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  discountPrice?: number;
  currency?: string;
};

type WishlistRestaurant = {
  id: string;
  name: string;
  slug: string;
  image: string;
  city: string;
};

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [restaurants, setRestaurants] = useState<WishlistRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, restaurantRes] = await Promise.all([
          fetch("/FoodProducts.json"),
          fetch("/Restaurants.json"),
        ]);

        const productJson = await productRes.json();
        const restaurantJson = await restaurantRes.json();

        const productArray = (
          Array.isArray(productJson) ? productJson : productJson.products || []
        ) as Product[];

        const restaurantArray = (
          Array.isArray(restaurantJson)
            ? restaurantJson
            : restaurantJson.restaurants || []
        ) as Array<Partial<Provider> & Record<string, unknown>>;

        setProducts(
          productArray.map((product) => ({
            id: String(product.id),
            name: product.name,
            slug: product.slug,
            image: product.images?.[0] || "/images/food.png",
            price: product.price,
            discountPrice: product.discountPrice,
            currency: product.currency,
          })),
        );

        setRestaurants(
          restaurantArray.map((item) => ({
            id: String(item.id ?? ""),
            name: String(item.name ?? "Restaurant"),
            slug: String(item.slug ?? ""),
            image: String(
              (item.images as { cover?: string } | undefined)?.cover ||
                item.image ||
                "/images/food.png",
            ),
            city: String(
              (item.location as { city?: string } | undefined)?.city || "",
            ),
          })),
        );
      } catch {
        setProducts([]);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh]">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="text-rose-500" />
        <h1 className="text-3xl font-Sofia font-bold text-gray-900">
          My Wishlist
        </h1>
      </div>
      <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
        <p className="text-gray-600 font-medium mb-4">
          Your wishlist is empty.
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold"
        >
          Discover food
        </Link>
      </div>
    </section>
  );
}
