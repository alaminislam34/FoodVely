"use client";

import React from "react";
import {
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  PackageCheck,
  Phone,
  MessageSquare,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- TYPES ---

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isCompleted: boolean;
  isActive: boolean;
  isLast?: boolean;
}

// --- SUB-COMPONENTS ---

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
    {/* Progress Line */}
    {!isLast && (
      <div
        className={`absolute left-7 top-14 w-1 h-full rounded-full ${isCompleted ? "bg-rose-500" : "bg-slate-100"}`}
      />
    )}

    {/* Icon Circle */}
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

    {/* Text Content */}
    <div
      className={`flex-1 pt-1 ${isActive ? "translate-x-2" : ""} transition-all duration-300`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`text-lg font-black ${isActive ? "text-orange-600" : "text-slate-800"}`}
          >
            {title}
          </h3>
          <p className="text-slate-500 text-sm font-medium">{description}</p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${isActive ? "bg-orange-100 text-orange-600" : "text-slate-400"}`}
        >
          {time}
        </span>
      </div>
    </div>
  </div>
);

export default function OrderStatusPage() {
  const router = useRouter();
  return (
    <div className="max-w-360 mx-auto w-11/12 py-12">
      <div className="">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-rose-500 font-bold mb-2 hover:gap-3 transition-all"
            >
              <ArrowLeft size={18} /> Back to My Profile
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Order Status
            </h1>
          </div>
          <div className="bg-white px-6 py-4 rounded-4xl border border-rose-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Order ID
              </p>
              <p className="text-sm font-black text-slate-800">#FV-882910</p>
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl">
              <Clock size={16} />
              <span className="font-bold">12-18 min</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT: STATUS TIMELINE --- */}
          <div className="lg:col-span-7 bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] p-10 shadow-2xl shadow-rose-100/30">
            <div className="mb-10">
              <h2 className="text-xl font-black text-slate-800">
                Journey of your food
              </h2>
              <p className="text-slate-500 text-sm italic">
                We'll update you as your meal moves
              </p>
            </div>

            <div className="flex flex-col">
              <StatusCard
                icon={<CheckCircle2 size={24} />}
                title="Order Received"
                description="FoodVally has confirmed your order."
                time="12:05 PM"
                isCompleted={true}
                isActive={false}
              />
              <StatusCard
                icon={<ChefHat size={24} />}
                title="Kitchen is Sizzling"
                description="Chef is preparing your delicious meal."
                time="12:15 PM"
                isCompleted={true}
                isActive={false}
              />
              <StatusCard
                icon={<Bike size={24} />}
                title="Out for Delivery"
                description="Your rider is heading your way."
                time="LIVE"
                isCompleted={false}
                isActive={true}
              />
              <StatusCard
                icon={<PackageCheck size={24} />}
                title="Enjoy your Food"
                description="Wait for the doorbell to ring!"
                time="Pending"
                isCompleted={false}
                isActive={false}
                isLast={true}
              />
            </div>

            {/* Rider Info Quick Bar */}
            <div className="mt-6 bg-linear-to-r from-slate-900 to-slate-800 rounded-4xl p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rider"
                  className="w-12 h-12 bg-white/10 rounded-xl"
                  alt="Rider"
                />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Your Rider
                  </p>
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

          {/* --- RIGHT: ORDER SUMMARY --- */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <MapPin size={20} />
                </div>
                <h4 className="font-bold">Delivery Address</h4>
              </div>
              <p className="text-slate-600 leading-relaxed italic ml-10">
                123 Sunset Boulevard, <br />
                Apt 4B, Blue Building, <br />
                Los Angeles, CA 90210
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/20">
              <h4 className="font-black text-slate-800 mb-6 uppercase tracking-widest text-sm">
                Receipt Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">
                    1x Truffle Pizza
                  </span>
                  <span className="font-bold text-slate-700">$18.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">
                    2x Cold Coffee
                  </span>
                  <span className="font-bold text-slate-700">$9.00</span>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Delivery Fee</span>
                    <span className="font-bold text-slate-700">$2.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-2">
                    <span className="text-rose-600 uppercase italic">
                      Total Paid
                    </span>
                    <span className="text-slate-900">$29.50</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <CreditCard size={18} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500">
                  PAID VIA APPLE PAY
                </span>
                <CheckCircle2 size={14} className="ml-auto text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center p-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100/50">
          <p className="text-slate-500 font-medium mb-4">
            Something wrong with your order?
          </p>
          <button className="px-8 py-3 bg-white text-rose-500 font-bold rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            Contact Support Center
          </button>
        </div>
      </div>
    </div>
  );
}
