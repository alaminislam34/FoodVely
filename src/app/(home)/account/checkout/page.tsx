"use client";

import { BadgePercent, ShoppingBag, X } from "lucide-react";
export default function CheckoutPage() {
  return (
    <section className="max-w-360 mx-auto w-11/12 py-10 min-h-[70vh]">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="text-rose-500" />
        <h1 className="text-3xl font-Sofia font-bold text-gray-900">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Delivery Details
          </h2>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 min-h-28 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="House, road, area, city"
              />
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Your Items</h3>
          <div className="space-y-3"></div>

          <div className="mt-8 border border-dashed border-rose-200 rounded-3xl p-4 bg-rose-50/30">
            <div className="flex items-center gap-2 mb-3 text-rose-600 font-bold">
              <BadgePercent size={18} /> Coupon
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 h-fit">
          <h2 className="font-bold text-gray-900 mb-4">Payment Summary</h2>
        </div>
      </div>
    </section>
  );
}
