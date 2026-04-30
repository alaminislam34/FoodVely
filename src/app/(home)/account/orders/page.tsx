"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import AccountNav from "../components/AccountNav";
import AccountFallbackNotice from "../components/AccountFallbackNotice";
import { orderApi } from "@/api/orderApi";
import { useAuth } from "@/module/hooks/useAuth";

type OrderRow = {
  orderId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  itemCount: number;
  orderedAt: string;
};

const normalizeOrders = (items: Record<string, unknown>[]): OrderRow[] => {
  return items.map((item, index) => {
    const pricing = (item.pricing as Record<string, unknown> | undefined) ?? {};
    const timestamps =
      (item.timestamps as Record<string, unknown> | undefined) ?? {};
    const rows = Array.isArray(item.items)
      ? (item.items as Record<string, unknown>[])
      : [];
    const totalFromRoot = Number(item.total ?? item.totalAmount ?? 0);

    return {
      orderId: String(item.orderId ?? item.id ?? `order-${index + 1}`),
      orderNumber: String(item.orderNumber ?? item.orderId ?? "N/A"),
      status: String(item.orderStatus ?? item.status ?? "pending"),
      totalAmount: Number(pricing.totalAmount ?? totalFromRoot),
      currency: String(pricing.currency ?? "BDT"),
      itemCount: rows.length,
      orderedAt: String(
        timestamps.orderedAt ??
          item.orderedAt ??
          item.createdAt ??
          new Date().toISOString(),
      ),
    };
  });
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `/account/signin?next=${encodeURIComponent("/account/orders")}`,
      );
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const apiOrders = await orderApi.listMyOrders();
        if (apiOrders.length > 0) {
          setFallbackNotice("");
          setOrders(normalizeOrders(apiOrders));
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local mock data when API is unavailable.
      }

      try {
        const response = await fetch("/orders.json");
        const json = await response.json();
        const list = Array.isArray(json) ? json : json.orders || [];
        const localOrders = normalizeOrders(list as Record<string, unknown>[]);
        setOrders(localOrders);
        if (localOrders.length > 0) {
          setFallbackNotice(
            "Showing saved order history while live sync is unavailable.",
          );
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const lower = query.toLowerCase();
    if (!lower) return orders;

    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(lower) ||
        order.status.toLowerCase().includes(lower),
    );
  }, [orders, query]);

  if (isLoading || !isAuthenticated || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh] space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
        <p className="text-slate-500">View all your past and ongoing orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <AccountNav />
        </div>

        <div className="lg:col-span-9 bg-white border border-rose-100 rounded-3xl p-5 md:p-6 space-y-4">
          {fallbackNotice ? (
            <AccountFallbackNotice message={fallbackNotice} />
          ) : null}

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by order number or status"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/30 p-6 text-sm text-slate-600">
              No orders found for your search.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <Link
                  key={order.orderId}
                  href={`/account/orders/${encodeURIComponent(order.orderId)}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:border-rose-200 hover:bg-rose-50/20 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-800">
                      #{order.orderNumber}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(order.orderedAt).toLocaleDateString()} •{" "}
                      {order.itemCount} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      {order.totalAmount.toFixed(2)} {order.currency}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-rose-600 font-semibold">
                      {order.status}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
