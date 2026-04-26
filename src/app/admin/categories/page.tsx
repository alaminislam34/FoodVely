"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  X,
  Package,
  Layers,
} from "lucide-react";
import { adminApi } from "@/api/adminApi";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";

import { useCategory } from "@/hooks/hooks/useCategory";
import { CategoryFormModal } from "@/components/admin/AddCategoryModal";
import { CategoryFormModel } from "@/types/product";
import Image from "next/image";

// --- Types ---
interface Category {
  id: number;
  name: string;
  slug: string;
  products: number;
  imageUrl: string;
  trending: boolean;
  revenue: string;
}

// --- Main Page Component ---
export default function CategoriesPage() {
  const { categories } = useCategory();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    adminApi
      .listCategories({ limit: 20 })
      .then((data) => {
        const mapped: Category[] = data.map((item, index) => ({
          id: Number(item.id ?? index + 1),
          name: String(item.title ?? item.name ?? "Category"),
          slug: String(item.slug ?? "category"),
          products: Number(item.products ?? item.productsCount ?? 0),
          imageUrl: String(item.imageUrl ?? "🍽️"),
          trending: Boolean(item.trending ?? false),
          revenue: String(item.revenue ?? "0"),
        }));
      })
      .catch((error) => console.error("Failed to load categories", error));
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { createCategory } = useCategory();

  const handleAddCategory = (newCat: CategoryFormModel) => {
    const file = newCat.image;

    let imageUrl = "🍽️";
    if (file) {
      imageUrl = URL.createObjectURL(file);
    }

    const formData = new FormData();
    formData.append("title", newCat.title);

    if (newCat.description) {
      formData.append("description", newCat.description);
    }

    if (file) {
      formData.append("images", file);
    }

    createCategory.mutate(formData as any, {
      onSuccess: (created: any) => {
        setIsModalOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-800 mb-2">
            Categories
          </h1>
          <p className="text-gray-500 font-medium">
            Organize your menu items into structured groups.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200 transition-all transform active:scale-95"
        >
          <Plus size={20} />
          New Category
        </button>
      </motion.div>

      {/* Analytics Cards - Glassy Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Categories",
            value: categories.length,
            icon: Layers,
            color: "text-rose-600",
            bg: "bg-rose-50/50",
          },
          {
            label: "Total Products",
            value: categories.length || 0,
            icon: Package,
            color: "text-orange-600",
            bg: "bg-orange-50/50",
          },
          {
            label: "Trending Categories",
            value: 0,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50/50",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-6 shadow-xl backdrop-blur-xl"
          >
            <div
              className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}
            >
              <stat.icon size={64} />
            </div>
            <p className={`text-4xl font-bold  ${stat.color} mb-1`}>
              {stat.value}
            </p>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-md"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-rose-100 focus:bg-white transition-all"
        />
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-100 to-white border border-gray-200 shadow-inner flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      priority
                      src={category.imageUrl}
                      width={100}
                      height={100}
                      alt={category.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Info */}
                    <h3 className=" font-bold text-gray-800 text-xl mb-1 group-hover:text-rose-600 transition-colors">
                      {category.title}
                    </h3>

                    <p className="text-gray-500 font-medium text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Actions (Hidden until hover) */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-20 bg-white/40 rounded-3xl border border-white/60">
          <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
            <Search className="text-gray-400" size={32} />
          </div>
          <p className="text-lg font-semibold text-gray-600">
            No categories found
          </p>
          <p className="text-gray-400">
            Try searching for something else or create a new category.
          </p>
        </div>
      )}

      {/* Modal Component Injection */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCategory}
        isPending={createCategory.isPending}
      />
    </div>
  );
}
