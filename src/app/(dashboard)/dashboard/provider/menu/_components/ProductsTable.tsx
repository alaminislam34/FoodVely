import { Product } from "@/types/product";
import { Edit2, Package, Star, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

interface ProductsTableProps {
  currentProducts: Product[];
  openEditModal: (product: Product) => void;
  toggleStock: (product: Product) => void;
  updatingStockId: string | null;
  handleDelete: (id: string) => void;
}
export default function ProductsTable({
  currentProducts,
  openEditModal,
  toggleStock,
  updatingStockId,
  handleDelete,
}: ProductsTableProps) {
  return (
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
            {currentProducts.map((product: Product, idx: number) => {
              const stock = product.availability?.stock ?? 0;
              return (
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
                      {product.category?.title ??
                        product.category?.title ??
                        "Uncategorized"}
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
                          className={`h-1.5 w-1.5 rounded-full ${stock > 5 ? "bg-green-500" : "bg-orange-500"}`}
                        />
                        <span className="text-sm font-bold text-gray-700">
                          {stock} Units
                        </span>
                      </div>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stock > 5 ? "bg-green-400" : "bg-orange-400"}`}
                          style={{ width: `${Math.min(stock * 2, 100)}%` }}
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
                          {product?.rating?.average?.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        ({product?.rating?.totalReviews ?? 0})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 hover:bg-blue-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => toggleStock(product)}
                        disabled={updatingStockId === product.id}
                        className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                        title={
                          product.availability?.isAvailable
                            ? "Mark unavailable"
                            : "Mark available"
                        }
                      >
                        <Package size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
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
  );
}
