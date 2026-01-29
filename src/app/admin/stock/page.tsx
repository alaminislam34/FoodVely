"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Package,
  Search,
  RefreshCw,
  Bell,
  ChevronRight,
  Star,
  Store,
} from "lucide-react";
import Image from "next/image";

// --- Interface matching your JSON structure ---
interface Product {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  provider: { name: string };
  rating: { average: number; totalReviews: number };
  availability: { stock: number; isAvailable: boolean };
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/FoodProducts.json")
      .then((res) => res.json())
      .then((data: Product[]) => {
        // Only keep products where stock is 0 or availability is false
        const outOfStock = data.filter((p) => p.availability.stock === 0);
        setProducts(outOfStock);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to load stock data", err));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.provider.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const totalMissedPotential = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + p.price * p.rating.totalReviews,
      0,
    );
  }, [products]);

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
            Stock Alerts
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Immediate attention required for {products.length} depleted items.
          </p>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          {
            label: "Items Depleted",
            value: products.length,
            color: "text-red-600",
            icon: AlertTriangle,
            bg: "bg-red-50/50",
          },
          {
            label: "Total Demand (Reviews)",
            value: products.reduce((acc, p) => acc + p.rating.totalReviews, 0),
            color: "text-orange-600",
            icon: Package,
            bg: "bg-orange-50/50",
          },
          {
            label: "Avg. Lost Price",
            value: `$${(products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1)).toFixed(2)}`,
            color: "text-rose-600",
            icon: RefreshCw,
            bg: "bg-rose-50/50",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-6 shadow-lg backdrop-blur-xl"
          >
            <div className="relative z-10">
              <p className={`text-3xl font-bold font-Sofia ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
            <stat.icon
              size={48}
              className={`absolute right-2 top-2 opacity-10 ${stat.color}`}
            />
          </motion.div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search unavailable items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    Loading inventory...
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-red-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white shadow-sm bg-gray-100">
                          {product.thumbnail && (
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Store size={14} className="text-gray-400" />
                        {product.provider.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-700 font-Sofia">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600 border border-red-200">
                        Out of Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-red-500 hover:text-red-500 transition-all shadow-sm">
                        <Bell size={14} /> Notify
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/50 border border-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {product.provider.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-Sofia font-bold text-red-600">
                      $0.00 Stock
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                Restock Request
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 rounded-full bg-green-50 text-green-500 mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">All systems go!</h3>
            <p className="text-gray-500 text-sm">
              No products are currently out of stock.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
