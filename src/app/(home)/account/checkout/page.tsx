"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgePercent, Check, CreditCard, MapPin, ShoppingBag, X } from "lucide-react";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { useAuthContext } from "@/context/AuthContext";
import { clearCart } from "@/utils/commerceStorage";
import { useCommerceState } from "@/hooks/useCommerceState";
import { orderApi } from "@/api/orderApi";
import { getApiErrorMessage } from "@/utils/apiError";

type Coupon = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number;
  usedCount: number;
  minOrder: number;
  active: boolean;
  description: string;
};

type CheckoutLine = {
  product: Product;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const { cartItems } = useCommerceState();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/account/signin?next=${encodeURIComponent("/account/checkout")}`);
    }
  }, [isAuthenticated, isLoading, router]);

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

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await fetch("/data/coupons.json");
        const data = await response.json();
        const list = (Array.isArray(data) ? data : data.coupons || []) as Coupon[];
        setCoupons(list);
      } catch {
        setCoupons([]);
      }
    };

    loadCoupons();
  }, []);

  useEffect(() => {
    if (user?.name) {
      setFullName((prev) => prev || user.name);
    }
  }, [user?.name]);

  const lines = useMemo<CheckoutLine[]>(() => {
    return cartItems
      .map((item) => {
        const product = products.find((entry) => String(entry.id) === item.id);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter((value): value is CheckoutLine => value !== null);
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return lines.reduce((sum, line) => {
      const unitPrice = line.product.discountPrice ?? line.product.price;
      return sum + unitPrice * line.quantity;
    }, 0);
  }, [lines]);

  const deliveryCharge = lines.length > 0 ? 40 : 0;
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === "percentage") {
      return Math.min((subtotal * appliedCoupon.value) / 100, subtotal);
    }

    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  const total = Math.max(subtotal - discount + deliveryCharge, 0);

  useEffect(() => {
    if (!appliedCoupon) return;

    const currentCoupon = coupons.find((item) => item.code === appliedCoupon.code);
    if (!currentCoupon) {
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < currentCoupon.minOrder) {
      setAppliedCoupon(null);
      toast.error(`Coupon ${currentCoupon.code} needs a minimum order of BDT ${currentCoupon.minOrder}`);
      return;
    }
  }, [appliedCoupon, coupons, subtotal]);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }

    const coupon = coupons.find((item) => item.code.toUpperCase() === code);

    if (!coupon) {
      toast.error("Coupon not found");
      return;
    }

    if (!coupon.active) {
      toast.error("This coupon is inactive");
      return;
    }

    if (coupon.usedCount >= coupon.maxUses) {
      toast.error("This coupon has reached its usage limit");
      return;
    }

    if (subtotal < coupon.minOrder) {
      toast.error(`Minimum order for ${coupon.code} is BDT ${coupon.minOrder}`);
      return;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon ${coupon.code} applied`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const placeOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in your delivery details");
      return;
    }

    if (lines.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacingOrder(true);

    try {
      const order = await orderApi.createOrder({
        items: lines.map((line) => ({
          productId: String(line.product.id),
          quantity: line.quantity,
        })),
        delivery: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        pricing: {
          subtotal,
          discount,
          deliveryCharge,
          total,
          currency: lines[0]?.product.currency || "BDT",
        },
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              type: appliedCoupon.type,
              value: appliedCoupon.value,
            }
          : undefined,
      });

      const orderId =
        String(order.orderNumber || order.orderId || order.id || "").trim() ||
        "FV-PENDING";

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/account/order_track?order=${encodeURIComponent(orderId)}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to place order. Please try again."));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoading || !isAuthenticated || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh]">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
          <p className="text-gray-600 font-medium mb-4">Your cart is empty. Add items before checkout.</p>
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

  return (
    <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh]">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="text-rose-500" />
        <h1 className="text-3xl font-Sofia font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Details</h2>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 min-h-28 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="House, road, area, city"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Your Items</h3>
          <div className="space-y-3">
            {lines.map((line) => {
              const unitPrice = line.product.discountPrice ?? line.product.price;
              return (
                <div
                  key={line.product.id}
                  className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={line.product.images[0] || "/images/food.png"}
                      alt={line.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{line.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {line.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-rose-600">
                    {(line.product.currency || "BDT") + " " + (unitPrice * line.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border border-dashed border-rose-200 rounded-3xl p-4 bg-rose-50/30">
            <div className="flex items-center gap-2 mb-3 text-rose-600 font-bold">
              <BadgePercent size={18} /> Coupon
            </div>

            {appliedCoupon ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-white rounded-2xl border border-rose-100 p-4">
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" /> {appliedCoupon.code}
                  </p>
                  <p className="text-sm text-gray-500">{appliedCoupon.description}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:border-rose-200 hover:text-rose-600"
                >
                  <X size={14} /> Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 uppercase"
                  placeholder="Enter coupon code"
                />
                <button
                  onClick={applyCoupon}
                  className="px-5 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold inline-flex items-center justify-center gap-2"
                >
                  <BadgePercent size={16} /> Apply
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 h-fit">
          <h2 className="font-bold text-gray-900 mb-4">Payment Summary</h2>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600">
              <span className="inline-flex items-center gap-1"><CreditCard size={14} /> Subtotal</span>
              <span>BDT {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="inline-flex items-center gap-1"><BadgePercent size={14} /> Discount</span>
              <span>- BDT {discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="inline-flex items-center gap-1"><MapPin size={14} /> Delivery</span>
              <span>BDT {deliveryCharge.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>BDT {total.toFixed(2)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="w-full mt-5 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold disabled:opacity-70"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </section>
  );
}
