"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";
import { providerApi, type ProviderCouponPayload } from "@/api/providerApi";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

type CouponStatus = "active" | "expired" | "scheduled";

type Coupon = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  status: CouponStatus;
};

const getStatusFromDates = (
  validFrom: string,
  validUntil: string,
  active?: boolean,
): CouponStatus => {
  const now = new Date();
  const from = new Date(validFrom);
  const until = new Date(validUntil);

  if (active === false || now > until) {
    return "expired";
  }

  if (now < from) {
    return "scheduled";
  }

  return "active";
};

const normalizeCoupons = (items: Record<string, unknown>[]): Coupon[] => {
  return items.map((item) => {
    const validFrom = String(item.validFrom ?? new Date().toISOString());
    const validUntil = String(
      item.validUntil ?? item.expiryDate ?? new Date().toISOString(),
    );

    return {
      id: String(item.id ?? ""),
      code: String(item.code ?? "").toUpperCase(),
      discountType:
        String(item.discountType ?? item.type ?? "percentage") === "fixed"
          ? "fixed"
          : "percentage",
      discountValue: Number(item.discountValue ?? item.value ?? 0),
      minSpend: Number(item.minSpend ?? item.minOrder ?? 0),
      expiryDate: validUntil,
      usageLimit: Number(item.usageLimit ?? item.maxUses ?? 0),
      usageCount: Number(item.usageCount ?? item.usedCount ?? 0),
      status:
        (item.status as CouponStatus | undefined) ??
        getStatusFromDates(validFrom, validUntil, item.active as boolean),
    };
  });
};

const initialForm: ProviderCouponPayload = {
  code: "",
  discountType: "percentage",
  discountValue: 10,
  minSpend: 100,
  usageLimit: 100,
  expiryDate: "",
};

export default function CouponManage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProviderCouponPayload>(initialForm);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadCoupons = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);

      try {
        const response = await providerApi.listCoupons({ page: 1, limit: 200 });
        if (response.items.length > 0) {
          setCoupons(
            normalizeCoupons(
              response.items as unknown as Record<string, unknown>[],
            ),
          );
          setUsingFallback(false);
          return;
        }

        const fallbackRes = await fetch("/data/coupons.json");
        const fallbackJson = await fallbackRes.json();
        const fallbackItems = Array.isArray(fallbackJson)
          ? fallbackJson
          : fallbackJson.coupons || [];

        setCoupons(
          normalizeCoupons(fallbackItems as Record<string, unknown>[]),
        );
        setUsingFallback(true);
      } catch {
        setError("Failed to load coupons from API and fallback source.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadCoupons("initial");
  }, [loadCoupons]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [coupons, searchQuery]);

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const currentItems = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Code ${code} copied`);
    } catch {
      toast.error("Failed to copy coupon code");
    }
  };

  const handleCreateCoupon = async () => {
    const code = form.code.trim().toUpperCase();
    if (!code) {
      toast.error("Coupon code is required");
      return;
    }
    if (form.discountValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    if (form.minSpend < 0 || form.usageLimit <= 0) {
      toast.error("Minimum spend and usage limit must be valid");
      return;
    }
    if (!form.expiryDate) {
      toast.error("Expiry date is required");
      return;
    }

    setIsCreating(true);
    try {
      await providerApi.createCoupon({
        ...form,
        code,
      });
      toast.success("Coupon created");
      setIsModalOpen(false);
      setForm(initialForm);
      await loadCoupons("refresh");
    } catch {
      toast.error("Failed to create coupon");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) {
      return;
    }

    setDeletingId(coupon.id);
    const previous = coupons;
    setCoupons((prev) => prev.filter((item) => item.id !== coupon.id));

    try {
      await providerApi.deleteCoupon(coupon.id);
      toast.success("Coupon deleted");
    } catch {
      setCoupons(previous);
      toast.error("Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    setTogglingId(coupon.id);
    const previous = coupons;
    const nextStatus = coupon.status === "active" ? "expired" : "active";

    setCoupons((prev) =>
      prev.map((item) =>
        item.id === coupon.id ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      if (coupon.status === "active") {
        await providerApi.deactivateCoupon(coupon.id);
      } else {
        await providerApi.activateCoupon(coupon.id);
      }
      toast.success(
        coupon.status === "active" ? "Coupon deactivated" : "Coupon activated",
      );
    } catch {
      setCoupons(previous);
      toast.error("Failed to update coupon status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} columns={6} />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => loadCoupons("initial")} />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen pb-10">
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
          {usingFallback ? (
            <p className="text-xs text-amber-600 mt-2">
              Running in fallback mode using local data.
            </p>
          ) : null}
          {isRefreshing ? (
            <p className="text-xs text-blue-600 mt-1">
              Syncing latest coupons...
            </p>
          ) : null}
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

      <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl overflow-hidden">
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
                {currentItems.map((coupon) => {
                  const usagePercent = coupon.usageLimit
                    ? Math.min(
                        (coupon.usageCount / coupon.usageLimit) * 100,
                        100,
                      )
                    : 0;

                  return (
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
                            : `${coupon.discountValue} BDT Off`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Min Spend: {coupon.minSpend} BDT
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
                              style={{ width: `${usagePercent}%` }}
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
                        {coupon.status === "active" ? (
                          <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        ) : coupon.status === "scheduled" ? (
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                            <Calendar size={10} /> Scheduled
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
                            <AlertCircle size={10} /> Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleCoupon(coupon)}
                            disabled={togglingId === coupon.id}
                            className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all disabled:opacity-40"
                            title={
                              coupon.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {togglingId === coupon.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Ban size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon)}
                            disabled={deletingId === coupon.id}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-40"
                          >
                            {deletingId === coupon.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

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
                  className={`text-[10px] font-black uppercase ${
                    coupon.status === "active"
                      ? "text-green-500"
                      : coupon.status === "scheduled"
                        ? "text-blue-500"
                        : "text-red-500"
                  }`}
                >
                  {coupon.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-black text-gray-800">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `${coupon.discountValue} BDT`}
                  </p>
                  <p className="text-xs text-gray-400">
                    Off on min {coupon.minSpend} BDT
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleCoupon(coupon)}
                    disabled={togglingId === coupon.id}
                    className="p-3 bg-amber-50 text-amber-600 rounded-2xl disabled:opacity-40"
                  >
                    <Ban size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon)}
                    disabled={deletingId === coupon.id}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
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

        {!loading && currentItems.length === 0 ? (
          <div className="p-6 border-t border-gray-100">
            <EmptyState
              title="No coupons found"
              description="Try a different search or create a new coupon."
            />
          </div>
        ) : null}
      </div>

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
                    value={form.code}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, code: event.target.value }))
                    }
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-4 focus:ring-rose-500/10 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Discount Type
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        discountType: event.target.value as
                          | "percentage"
                          | "fixed",
                      }))
                    }
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (BDT)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        discountValue: Number(event.target.value || 0),
                      }))
                    }
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Min. Spend
                  </label>
                  <input
                    type="number"
                    value={form.minSpend}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        minSpend: Number(event.target.value || 0),
                      }))
                    }
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        usageLimit: Number(event.target.value || 0),
                      }))
                    }
                    className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        expiryDate: event.target.value,
                      }))
                    }
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
                <button
                  onClick={handleCreateCoupon}
                  disabled={isCreating}
                  className="flex-2 bg-gray-900 text-white rounded-2xl py-4 px-6 font-bold hover:bg-rose-600 transition-all shadow-lg active:scale-95 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {isCreating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : null}
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
