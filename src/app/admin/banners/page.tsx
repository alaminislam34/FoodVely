"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "1",
      title: "Summer Mega Sale",
      description: "Get up to 50% off on all orders",
      image: "/banners/summer-sale.jpg",
      position: "top",
      status: "active",
      startDate: "2024-01-20",
      endDate: "2024-02-20",
      clicks: 2450,
    },
    {
      id: "2",
      title: "New Restaurants",
      description: "Discover amazing new dining options",
      image: "/banners/new-restaurants.jpg",
      position: "middle",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      clicks: 1820,
    },
    {
      id: "3",
      title: "Free Delivery",
      description: "Free delivery on orders over $20",
      image: "/banners/free-delivery.jpg",
      position: "bottom",
      status: "inactive",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      clicks: 0,
    },
  ]);

  const toggleStatus = (id: string) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id
          ? {
              ...banner,
              status: banner.status === "active" ? "inactive" : "active",
            }
          : banner,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-Sofia font-bold text-gray-800 mb-2">
            Website Banners
          </h1>
          <p className="text-gray-600">
            Manage promotional banners and advertisements
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </motion.div>

      {/* Banners Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Banner Preview */}
            <div className="relative h-48 bg-gray-100 overflow-hidden group">
              <div className="w-full h-full bg-linear-to-r from-gray-300 to-gray-200 animate-pulse" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                  <Eye size={24} className="text-gray-800" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {banner.status === "active" ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Active
                  </span>
                ) : (
                  <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✕ Inactive
                  </span>
                )}
              </div>

              {/* Position Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {banner.position}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title & Description */}
              <h3 className="text-lg font-Sofia font-bold text-gray-800 mb-2">
                {banner.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{banner.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Clicks</p>
                  <p className="font-bold text-gray-800">{banner.clicks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Active Until</p>
                  <p className="font-bold text-gray-800 text-sm">
                    {new Date(banner.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(banner.id)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    banner.status === "active"
                      ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      : "bg-green-100 text-green-600 hover:bg-green-200"
                  }`}
                >
                  {banner.status === "active" ? "⏸ Disable" : "✓ Enable"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-200 transition-colors">
                  <Edit2 size={16} />
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add New Banner Button - Large */}
      {banners.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center"
        >
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Banners Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first promotional banner
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Create Banner
          </button>
        </motion.div>
      )}
    </div>
  );
}
