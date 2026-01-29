"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  X,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
} from "lucide-react";

// --- Types ---
interface Category {
  id: number;
  name: string;
  slug: string;
  products: number;
  image: string;
  trending: boolean;
  revenue: string;
}

// --- Mock Data ---
const initialCategories: Category[] = [
  {
    id: 1,
    name: "Burgers",
    slug: "burgers",
    products: 156,
    image: "🍔",
    trending: true,
    revenue: "12,450",
  },
  {
    id: 2,
    name: "Pizza",
    slug: "pizza",
    products: 98,
    image: "🍕",
    trending: true,
    revenue: "18,900",
  },
  {
    id: 3,
    name: "Sushi",
    slug: "sushi",
    products: 67,
    image: "🍣",
    trending: false,
    revenue: "9,200",
  },
  {
    id: 4,
    name: "Desserts",
    slug: "desserts",
    products: 112,
    image: "🍰",
    trending: true,
    revenue: "7,600",
  },
];

// --- Component: Add Category Form (Modal) ---
const AddCategoryModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Category) => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "🍽️", // Default emoji
    trending: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory: Category = {
      id: Date.now(),
      ...formData,
      products: 0, // Default for new cat
      revenue: "0", // Default for new cat
    };
    onAdd(newCategory);
    setFormData({ name: "", slug: "", image: "🍽️", trending: false }); // Reset
    onClose();
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-Sofia font-bold text-gray-800">
                  New Category
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name Input */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g., Street Food"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  />
                </div>

                {/* Slug Input */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Slug (URL Friendly)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                  />
                </div>

                {/* Icon & Trending Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-center text-xl focus:border-rose-500 outline-none"
                    />
                  </div>
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          formData.trending
                            ? "bg-rose-500 border-rose-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {formData.trending && (
                          <TrendingUp size={14} className="text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            trending: e.target.checked,
                          })
                        }
                        className="hidden"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-rose-600 transition-colors">
                        Mark Trending
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-medium text-white bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main Page Component ---
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [newCat, ...prev]);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Stats Logic
  const totalProducts = categories.reduce((sum, cat) => sum + cat.products, 0);
  const trendingCount = categories.filter((cat) => cat.trending).length;

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
          <h1 className="text-3xl md:text-4xl font-Sofia font-bold text-gray-800 mb-2">
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
            value: totalProducts,
            icon: Package,
            color: "text-orange-600",
            bg: "bg-orange-50/50",
          },
          {
            label: "Trending Categories",
            value: trendingCount,
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
            <p className={`text-4xl font-bold font-Sofia ${stat.color} mb-1`}>
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
              {/* Trending Badge */}
              {category.trending && (
                <div className="absolute top-4 right-4 z-10 bg-linear-to-r from-rose-500 to-orange-500 text-white p-1.5 rounded-full shadow-lg shadow-orange-200">
                  <TrendingUp size={14} />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-100 to-white border border-gray-200 shadow-inner flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.image}
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Info */}
                    <h3 className="font-Sofia font-bold text-gray-800 text-xl mb-1 group-hover:text-rose-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
                      /{category.slug}
                    </p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Package size={12} /> Items
                    </p>
                    <p className="font-bold text-gray-800">
                      {category.products}
                    </p>
                  </div>
                  <div className="bg-white/50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <DollarSign size={12} /> Sales
                    </p>
                    <p className="font-bold text-gray-800">
                      ${category.revenue}
                    </p>
                  </div>
                </div>

                {/* Actions (Hidden until hover) */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                  >
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
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}
