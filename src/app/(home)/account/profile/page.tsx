"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Edit3,
  Heart,
  MapPin,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import Link from "next/link";
import CustomerProfileSkeleton from "./components/Skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { useCommerceContext } from "@/context/CommerceContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { motion } from "motion/react";

interface OrderTimelineEntry {
  status: string;
  timestamp: string;
}

interface OrderItem {
  foodName?: string;
  quantity?: number;
  total?: number;
}

interface OrderRecord {
  id: number | string;
  orderNumber?: string;
  status?: string;
  total?: number;
  estimatedDeliveryTime?: string;
  timeline?: OrderTimelineEntry[];
  items?: OrderItem[];
  createdAt?: string;
}

// --- TYPES ---

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

interface FavoriteItemProps {
  image: string;
  name: string;
  rating: number;
  href: string;
}

// --- COMPONENTS ---

const SectionHeader = ({ title, icon }: SectionHeaderProps) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">{icon}</div>
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
  </div>
);

export default function CustomerProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ username?: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { cartItems, wishlistItems } = useCommerceContext();

  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/account/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, isAuthenticated, pathname, router]);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setDataError(null);

      try {
        const [productResponse, orderResponse] = await Promise.all([
          fetch("/FoodProducts.json"),
          fetch("/data/orders.json"),
        ]);

        const productJson = await productResponse.json();
        const orderJson = await orderResponse.json();

        const productList = (
          Array.isArray(productJson) ? productJson : productJson.products || []
        ) as Product[];

        const orderList = (
          Array.isArray(orderJson) ? orderJson : orderJson.orders || []
        ) as OrderRecord[];

        setProducts(productList);
        setOrders(orderList);
      } catch {
        setDataError("Could not load latest account data.");
        setProducts([]);
        setOrders([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 350);
      }
    };

    loadProfileData();
  }, []);

  const username = useMemo(() => {
    return (params?.username || user?.name || "customer").toString();
  }, [params?.username, user?.name]);

  const profileDisplayName = useMemo(() => {
    if (user?.name) return user.name;
    return username
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [user?.name, username]);

  const cartSummary = useMemo(() => {
    const lines = cartItems
      .map((item) => {
        const product = products.find((entry) => String(entry.id) === item.id);
        if (!product) return null;
        const unitPrice = product.discountPrice ?? product.price;
        return {
          id: item.id,
          name: product.name,
          quantity: item.quantity,
          price: unitPrice,
          total: unitPrice * item.quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const subtotal = lines.reduce((sum, item) => sum + item.total, 0);
    return {
      lines,
      subtotal,
      itemCount: lines.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [cartItems, products]);

  const favoriteProducts = useMemo(() => {
    const wishlistProductIds = wishlistItems
      .filter((item) => item.type === "product")
      .map((item) => item.id);

    return products
      .filter((product) => wishlistProductIds.includes(String(product.id)))
      .slice(0, 4)
      .map((product) => ({
        id: String(product.id),
        image: product.thumbnail || product.images?.[0] || "/images/food.png",
        name: product.name,
        rating: product.rating?.average ?? 4.5,
        href: `/menu/${product.slug}`,
      }));
  }, [products, wishlistItems]);

  const activeOrder = useMemo(() => {
    const liveOrder = orders.find((order) => {
      const status = (order.status || "").toLowerCase();
      return status && status !== "delivered" && status !== "cancelled";
    });

    if (!liveOrder) return null;

    const itemCount = liveOrder.items?.reduce(
      (sum, item) => sum + (item.quantity ?? 0),
      0,
    );

    return {
      id: String(liveOrder.orderNumber || liveOrder.id),
      label: liveOrder.items?.[0]?.foodName || "Your current order",
      eta: liveOrder.estimatedDeliveryTime || "15-20 mins",
      items:
        itemCount && itemCount > 0 ? itemCount : liveOrder.items?.length || 1,
    };
  }, [orders]);

  const orderHistory = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 4)
      .map((order) => ({
        id: String(order.orderNumber || order.id),
        itemCount:
          order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ||
          order.items?.length ||
          1,
        total: order.total || 0,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "Recent",
      }));
  }, [orders]);

  if (authLoading || loading) {
    return <CustomerProfileSkeleton />;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_35%),linear-gradient(to_bottom,#fffaf5_0%,#ffffff_65%)] pb-16">
      <div className="relative w-full border-b border-orange-50 bg-white/60 backdrop-blur">
        <div className="max-w-360 mx-auto w-11/12 h-full flex items-end pb-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col md:flex-row items-center gap-6 z-10 translate-y-16"
          >
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`}
                className="w-40 h-40 rounded-[3rem] border-8 border-white bg-white shadow-xl"
                alt="User Profile"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                <Edit3 size={18} />
              </button>
            </div>
            <div className="text-center md:text-left md:pb-4">
              <h1 className="text-4xl font-black text-slate-800">
                {profileDisplayName}
              </h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} className="text-rose-500" /> Dhaka, Bangladesh
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {user?.email || "customer@foodvaly.com"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-360 mx-auto w-11/12 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="backdrop-blur-md bg-white/70 border border-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/50">
            <SectionHeader title="Active Order" icon={<Package size={22} />} />
            {activeOrder ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                    🥡
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{activeOrder.label}</h4>
                    <p className="text-rose-500 font-semibold">
                      On the way • {activeOrder.eta}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/account/order_track?order=${encodeURIComponent(activeOrder.id)}`}
                  className="px-6 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg hover:bg-rose-600 transition-all flex items-center gap-2"
                >
                  Track Delivery <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-6 text-center text-slate-500">
                No active order right now.
                <Link href="/menu" className="text-rose-600 font-semibold ml-2">
                  Order something tasty
                </Link>
              </div>
            )}
          </div>

          <div>
            <SectionHeader title="My Favorites" icon={<Heart size={22} />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoriteProducts.length > 0 ? (
                favoriteProducts.map((item) => (
                  <FavoriteItem
                    key={item.id}
                    image={item.image}
                    name={item.name}
                    rating={item.rating}
                    href={item.href}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-rose-200 bg-white p-6 text-sm text-slate-500">
                  No product in wishlist yet.
                  <Link
                    href="/account/wishlist"
                    className="text-rose-600 font-semibold ml-1"
                  >
                    Open wishlist
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <SectionHeader title="Order History" icon={<Clock size={22} />} />
            <div className="space-y-4">
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-5 bg-white border border-rose-50 rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl opacity-50">#{order.id}</div>
                      <div>
                        <p className="font-bold">
                          FoodValy • {order.itemCount} items
                        </p>
                        <p className="text-sm text-gray-400">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right font-black text-slate-700">
                      BDT {order.total.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-6 text-sm text-slate-500">
                  No order history found.
                </div>
              )}
            </div>
          </div>

          {dataError ? (
            <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-red-600 px-4 py-3 text-sm">
              <AlertCircle size={16} />
              {dataError}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-10 backdrop-blur-xl bg-linear-to-br from-white/90 to-rose-50/90 border border-white rounded-[2.5rem] p-6 shadow-2xl shadow-rose-200/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
                <ShoppingCart size={22} /> My Bag
              </h3>
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                {cartSummary.itemCount} Items
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {cartSummary.lines.length > 0 ? (
                cartSummary.lines
                  .slice(0, 3)
                  .map((line) => (
                    <CartItem
                      key={line.id}
                      name={line.name}
                      price={line.price}
                      qty={line.quantity}
                    />
                  ))
              ) : (
                <p className="text-sm text-slate-500">Your bag is empty.</p>
              )}
            </div>

            <div className="border-t border-rose-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>BDT {cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-800">
                <span>Total</span>
                <span>BDT {cartSummary.subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href={cartSummary.itemCount > 0 ? "/account/checkout" : "/menu"}
              className="block w-full mt-6 py-4 text-center bg-linear-to-r from-rose-500 to-orange-500 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider"
            >
              {cartSummary.itemCount > 0 ? "Go to Checkout" : "Browse Menu"}
            </Link>
          </div>

          <div className="bg-white border border-rose-50 rounded-4xl p-6">
            <h4 className="font-bold mb-4">Payment Method</h4>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <CreditCard size={20} className="text-slate-400" />
              <span className="text-sm font-medium">•••• •••• •••• 4421</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-rose-50 p-3">
                <p className="text-xs text-slate-500">Wishlist</p>
                <p className="text-lg font-black text-rose-600">
                  {wishlistItems.length}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs text-slate-500">Orders</p>
                <p className="text-lg font-black text-amber-600">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FavoriteItem({ image, name, rating, href }: FavoriteItemProps) {
  return (
    <Link
      href={href}
      className="bg-white p-4 rounded-3xl border border-rose-50 text-center hover:border-rose-200 transition-colors group cursor-pointer block"
    >
      <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden mb-2 bg-slate-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <p className="font-bold text-sm text-slate-700 leading-tight line-clamp-2">
        {name}
      </p>
      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-orange-500 font-bold">
        <Star size={10} fill="currentColor" /> {rating.toFixed(1)}
      </div>
    </Link>
  );
}

function CartItem({
  name,
  price,
  qty,
}: {
  name: string;
  price: number;
  qty: number;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-bold text-slate-700">{name}</p>
        <p className="text-xs text-rose-400 font-bold">
          {qty}x • BDT {price}
        </p>
      </div>
      <span className="text-sm font-bold text-slate-700">
        BDT {(qty * price).toFixed(2)}
      </span>
    </div>
  );
}
