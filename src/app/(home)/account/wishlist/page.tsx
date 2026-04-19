"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { Provider } from "@/types/provider";
import toast from "react-hot-toast";
import {
  addToCart,
  removeFromWishlist,
} from "@/utils/commerceStorage";
import { useCommerceState } from "@/hooks/useCommerceState";

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
  const { wishlistItems: wishlist } = useCommerceState();
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

        const productArray = (Array.isArray(productJson)
          ? productJson
          : productJson.products || []) as Product[];

        const restaurantArray = (Array.isArray(restaurantJson)
          ? restaurantJson
          : restaurantJson.restaurants || []) as Array<Partial<Provider> & Record<string, unknown>>;

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

  const items = useMemo(() => {
    return wishlist
      .map((entry) => {
        if (entry.type === "product") {
          const product = products.find((item) => item.id === entry.id);
          if (!product) return null;
          return {
            key: `${entry.type}:${entry.id}`,
            type: entry.type,
            title: product.name,
            subtitle: `Price: ${(product.currency || "BDT") + " " + (product.discountPrice ?? product.price)}`,
            image: product.image,
            href: `/menu/${product.slug}`,
            id: entry.id,
          };
        }

        const restaurant = restaurants.find((item) => item.id === entry.id);
        if (!restaurant) return null;
        return {
          key: `${entry.type}:${entry.id}`,
          type: entry.type,
          title: restaurant.name,
          subtitle: restaurant.city ? `City: ${restaurant.city}` : "Restaurant",
          image: restaurant.image,
          href: `/restaurant/${restaurant.slug}`,
          id: entry.id,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [products, restaurants, wishlist]);

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
        <h1 className="text-3xl font-Sofia font-bold text-gray-900">My Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <p className="text-gray-600 font-medium mb-4">Your wishlist is empty.</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold"
          >
            Discover food
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="bg-white rounded-3xl border border-gray-100 p-4 flex gap-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <Link href={item.href} className="font-bold text-gray-900 hover:text-rose-600 transition-colors">
                  {item.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase">{item.type}</p>
              </div>

              <div className="flex flex-col items-end justify-between gap-3">
                <button
                  onClick={() => {
                    removeFromWishlist(item.id, item.type);
                    toast.success("Removed from wishlist");
                  }}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
                {item.type === "product" ? (
                  <button
                    onClick={() => {
                      addToCart(item.id, 1);
                      toast.success("Added to cart");
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100"
                  >
                    <ShoppingCart size={14} /> Add
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
