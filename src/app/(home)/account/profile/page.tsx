"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

// Hooks
import { useAuth } from "@/module/hooks/useAuth";

// New reusable components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActiveOrderCard from "@/components/profile/ActiveOrderCard";
import FavoritesGrid from "@/components/profile/FavoritesGrid";
import OrderHistory from "@/components/profile/OrderHistory";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import EmptyState from "@/components/profile/EmptyState";
import CustomerProfileSkeleton from "./components/Skeleton";

// Types
import { Product } from "@/types/product";

interface OrderRecord {
  id: number | string;
  orderNumber?: string;
  status?: string;
  total?: number;
  estimatedDeliveryTime?: string;
  items?: { foodName?: string; quantity?: number }[];
  createdAt?: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ username?: string }>();

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [fetchingData, setFetchingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/account/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, isAuthenticated, pathname, router]);

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
      } catch (e) {
        setDataError("Could not load latest account data.");
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

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
      (o) => !["delivered", "cancelled"].includes((o.status || "").toLowerCase()),
    );
    if (!live) return null;
    return {
      id: String(live.orderNumber || live.id),
      label: live.items?.[0]?.foodName || "Your current order",
      eta: live.estimatedDeliveryTime || "15-20 mins",
      percent: 40,
    };
  }, [orders]);

  const orderSummary = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 6)
      .map((o) => ({ id: String(o.orderNumber || o.id), date: o.createdAt, total: o.total || 0, items: o.items?.length || 0, status: o.status || "Delivered" }));
  }, [orders]);

  if (authLoading || fetchingData) return <CustomerProfileSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12">
          <ProfileHeader
            name={profileDisplayName}
            email={user?.email}
            location={"Dhaka, Bangladesh"}
            avatarSrc={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`}
            stats={[{ label: "Orders", value: orders.length }, { label: "Favorites", value: 0 }, { label: "Spent", value: `BDT ${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)}` }]}
            onEdit={() => router.push('/account/settings')}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <main className="lg:col-span-8 space-y-6">
            {activeOrder ? (
              <ActiveOrderCard id={activeOrder.id} label={activeOrder.label} eta={activeOrder.eta} percent={activeOrder.percent} />
            ) : (
              <EmptyState title="No active deliveries" description="You don’t have an order on the way right now." cta={{ label: 'Browse menu', onClick: () => router.push('/menu') }} />
            )}

            <section aria-labelledby="favorites-heading">
              <div className="flex items-center justify-between mb-3">
                <h2 id="favorites-heading" className="text-lg font-semibold text-slate-800">Favorites</h2>
                <Link href="/menu" className="text-sm text-rose-600">Manage</Link>
              </div>
              <FavoritesGrid items={[]} />
            </section>

            <section aria-labelledby="history-heading">
              <div className="flex items-center justify-between mb-3">
                <h2 id="history-heading" className="text-lg font-semibold text-slate-800">Order History</h2>
                <Link href="/account/orders" className="text-sm text-slate-500">See all</Link>
              </div>
              <OrderHistory orders={orderSummary} />
            </section>
          </main>

          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <ProfileSidebar cartItems={products.slice(0, 3).map(p => ({ id: p.id, name: p.name, qty: 1, price: p.price }))} payment={{ brand: 'Visa', last4: '4421' }} actions={[{ id: 'addresses', label: 'Addresses', onClick: () => router.push('/account/addresses') }, { id: 'settings', label: 'Settings', onClick: () => router.push('/account/settings') }]} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
