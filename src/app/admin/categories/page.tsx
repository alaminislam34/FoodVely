"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
} from "lucide-react";

const mockCategories = [
  {
    id: 1,
    name: "Burgers",
    slug: "burgers",
    products: 156,
    image: "🍔",
    trending: true,
    revenue: "$12,450",
  },
  {
    id: 2,
    name: "Pizza",
    slug: "pizza",
    products: 98,
    image: "🍕",
    trending: true,
    revenue: "$18,900",
  },
  {
    id: 3,
    name: "Sushi",
    slug: "sushi",
    products: 67,
    image: "🍣",
    trending: false,
    revenue: "$9,200",
  },
  {
    id: 4,
    name: "Desserts",
    slug: "desserts",
    products: 112,
    image: "🍰",
    trending: true,
    revenue: "$7,600",
  },
  {
    id: 5,
    name: "Beverages",
    slug: "beverages",
    products: 45,
    image: "🥤",
    trending: false,
    revenue: "$4,300",
  },
  {
    id: 6,
    name: "Salads",
    slug: "salads",
    products: 78,
    image: "🥗",
    trending: true,
    revenue: "$5,800",
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(mockCategories);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-Sofia text-3xl font-bold text-gray-800">
              Product Categories
            </h1>
            <p className="text-gray-600 mt-2">Manage food categories</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            <Plus size={20} />
            New Category
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-rose-600">{categories.length}</p>
          <p className="text-sm text-gray-600">Total Categories</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-orange-600">
            {categories.reduce((sum, cat) => sum + cat.products, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-3xl font-bold text-green-600">
            {categories.filter((cat) => cat.trending).length}
          </p>
          <p className="text-sm text-gray-600">Trending</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="h-32 bg-linear-to-r from-rose-100 to-orange-100 flex items-center justify-center text-6xl relative">
              {category.image}
              {category.trending && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white p-2 rounded-lg">
                  <TrendingUp size={16} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-Sofia font-bold text-gray-800 text-lg">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{category.slug}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-200 mb-4">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {category.products}
                  </p>
                  <p className="text-xs text-gray-600">Products</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-rose-600">
                    {category.revenue}
                  </p>
                  <p className="text-xs text-gray-600">Revenue</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
