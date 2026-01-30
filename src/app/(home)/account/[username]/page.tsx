"use client";

import React, { ReactNode } from "react";
import {
  ShoppingCart,
  Heart,
  Clock,
  MapPin,
  Star,
  Plus,
  Search,
  LogOut,
  UtensilsCrossed,
  ChevronRight,
} from "lucide-react";

// --- TYPES ---

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

interface FoodCardProps {
  emoji: string;
  name: string;
  price: string;
  rating: string;
}

interface OrderItemProps {
  status: "Delivered" | "Processing" | "Cancelled";
  date: string;
  total: string;
  pulse?: boolean;
}

// --- MAIN COMPONENT ---

export default function FoodVallyFullProfile() {
  return (
    <div className="min-h-screen w-full bg-[#FFF5F5] flex overflow-hidden font-sans text-slate-800">
      {/* --- SIDEBAR (Glassy Rose) --- */}
      <aside className="hidden lg:flex w-72 flex-col bg-linear-to-b from-rose-500 to-orange-500 text-white p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <UtensilsCrossed className="text-rose-500" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            FoodVally
          </span>
        </div>

        <nav className="flex-1 space-y-4">
          <NavItem icon={<Clock size={20} />} label="Order History" active />
          <NavItem icon={<Heart size={20} />} label="Favorites" />
          <NavItem icon={<ShoppingCart size={20} />} label="Live Cart" />
          <NavItem icon={<MapPin size={20} />} label="Addresses" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/20">
          <button className="flex items-center gap-3 text-rose-100 hover:text-white transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-screen overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {/* Header / Top Bar */}
        <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-rose-100 px-8 py-4 flex justify-between items-center">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search your cravings..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white/50"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-bold">Alex Rivera</p>
              <p className="text-xs text-rose-500 font-medium">
                Gold Foodie Member
              </p>
            </div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              className="w-12 h-12 rounded-full border-2 border-rose-400 p-0.5"
              alt="Avatar"
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-10">
          {/* Section: Live Cart Summary */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-4xl font-black text-gray-900">
                Your <span className="text-rose-500">Cart</span>
              </h2>
              <button className="text-rose-500 font-bold flex items-center gap-1 hover:underline">
                View Full Cart <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-rose-50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-4xl">🍕</div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Truffle Mushroom Pizza
                    </h3>
                    <p className="text-gray-500 text-sm italic">
                      Extra cheese, thin crust
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-rose-100 rounded-lg overflow-hidden font-bold">
                    <button className="px-3 py-1 bg-rose-50 text-rose-600">
                      -
                    </button>
                    <span className="px-4">1</span>
                    <button className="px-3 py-1 bg-rose-50 text-rose-600">
                      +
                    </button>
                  </div>
                  <span className="font-black text-xl text-rose-600">
                    $18.50
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-br from-rose-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div>
                  <p className="text-rose-100 opacity-80 uppercase text-xs font-bold tracking-widest">
                    Subtotal
                  </p>
                  <h3 className="text-3xl font-black">$42.00</h3>
                </div>
                <button className="w-full bg-white text-rose-600 py-3 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform mt-4">
                  CHECKOUT NOW
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Section: Favorites */}
            <section>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Heart className="text-rose-500 fill-rose-500" size={24} />{" "}
                Favorite Bites
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FoodCard
                  emoji="🍔"
                  name="Classic Beef"
                  price="12.00"
                  rating="4.9"
                />
                <FoodCard
                  emoji="🍣"
                  name="Salmon Roll"
                  price="15.50"
                  rating="4.8"
                />
              </div>
            </section>

            {/* Section: Order History */}
            <section>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Clock className="text-orange-500" size={24} /> Recent Orders
              </h2>
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white overflow-hidden shadow-sm">
                <OrderItem status="Delivered" date="Yesterday" total="24.10" />
                <OrderItem
                  status="Processing"
                  date="Today, 2:30 PM"
                  total="18.50"
                  pulse
                />
                <OrderItem
                  status="Delivered"
                  date="24 Oct 2023"
                  total="32.00"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS WITH TYPES ---

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
        active
          ? "bg-white text-rose-600 shadow-lg"
          : "hover:bg-white/10 text-white/80"
      }`}
    >
      {icon}
      <span className="font-bold">{label}</span>
    </button>
  );
}

function FoodCard({ emoji, name, price, rating }: FoodCardProps) {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-rose-50 hover:shadow-md transition-shadow group">
      <div className="h-32 bg-rose-50 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform">
        {emoji}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{name}</h4>
          <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
            <Star size={12} fill="currentColor" /> {rating}
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-rose-600">${price}</p>
          <button className="mt-2 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-orange-500 transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderItem({ status, date, total, pulse = false }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-rose-50 last:border-0 hover:bg-rose-50/30 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-3 h-3 rounded-full ${
            pulse ? "bg-orange-500 animate-pulse" : "bg-green-500"
          }`}
        ></div>
        <div>
          <p className="font-bold text-sm">{date}</p>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {status}
          </p>
        </div>
      </div>
      <p className="font-black text-slate-700">${total}</p>
    </div>
  );
}
