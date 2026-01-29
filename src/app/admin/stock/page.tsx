"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
} from "lucide-react";

const mockOutOfStockProducts = [
  {
    id: 1,
    name: "Spicy Chicken Burger",
    restaurant: "Burger King",
    sku: "SKU-001",
    lastOrdered: "2024-12-28",
    daysOutOfStock: 2,
    demandedBy: 156,
    image: "🍔",
  },
  {
    id: 2,
    name: "Classic Pepperoni Pizza",
    restaurant: "Pizzeria Italia",
    sku: "SKU-002",
    lastOrdered: "2024-12-27",
    daysOutOfStock: 3,
    demandedBy: 234,
    image: "🍕",
  },
  {
    id: 3,
    name: "Dragon Roll Sushi",
    restaurant: "Sushi Palace",
    sku: "SKU-003",
    lastOrdered: "2024-12-26",
    daysOutOfStock: 4,
    demandedBy: 89,
    image: "🍣",
  },
  {
    id: 4,
    name: "Black Forest Cake",
    restaurant: "Sweet Dreams",
    sku: "SKU-004",
    lastOrdered: "2024-12-25",
    daysOutOfStock: 5,
    demandedBy: 145,
    image: "🍰",
  },
  {
    id: 5,
    name: "Grilled Salmon Salad",
    restaurant: "Salad Bar",
    sku: "SKU-005",
    lastOrdered: "2024-12-24",
    daysOutOfStock: 6,
    demandedBy: 67,
    image: "🥗",
  },
];

export default function StockPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(mockOutOfStockProducts);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notifyRestaurant = (productId: number) => {
    alert(`Notification sent to restaurant for product ID ${productId}`);
  };

  const restockProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-Sofia text-3xl font-bold text-gray-800">
          Out of Stock Products
        </h1>
        <p className="text-gray-600 mt-2">
          Manage products that are currently unavailable
        </p>
      </motion.div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-600">{products.length}</p>
              <p className="text-sm text-red-700 mt-1">Out of Stock</p>
            </div>
            <AlertTriangle size={32} className="text-red-300" />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-yellow-600">
                {products.reduce((sum, p) => sum + p.demandedBy, 0)}
              </p>
              <p className="text-sm text-yellow-700 mt-1">Customer Requests</p>
            </div>
            <Package size={32} className="text-yellow-300" />
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {Math.max(...products.map((p) => p.daysOutOfStock))} days
              </p>
              <p className="text-sm text-blue-700 mt-1">Longest Duration</p>
            </div>
            <RefreshCw size={32} className="text-blue-300" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by product name, restaurant, or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Days Out
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Requested
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Last Ordered
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-red-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.image}</span>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {product.restaurant}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {product.sku}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      <AlertTriangle size={14} />
                      {product.daysOutOfStock}d
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {product.demandedBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.lastOrdered}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => notifyRestaurant(product.id)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs font-medium"
                      >
                        Notify
                      </button>
                      <button
                        onClick={() => restockProduct(product.id)}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-xs font-medium"
                      >
                        Restock
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No out of stock products found</p>
        </div>
      )}
    </div>
  );
}
