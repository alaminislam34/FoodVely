"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Image as ImageIcon,
  Calendar,
  MousePointer2,
  Layout,
  Clock,
  Save,
  AlertCircle,
} from "lucide-react";

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  position: "top" | "middle" | "bottom";
  status: "active" | "inactive";
  startDate: string;
  endDate: string;
  clicks: number;
}

export default function BannersManagement() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "BN-001",
      title: "Summer Mega Sale",
      description: "Get up to 50% off on all orders",
      image: "",
      position: "top",
      status: "active",
      startDate: "2024-01-20",
      endDate: "2024-02-20",
      clicks: 2450,
    },
    {
      id: "BN-002",
      title: "New Restaurants",
      description: "Discover amazing new dining options",
      image: "",
      position: "middle",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      clicks: 1820,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(
    banners[0]?.id || null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const currentBanner = useMemo(
    () => banners.find((b) => b.id === selectedId),
    [banners, selectedId],
  );

  const handleToggleStatus = (id: string) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "active" ? "inactive" : "active" }
          : b,
      ),
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this banner?")) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
            Website Banners
          </h1>
          <p className="text-gray-500 font-medium">
            Manage promotional real-estate and ad performance.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedId(null);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-rose-200 transition-all"
        >
          <Plus size={20} /> Add New Banner
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-gray-200 overflow-hidden h-150 overflow-y-auto custom-scrollbar shadow-sm">
            {banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <ImageIcon size={40} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">No banners found.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {banners.map((banner) => (
                  <motion.button
                    layout
                    key={banner.id}
                    onClick={() => {
                      setSelectedId(banner.id);
                      setIsEditing(false);
                      setIsCreating(false);
                    }}
                    className={`w-full p-5 border-b border-gray-100 text-left transition-all relative ${
                      selectedId === banner.id
                        ? "bg-rose-50/50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {selectedId === banner.id && (
                      <motion.div
                        layoutId="active-bar"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"
                      />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {banner.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${
                          banner.status === "active"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {banner.status}
                      </span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {banner.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Layout size={12} /> {banner.position}
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointer2 size={12} /> {banner.clicks} clicks
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right Column: Details or Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isCreating || isEditing ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-xl font-bold text-gray-800">
                    {isCreating ? "Create New Banner" : "Edit Banner"}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        Banner Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Weekend Flash Sale"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        Display Position
                      </label>
                      <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none">
                        <option value="top">Hero Section (Top)</option>
                        <option value="middle">Middle Promo</option>
                        <option value="bottom">Footer / Bottom</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Marketing copy..."
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none transition-all focus:ring-4 focus:ring-rose-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center bg-gray-50 hover:bg-rose-50/30 transition-colors cursor-pointer group">
                    <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="text-rose-500" size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      Upload Banner Image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Recommended: 1200 x 400px (Max 2MB)
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Draft Save
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-4 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={20} /> Publish Banner
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : currentBanner ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden"
              >
                {/* Banner Visual Preview */}
                <div className="h-56 bg-gray-100 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-br from-rose-100 to-orange-50 flex items-center justify-center">
                    <ImageIcon size={64} className="text-rose-200" />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 uppercase">
                      <Layout size={12} /> {currentBanner.position}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-xl shadow-sm hover:text-rose-500 transition-colors">
                    <Eye size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {currentBanner.title}
                      </h2>
                      <p className="text-gray-500 leading-relaxed font-medium">
                        {currentBanner.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1">
                        <MousePointer2 size={12} /> Interaction
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {currentBanner.clicks.toLocaleString()}{" "}
                        <span className="text-xs text-gray-400">Clicks</span>
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1">
                        <Calendar size={12} /> Duration
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Date(currentBanner.startDate).toLocaleDateString()}{" "}
                        - {new Date(currentBanner.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                      <p className="text-[10px] font-black text-rose-400 uppercase mb-2 flex items-center gap-1">
                        <Clock size={12} /> Status
                      </p>
                      <p className="text-sm font-bold text-rose-600 capitalize">
                        {currentBanner.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                    >
                      <Edit2 size={18} /> Edit Settings
                    </button>
                    <button
                      onClick={() => handleToggleStatus(currentBanner.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all border ${
                        currentBanner.status === "active"
                          ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {currentBanner.status === "active"
                        ? "Pause Campaign"
                        : "Enable Campaign"}
                    </button>
                    <button
                      onClick={() => handleDelete(currentBanner.id)}
                      className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-125 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                <AlertCircle size={64} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium text-lg text-center px-6">
                  Select a banner to view analytics <br /> or create a new
                  campaign.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
