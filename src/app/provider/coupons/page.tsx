"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Ticket,
  Copy,
  Calendar,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

// --- Interfaces ---
interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  status: "active" | "expired" | "scheduled";
}

export default function CouponManage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "cpn_1",
      code: "SUMMER50",
      discountType: "percentage",
      discountValue: 50,
      minSpend: 500,
      expiryDate: "2025-08-30",
      usageLimit: 100,
      usageCount: 45,
      status: "active",
    },
    {
      id: "cpn_2",
      code: "WELCOME100",
      discountType: "fixed",
      discountValue: 100,
      minSpend: 1000,
      expiryDate: "2025-02-15",
      usageLimit: 500,
      usageCount: 500,
      status: "expired",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- Search Logic ---
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [coupons, searchQuery]);

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const currentItems = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could trigger a toast here
    alert(`Code ${code} copied!`);
  };

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen pb-10">
      {/* Header with CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800">
            Coupons & Offers
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Create and manage promotional discounts.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all"
        >
          <Plus size={20} /> Create New Coupon
        </motion.button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Code
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Discount
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Usage
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Expiry
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {currentItems.map((coupon) => (
                  <motion.tr
                    key={coupon.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 group">
                        <span className="bg-gray-100 text-gray-800 font-mono font-bold px-3 py-1.5 rounded-lg border border-gray-200">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-rose-500 transition-all"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% Off`
                          : `${coupon.discountValue} ৳ Off`}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Min Spend: {coupon.minSpend} ৳
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] font-bold mb-1 text-gray-500">
                          <span>{coupon.usageCount} used</span>
                          <span>{coupon.usageLimit}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${coupon.usageCount >= coupon.usageLimit ? "bg-red-500" : "bg-rose-500"}`}
                            style={{
                              width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.status === "active" && (
                        <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                          <CheckCircle2 size={10} /> Active
                        </span>
                      )}
                      {coupon.status === "expired" && (
                        <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                          <AlertCircle size={10} /> Expired
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {currentItems.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border border-gray-100 rounded-4xl p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-gray-100 text-gray-800 font-mono font-bold px-3 py-1 rounded-lg">
                  {coupon.code}
                </span>
                <span
                  className={`text-[10px] font-black uppercase ${coupon.status === "active" ? "text-green-500" : "text-red-500"}`}
                >
                  {coupon.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black text-gray-800">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `${coupon.discountValue} ৳`}
                  </p>
                  <p className="text-xs text-gray-400">
                    Off on min {coupon.minSpend} ৳
                  </p>
                </div>
                <button className="p-3 bg-red-50 text-red-500 rounded-2xl">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <footer className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-20 hover:border-rose-500"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 bg-white border border-gray-200 rounded-xl disabled:opacity-20 hover:border-rose-500"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </div>

      {/* --- Create Coupon Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                    <Ticket size={24} />
                  </div>
                  <h2 className="text-2xl font-Sofia font-bold text-gray-800">
                    New Coupon
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SAVE20"
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-4 focus:ring-rose-500/10 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Discount Type
                  </label>
                  <select className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none">
                    <option>Percentage (%)</option>
                    <option>Fixed Amount (৳)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Value
                  </label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Min. Spend
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Discard
                </button>
                <button className="flex-2 bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-rose-600 transition-all shadow-lg active:scale-95">
                  Generate Coupon
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
