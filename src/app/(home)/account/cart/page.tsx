"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useAuth } from "@/module/hooks/useAuth";

type CartLine = {
  product: Product;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProceedCheckout = () => {
    if (isAuthenticated) {
      router.push("/account/checkout");
      return;
    }

    router.push(
      `/account/signin?next=${encodeURIComponent("/account/checkout")}`,
    );
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/FoodProducts.json");
        const data = await response.json();
        const list = (
          Array.isArray(data) ? data : data.products || []
        ) as Product[];
        setProducts(list);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-Sofia font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="text-rose-500" />
          My Cart
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
        <p className="text-gray-600 font-medium mb-4">Your cart is empty.</p>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold"
        >
          Browse menu
        </Link>
      </div>
    </section>
  );
}
