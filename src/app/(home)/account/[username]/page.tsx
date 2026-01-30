"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Clock,
  MapPin,
  Star,
  Plus,
  Edit3,
  ChevronRight,
  Package,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import CustomerProfileSkeleton from "./components/Skeleton";

// --- TYPES ---

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

interface FavoriteItemProps {
  emoji: string;
  name: string;
  rating: number;
}

// --- COMPONENTS ---

const SectionHeader = ({ title, icon }: SectionHeaderProps) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">{icon}</div>
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
  </div>
);

export default function CustomerProfilePage() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <CustomerProfileSkeleton />;
  }
  return (
    <div className="min-h-screen">
      {/* --- TOP COVER & PROFILE HEADER --- */}
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-end pb-10">
          <div className="flex flex-col md:flex-row items-center gap-6 z-10 translate-y-16">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                className="w-40 h-40 rounded-[3rem] border-8 border-white bg-white shadow-xl"
                alt="User Profile"
              />
              <button className="absolute bottom-2 right-2 p-2 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                <Edit3 size={18} />
              </button>
            </div>
            <div className="text-center md:text-left md:pb-4">
              <h1 className="text-4xl font-black text-slate-800">
                Alex Rivera
              </h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} className="text-rose-500" /> Los Angeles, CA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-6xl mx-auto px-6 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Personal Info & Orders */}
        <div className="lg:col-span-8 space-y-10">
          {/* Tracking Section (Modern Glassy Card) */}
          <div className="backdrop-blur-md bg-white/70 border border-white rounded-[2.5rem] p-8 shadow-xl shadow-rose-100/50">
            <SectionHeader title="Active Order" icon={<Package size={22} />} />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                  🥡
                </div>
                <div>
                  <h4 className="font-bold text-lg">Delicious Sushi Hub</h4>
                  <p className="text-rose-500 font-semibold">
                    On the way • 12 mins
                  </p>
                </div>
              </div>
              <Link
                href={`/account/order_track`}
                className="px-6 py-3 bg-rose-500 text-white font-bold rounded-2xl shadow-lg hover:bg-rose-600 transition-all flex items-center gap-2"
              >
                Track Delivery <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Favorites Grid */}
          <div>
            <SectionHeader title="My Favorites" icon={<Heart size={22} />} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FavoriteItem emoji="🍕" name="Cheesy Pizza" rating={4.9} />
              <FavoriteItem emoji="🍔" name="Beef Burger" rating={4.7} />
              <FavoriteItem emoji="🍦" name="Ice Cream" rating={5.0} />
              <FavoriteItem emoji="🌮" name="Street Tacos" rating={4.8} />
            </div>
          </div>

          {/* Past Orders */}
          <div>
            <SectionHeader title="Order History" icon={<Clock size={22} />} />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-white border border-rose-50 rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl opacity-50">#2940{i}</div>
                    <div>
                      <p className="font-bold">McDonald's • 2 items</p>
                      <p className="text-sm text-gray-400">Oct 24, 2025</p>
                    </div>
                  </div>
                  <div className="text-right font-black text-slate-700">
                    $24.50
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cart & Profile Details */}
        <div className="lg:col-span-4 space-y-8">
          {/* Cart Section (The Glassy Sidebar) */}
          <div className="sticky top-10 backdrop-blur-xl bg-linear-to-br from-white/90 to-rose-50/90 border border-white rounded-[2.5rem] p-6 shadow-2xl shadow-rose-200/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
                <ShoppingCart size={22} /> My Bag
              </h3>
              <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                3 Items
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <CartItem name="Truffle Pasta" price={18} qty={1} />
              <CartItem name="Coke Zero" price={3} qty={2} />
            </div>

            <div className="border-t border-rose-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>$21.00</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-800">
                <span>Total</span>
                <span>$21.00</span>
              </div>
            </div>

            <button className="w-full mt-6 py-4 bg-linear-to-r from-rose-500 to-orange-500 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider">
              Go to Checkout
            </button>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white border border-rose-50 rounded-4xl p-6">
            <h4 className="font-bold mb-4">Payment Method</h4>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <CreditCard size={20} className="text-slate-400" />
              <span className="text-sm font-medium">•••• •••• •••• 4421</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FavoriteItem({ emoji, name, rating }: FavoriteItemProps) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-rose-50 text-center hover:border-rose-200 transition-colors group cursor-pointer">
      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
        {emoji}
      </div>
      <p className="font-bold text-sm text-slate-700 leading-tight">{name}</p>
      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-orange-500 font-bold">
        <Star size={10} fill="currentColor" /> {rating}
      </div>
    </div>
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
          {qty}x • ${price}
        </p>
      </div>
      <button className="p-1 hover:bg-rose-100 rounded-md transition-colors">
        <Plus size={16} className="text-rose-500" />
      </button>
    </div>
  );
}
