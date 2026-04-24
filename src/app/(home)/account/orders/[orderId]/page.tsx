"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react";
import AccountNav from "../../components/AccountNav";
import AccountFallbackNotice from "../../components/AccountFallbackNotice";
import toast from "react-hot-toast";
import { orderApi } from "@/api/orderApi";
import { useAuth } from "@/hooks/hooks/useAuth";

type OrderItem = {
  name: string;
  quantity: number;
  totalPrice: number;
};

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  currency: string;
  orderedAt: string;
  estimatedTime: string;
  deliveryAddress: string;
  items: OrderItem[];
};

const normalizeOrder = (item: Record<string, unknown>): OrderDetail => {
  const pricing = (item.pricing as Record<string, unknown> | undefined) ?? {};
  const payment = (item.payment as Record<string, unknown> | undefined) ?? {};
  const delivery = (item.delivery as Record<string, unknown> | undefined) ?? {};
  const timestamps =
    (item.timestamps as Record<string, unknown> | undefined) ?? {};
  const rows = Array.isArray(item.items)
    ? (item.items as Record<string, unknown>[])
    : [];

  return {
    id: String(item.orderId ?? item.id ?? item.orderNumber ?? "N/A"),
    orderNumber: String(item.orderNumber ?? item.orderId ?? "N/A"),
    status: String(item.orderStatus ?? item.status ?? "pending"),
    paymentMethod: String(payment.method ?? "N/A"),
    paymentStatus: String(payment.status ?? item.paymentStatus ?? "pending"),
    totalAmount: Number(
      pricing.totalAmount ?? item.total ?? item.totalAmount ?? 0,
    ),
    currency: String(pricing.currency ?? "BDT"),
    orderedAt: String(
      timestamps.orderedAt ??
        item.orderedAt ??
        item.createdAt ??
        new Date().toISOString(),
    ),
    estimatedTime: String(
      delivery.estimatedTime ?? item.estimatedDeliveryTime ?? "N/A",
    ),
    deliveryAddress: String(
      delivery.address ??
        item.deliveryAddress ??
        (item.deliveryAddress && typeof item.deliveryAddress === "object"
          ? Object.values(item.deliveryAddress as Record<string, unknown>)
              .filter(Boolean)
              .join(", ")
          : "N/A"),
    ),
    items: rows.map((row) => ({
      name: String(row.name ?? row.foodName ?? "Item"),
      quantity: Number(row.quantity ?? 1),
      totalPrice: Number(row.totalPrice ?? row.total ?? row.price ?? 0),
    })),
  };
};

export default function AccountOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `/account/signin?next=${encodeURIComponent(`/account/orders/${params.orderId}`)}`,
      );
    }
  }, [isLoading, isAuthenticated, params.orderId, router]);

  useEffect(() => {
    const loadOrder = async () => {
      const decodedId = decodeURIComponent(params.orderId || "");

      try {
        const apiOrder = await orderApi.getMyOrder(decodedId);
        setFallbackNotice("");
        setOrder(normalizeOrder(apiOrder));
        setLoading(false);
        return;
      } catch {
        // Fallback to local mock data when API is unavailable.
      }

      try {
        const response = await fetch("/orders.json");
        const json = await response.json();
        const list = (Array.isArray(json) ? json : json.orders || []) as Record<
          string,
          unknown
        >[];

        const id = decodedId.toLowerCase();

        const matched = list.find((item) => {
          const number = String(item.orderNumber ?? "").toLowerCase();
          const orderId = String(item.orderId ?? item.id ?? "").toLowerCase();
          return id === number || id === orderId;
        });

        if (matched) {
          setFallbackNotice(
            "Showing saved order details while live sync is unavailable.",
          );
          setOrder(normalizeOrder(matched));
        } else {
          setOrder(null);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [params.orderId]);

  const subtotal = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [order]);

  const canCancel = useMemo(() => {
    if (!order) return false;
    const lockedStates = new Set([
      "cancelled",
      "delivered",
      "out_for_delivery",
    ]);
    return !lockedStates.has(order.status.toLowerCase());
  }, [order]);

  const handleCancelOrder = async () => {
    if (!order || !canCancel || isCancelling) return;
    setIsCancelling(true);
    try {
      const updated = await orderApi.cancelOrder(order.id);
      setOrder(normalizeOrder(updated));
      toast.success("Order cancelled");
    } catch {
      toast.error("Could not cancel this order");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReorder = async () => {
    if (!order || isReordering) return;
    setIsReordering(true);
    try {
      const result = await orderApi.reorder(order.id);
      const targetOrder = String(
        result.orderId ?? result.orderNumber ?? order.id,
      );
      toast.success("Reorder placed");
      router.push(`/account/orders/${encodeURIComponent(targetOrder)}`);
    } catch {
      toast.error("Could not reorder right now");
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading || !isAuthenticated || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh] space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <AccountNav />
        </div>

        <div className="lg:col-span-9 bg-white border border-rose-100 rounded-3xl p-5 md:p-6 space-y-5">
          {fallbackNotice ? (
            <AccountFallbackNotice message={fallbackNotice} />
          ) : null}

          {!order ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/30 p-6 text-sm text-slate-600">
              Order not found. Go back to
              <Link
                href="/account/orders"
                className="text-rose-600 ml-1 font-semibold"
              >
                all orders
              </Link>
              .
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">
                    #{order.orderNumber}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {new Date(order.orderedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleReorder}
                    disabled={isReordering}
                    className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold disabled:opacity-60"
                  >
                    {isReordering ? "Reordering..." : "Reorder"}
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!canCancel || isCancelling}
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold disabled:opacity-50"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                  <Link
                    href={`/account/order_track?order=${encodeURIComponent(order.orderNumber)}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold"
                  >
                    Track
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 uppercase">Status</p>
                  <p className="font-bold text-slate-800">{order.status}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 uppercase">Payment</p>
                  <p className="font-bold text-slate-800">
                    {order.paymentMethod}
                  </p>
                  <p className="text-xs text-rose-600">{order.paymentStatus}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 uppercase">ETA</p>
                  <p className="font-bold text-slate-800">
                    {order.estimatedTime}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-bold text-slate-800">Items</h2>
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                  >
                    <p className="text-sm text-slate-700">
                      {item.quantity}x {item.name}
                    </p>
                    <p className="font-semibold text-slate-800">
                      {item.totalPrice.toFixed(2)} {order.currency}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500 uppercase flex items-center gap-2">
                    <MapPin size={14} /> Address
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {order.deliveryAddress}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 space-y-1">
                  <p className="text-xs text-slate-500 uppercase flex items-center gap-2">
                    <CreditCard size={14} /> Summary
                  </p>
                  <p className="text-sm text-slate-600">
                    Subtotal: {subtotal.toFixed(2)} {order.currency}
                  </p>
                  <p className="text-base font-bold text-slate-800">
                    Total: {order.totalAmount.toFixed(2)} {order.currency}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Truck size={12} /> Estimated delivery:{" "}
                    {order.estimatedTime}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
