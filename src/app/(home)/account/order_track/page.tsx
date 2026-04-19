"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bike,
  Calendar,
  CheckCircle2,
  ChefHat,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import Image from "next/image";

interface OrderTimelineEntry {
  status: string;
  timestamp: string;
}

interface OrderItem {
  foodId: number;
  foodName: string;
  foodImage?: string;
  quantity: number;
  price: number;
  total: number;
}

interface DeliveryAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface OrderRecord {
  id: number | string;
  orderNumber: string;
  subtotal?: number;
  discount?: number;
  deliveryCharge?: number;
  total?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryAddress?: DeliveryAddress;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  items?: OrderItem[];
  timeline?: OrderTimelineEntry[];
}

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
}

const StatusCard = ({
  icon,
  title,
  description,
  time,
  isCompleted,
  isActive,
  isLast,
}: StatusCardProps) => (
  <div className="relative flex gap-6 pb-10">
    {!isLast && (
      <div
        className={`absolute left-7 top-14 w-1 h-full rounded-full ${isCompleted ? "bg-rose-500" : "bg-slate-100"}`}
      />
    )}

    <div
      className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all duration-500 ${
        isActive
          ? "bg-orange-500 text-white scale-110 ring-8 ring-orange-100"
          : isCompleted
            ? "bg-rose-500 text-white"
            : "bg-white text-slate-300 border border-slate-100"
      }`}
    >
      {icon}
    </div>

    <div className={`flex-1 pt-1 ${isActive ? "translate-x-2" : ""} transition-all duration-300`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className={`text-lg font-black ${isActive ? "text-orange-600" : "text-slate-800"}`}>
            {title}
          </h3>
          <p className="text-slate-500 text-sm font-medium">{description}</p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
            isActive ? "bg-orange-100 text-orange-600" : "text-slate-400"
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  </div>
);

const statusFlow = [
  { key: "pending", title: "Order Received", description: "FoodVally has confirmed your order.", icon: CheckCircle2 },
  { key: "confirmed", title: "Kitchen is Sizzling", description: "Chef is preparing your delicious meal.", icon: ChefHat },
  { key: "preparing", title: "Kitchen is Sizzling", description: "Chef is preparing your delicious meal.", icon: ChefHat },
  { key: "ready", title: "Ready for Pickup", description: "Your order is ready for the rider.", icon: PackageCheck },
  { key: "out_for_delivery", title: "Out for Delivery", description: "Your rider is heading your way.", icon: Bike },
  { key: "delivered", title: "Enjoy your Food", description: "Wait for the doorbell to ring!", icon: PackageCheck },
  { key: "cancelled", title: "Order Cancelled", description: "This order was cancelled.", icon: PackageCheck },
];

const timelineLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "LIVE",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getStatusIndex = (status?: string) => {
  switch ((status || "pending").toLowerCase()) {
    case "confirmed":
      return 1;
    case "preparing":
      return 2;
    case "ready":
      return 3;
    case "out_for_delivery":
      return 4;
    case "delivered":
      return 5;
    case "cancelled":
      return 6;
    default:
      return 0;
  }
};

export default function OrderStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuthContext();
  const orderId = searchParams.get("order") || "FV-882910";

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/account/signin?next=${encodeURIComponent("/account/order_track")}`);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await fetch("/data/orders.json");
        const data = await response.json();
        const orders = (Array.isArray(data) ? data : data.orders || []) as OrderRecord[];
        const matched = orders.find(
          (item) => String(item.orderNumber).toLowerCase() === orderId.toLowerCase() || String(item.id) === orderId,
        );
        setOrder(matched || null);
      } catch {
        setOrder(null);
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const derivedStatus = order?.status || "out_for_delivery";
  const statusIndex = getStatusIndex(derivedStatus);
  const orderItems = order?.items || [];
  const timeline = order?.timeline || [
    { status: "pending", timestamp: "2024-01-28T10:00:00Z" },
    { status: "confirmed", timestamp: "2024-01-28T10:05:00Z" },
    { status: "preparing", timestamp: "2024-01-28T10:10:00Z" },
    { status: "out_for_delivery", timestamp: "2024-01-28T10:25:00Z" },
  ];

  const currency = "BDT";
  const subtotal = order?.subtotal ?? orderItems.reduce((sum, item) => sum + item.total, 0);
  const discount = order?.discount ?? 0;
  const deliveryCharge = order?.deliveryCharge ?? 0;
  const total = order?.total ?? Math.max(subtotal - discount + deliveryCharge, 0);

  const statusMeta = useMemo(() => {
    return {
      label: timelineLabels[derivedStatus] || derivedStatus.replaceAll("_", " "),
      tone:
        derivedStatus === "delivered"
          ? "bg-emerald-100 text-emerald-700"
          : derivedStatus === "cancelled"
            ? "bg-rose-100 text-rose-700"
            : "bg-orange-100 text-orange-600",
    };
  }, [derivedStatus]);

  if (isLoading || !isAuthenticated || loadingOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto w-11/12 py-12">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-rose-500 font-bold mb-2 hover:gap-3 transition-all"
            >
              <ArrowLeft size={18} /> Back to My Profile
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Status</h1>
          </div>
          <div className="bg-white px-6 py-4 rounded-4xl border border-rose-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Order ID</p>
              <p className="text-sm font-black text-slate-800">#{order?.orderNumber || orderId}</p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusMeta.tone}`}>
              <Clock size={16} />
              <span className="font-bold">{order?.estimatedDeliveryTime || "12-18 min"}</span>
            </div>
          </div>
        </div>

        {!order ? (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-xl text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-3">Order not found</h2>
            <p className="text-slate-500 mb-6">
              We could not find an order with id {orderId}. Try checking the link again.
            </p>
            <button
              onClick={() => router.push("/account/cart")}
              className="px-6 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white font-semibold"
            >
              Back to Cart
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-2xl shadow-rose-100/30">
              <div className="mb-10 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Journey of your food</h2>
                  <p className="text-slate-500 text-sm italic">We'll update you as your meal moves</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusMeta.tone}`}>{statusMeta.label}</span>
              </div>

              <div className="flex flex-col">
                {statusFlow.map((stage, index) => {
                  const matched = timeline.find((entry) => entry.status === stage.key);
                  const isCurrent = index === statusIndex;
                  const isCompleted = matched ? true : index < statusIndex;
                  const Icon = stage.icon;

                  if (stage.key === "cancelled" && derivedStatus !== "cancelled") {
                    return null;
                  }

                  return (
                    <StatusCard
                      key={stage.key}
                      icon={<Icon size={24} />}
                      title={stage.title}
                      description={stage.description}
                      time={matched ? new Date(matched.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : isCurrent ? "LIVE" : isCompleted ? "Done" : "Pending"}
                      isCompleted={isCompleted}
                      isActive={isCurrent}
                      isLast={stage.key === "cancelled" || index === statusFlow.length - 1}
                    />
                  );
                })}
              </div>

              <div className="mt-6 bg-linear-to-r from-slate-900 to-slate-800 rounded-4xl p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider"
                    className="w-12 h-12 bg-white/10 rounded-xl"
                    alt="Rider"
                  />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Your Rider</p>
                    <p className="font-bold text-lg">Mark Johnson</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                    <Phone size={20} />
                  </button>
                  <button className="p-3 bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-lg">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <MapPin size={20} />
                  </div>
                  <h4 className="font-bold">Delivery Address</h4>
                </div>
                <p className="text-slate-600 leading-relaxed italic ml-10">
                  {order.deliveryAddress?.street || "Not provided"}
                  <br />
                  {order.deliveryAddress?.city || ""}
                  {order.deliveryAddress?.state ? `, ${order.deliveryAddress.state}` : ""}
                  {order.deliveryAddress?.zipCode ? ` ${order.deliveryAddress.zipCode}` : ""}
                  <br />
                  {order.deliveryAddress?.country || ""}
                </p>
              </div>

              <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20">
                <h4 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-sm">Receipt Summary</h4>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.foodId} className="flex justify-between items-center gap-4">
                      <span className="text-slate-500 font-medium">
                        {item.quantity}x {item.foodName}
                      </span>
                      <span className="font-bold text-slate-700">
                        {currency} {item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-slate-200 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="font-bold text-slate-700">{currency} {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Discount</span>
                      <span className="font-bold text-slate-700">- {currency} {discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Delivery Fee</span>
                      <span className="font-bold text-slate-700">{currency} {deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black pt-2">
                      <span className="text-rose-600 uppercase italic">Total Paid</span>
                      <span className="text-slate-900">{currency} {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CreditCard size={18} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Paid via {order.paymentMethod || "card"}
                  </span>
                  <CheckCircle2 size={14} className="ml-auto text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50">
          <p className="text-slate-500 font-medium mb-4">Something wrong with your order?</p>
          <button className="px-8 py-3 bg-white text-rose-500 font-bold rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            Contact Support Center
          </button>
        </div>
      </div>
    </div>
  );
}
