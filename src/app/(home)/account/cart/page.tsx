"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import toast from "react-hot-toast";
import {
  clearCart,
  removeFromCart,
  setCartItemQuantity,
} from "@/utils/commerceStorage";
import { useCommerceState } from "@/hooks/useCommerceState";
import { useAuthContext } from "@/context/AuthContext";

type CartLine = {
  product: Product;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { cartItems } = useCommerceState();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProceedCheckout = () => {
    if (isAuthenticated) {
      router.push("/account/checkout");
      return;
    }

    router.push(`/account/signin?next=${encodeURIComponent("/account/checkout")}`);
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/FoodProducts.json");
        const data = await response.json();
        const list = (Array.isArray(data) ? data : data.products || []) as Product[];
        setProducts(list);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const lines = useMemo<CartLine[]>(() => {
    return cartItems
      .map((item) => {
        const product = products.find((entry) => String(entry.id) === item.id);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter((value): value is CartLine => value !== null);
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const unitPrice = line.product.discountPrice ?? line.product.price;
      return sum + unitPrice * line.quantity;
    }, 0);
  }, [lines]);

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
        {lines.length > 0 ? (
          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            className="text-sm font-semibold text-rose-600 hover:underline"
          >
            Clear cart
          </button>
        ) : null}
      </div>

      {lines.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <p className="text-gray-600 font-medium mb-4">Your cart is empty.</p>
          <Link
            href="/menu"
            className="inline-block px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {lines.map((line) => {
              const unitPrice = line.product.discountPrice ?? line.product.price;
              return (
                <div
                  key={line.product.id}
                  className="bg-white rounded-3xl border border-gray-100 p-4 flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={line.product.images[0] || "/images/food.png"}
                      alt={line.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{line.product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {line.product.shortDescription || line.product.description}
                    </p>
                    <p className="text-sm font-semibold text-rose-600 mt-1">
                      {(line.product.currency || "BDT") + " " + unitPrice}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => {
                        removeFromCart(String(line.product.id));
                        toast.success("Removed from cart");
                      }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                      <button
                        onClick={() => {
                          setCartItemQuantity(String(line.product.id), line.quantity - 1);
                          if (line.quantity <= 1) {
                            toast.success("Removed from cart");
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold">{line.quantity}</span>
                      <button
                        onClick={() =>
                          setCartItemQuantity(String(line.product.id), line.quantity + 1)
                        }
                        className="p-1 rounded-lg hover:bg-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 h-fit">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>BDT {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>BDT 0.00</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>BDT {subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedCheckout}
              className="w-full mt-5 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
