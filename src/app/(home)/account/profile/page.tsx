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
import { useParams, usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";

// Hooks
import { useAuth } from "@/hooks/hooks/useAuth";

// Components
import CustomerProfileSkeleton from "./components/Skeleton";

// Types
import { Product } from "@/types/product";

// --- INTERFACES ---
interface OrderRecord {
  id: number | string;
  orderNumber?: string;
  status?: string;
  total?: number;
  estimatedDeliveryTime?: string;
  items?: { foodName?: string; quantity?: number }[];
  createdAt?: string;
}

// --- SUB-COMPONENTS ---
const SectionHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">{icon}</div>
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
  </div>
);

const FavoriteItem = ({
  image,
  name,
  rating,
  href,
}: {
  image: string;
  name: string;
  rating: number;
  href: string;
}) => (
  <Link
    href={href}
    className="bg-white p-4 rounded-3xl border border-rose-50 text-center hover:border-rose-200 transition-colors group block"
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

const CartItemRow = ({
  name,
  price,
  qty,
}: {
  name: string;
  price: number;
  qty: number;
}) => (
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

// --- MAIN PAGE ---
export default function CustomerProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ username?: string }>();

  // Custom Hooks
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Local State
  const [fetchingData, setFetchingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // 1. Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/account/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, isAuthenticated, pathname, router]);

  // 2. Load External Data (Products & Orders)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch("/FoodProducts.json"),
          fetch("/data/orders.json"),
        ]);
        const pJson = await prodRes.json();
        const oJson = await orderRes.json();

        setProducts(Array.isArray(pJson) ? pJson : pJson.products || []);
        setOrders(Array.isArray(oJson) ? oJson : oJson.orders || []);
      } catch {
        setDataError("Could not load latest account data.");
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

  // 3. Optimized Computations
  const username = useMemo(
    () => String(params?.username || user?.name || "customer"),
    [params?.username, user?.name],
  );

  const profileDisplayName = useMemo(() => {
    if (user?.name && !params?.username) return user.name;
    return username
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [user?.name, username, params?.username]);

  const activeOrder = useMemo(() => {
    const live = orders.find(
      (o) =>
        !["delivered", "cancelled"].includes((o.status || "").toLowerCase()),
    );
    if (!live) return null;
    return {
      id: String(live.orderNumber || live.id),
      label: live.items?.[0]?.foodName || "Your current order",
      eta: live.estimatedDeliveryTime || "15-20 mins",
    };
  }, [orders]);

  const orderHistory = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 4)
      .map((o) => ({
        id: String(o.orderNumber || o.id),
        itemCount: o.items?.reduce((s, i) => s + (i.quantity ?? 0), 0) || 1,
        total: o.total || 0,
        date: o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "Recent",
      }));
  }, [orders]);

  // Loading States
  if (authLoading || fetchingData) return <CustomerProfileSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_35%),linear-gradient(to_bottom,#fffaf5_0%,#ffffff_65%)] pb-16">
      {/* Header / Banner */}
      <div className="relative w-full border-b border-orange-50 bg-white/60 backdrop-blur">
        <div className="max-w-360 mx-auto w-11/12 pb-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-6 translate-y-16"
          >
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`}
                className="w-40 h-40 rounded-[3rem] border-8 border-white shadow-xl bg-white"
                alt="Profile"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-full shadow-lg">
                <Edit3 size={18} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-800">
                {profileDisplayName}
              </h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} className="text-rose-500" /> Dhaka, Bangladesh
              </p>
              <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-360 mx-auto w-11/12 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Active Order Section */}
          <div className="bg-white/70 border border-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/50 backdrop-blur-md">
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
                  href={`/account/order_track?order=${activeOrder.id}`}
                  className="px-6 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg hover:bg-rose-600 transition-all flex items-center gap-2"
                >
                  Track Delivery <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-6 text-center text-slate-500">
                No active order.{" "}
                <Link href="/menu" className="text-rose-600 font-semibold ml-2">
                  Order something tasty
                </Link>
              </div>
            )}
          </div>

          {/* Favorites */}
          <div>
            <SectionHeader title="My Favorites" icon={<Heart size={22} />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">0</div>
          </div>

          {/* History */}
          <div>
            <SectionHeader title="Order History" icon={<Clock size={22} />} />
            <div className="space-y-4">
              {orderHistory.map((o) => (
                <Link
                  key={o.id}
                  href={`/account/orders/${o.id}`}
                  className="flex items-center justify-between p-5 bg-white border border-rose-50 rounded-2xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl opacity-50 font-bold">
                      #{o.id}
                    </span>
                    <div>
                      <p className="font-bold text-slate-700">
                        FoodValy • {o.itemCount} items
                      </p>
                      <p className="text-sm text-slate-400">{o.date}</p>
                    </div>
                  </div>
                  <div className="font-black text-slate-700">
                    BDT {o.total.toFixed(2)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {dataError && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {dataError}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-10 backdrop-blur-xl bg-linear-to-br from-white/90 to-rose-50/90 border border-white rounded-[2.5rem] p-6 shadow-2xl shadow-rose-200/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
                <ShoppingCart size={22} /> My Bag
              </h3>
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                0 Items
              </span>
            </div>
            <div className="space-y-4 mb-8">
              {products.slice(0, 3).map((p) => (
                <CartItemRow key={p.id} name={p.name} price={p.price} qty={1} />
              ))}
            </div>
            <div className="border-t border-rose-100 pt-4 space-y-2">
              <div className="flex justify-between text-lg font-black text-slate-800">
                <span>Total</span>
                <span>BDT 0.00</span>
              </div>
            </div>
            <Link
              href={"/menu"}
              className="block w-full mt-6 py-4 text-center bg-linear-to-r from-rose-500 to-orange-500 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-wider"
            >
              {"Browse Menu"}
            </Link>
          </div>

          <div className="bg-white border border-rose-50 rounded-4xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold">Payment Method</h4>
              <Link
                href="/account/payment-methods"
                className="text-xs font-semibold text-rose-600"
              >
                Manage
              </Link>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <CreditCard size={20} className="text-slate-400" />
              <span className="text-sm font-medium">•••• •••• •••• 4421</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-rose-50 p-3">
                <p className="text-xs text-slate-500">Wishlist</p>
                <p className="text-lg font-black text-rose-600">0</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs text-slate-500">Orders</p>
                <p className="text-lg font-black text-amber-600">
                  {orders.length}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/account/addresses"
                className="text-xs text-center rounded-lg bg-slate-50 py-2 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Addresses
              </Link>
              <Link
                href="/account/settings"
                className="text-xs text-center rounded-lg bg-slate-50 py-2 font-semibold text-slate-600 hover:bg-slate-100"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
