import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Edit2, Trash2, Star } from "lucide-react";
import { AdminProductMapped } from "@/hooks/hooks/useAdminProducts";

interface ProductsTableProps {
  products: AdminProductMapped[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
              {products.map((product, idx) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/80 transition-colors group"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-rose-100 to-orange-100 shrink-0 overflow-hidden border border-white shadow-sm">
                        {product.thumbnail && (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
                          by {product.provider?.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm font-bold text-gray-700 ">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${product.availability?.stock > 5 ? "bg-green-500" : "bg-orange-500"}`}
                        />
                        <span className="text-sm font-bold text-gray-700">
                          {product.availability?.stock} Units
                        </span>
                      </div>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${product.availability?.stock > 5 ? "bg-green-400" : "bg-orange-400"}`}
                          style={{
                            width: `${Math.min(product.availability?.stock * 2, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400 mr-1"
                        />
                        <span className="text-sm font-bold text-yellow-700">
                          {product.rating.average}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        ({product.rating.totalReviews})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile View (Preserved but styled) */}
      <div className="md:hidden grid grid-cols-1 gap-4 p-4">
        <AnimatePresence mode="wait">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/50 rounded-2xl p-4 border border-white shadow-sm backdrop-blur-md"
            >
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                  {product.thumbnail && (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <span className="text-[10px] font-bold text-rose-500 uppercase">
                        {product.category?.name}
                      </span>
                    </div>
                    <span className=" font-bold text-gray-900">
                      ${product.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                      <Star
                        size={10}
                        className="fill-yellow-400 text-yellow-400 mr-1"
                      />
                      <span className="text-xs font-bold text-yellow-700">
                        {product.rating.average}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold ${product.availability?.stock > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.availability?.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100/50">
                <button className="flex-1 py-2 text-xs font-bold text-gray-600 bg-white rounded-xl border border-gray-100">
                  Edit
                </button>
                <button className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl">
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
