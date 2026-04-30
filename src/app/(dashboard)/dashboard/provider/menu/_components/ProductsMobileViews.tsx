import { Product } from "@/types/product";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

interface ProductsMobileViewProps {
  currentProducts: Product[];
  openEditModal: (product: Product) => void;
  toggleStock: (product: Product) => void;
  handleDelete: (id: string) => void;
}
export default function ProductsMobileView({
  currentProducts,
  openEditModal,
  toggleStock,
  handleDelete,
}: ProductsMobileViewProps) {
  return (
    <div className="md:hidden grid grid-cols-1 gap-4 p-4">
      <AnimatePresence mode="wait">
        {currentProducts.map((product: Product) => {
          const stock = product.availability?.stock ?? 0;
          return (
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
                        {product.category?.title}
                      </span>
                    </div>
                    <span className=" font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                      <Star
                        size={10}
                        className="fill-yellow-400 text-yellow-400 mr-1"
                      />
                      <span className="text-xs font-bold text-yellow-700">
                        {product?.rating?.average?.toFixed(1)}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold ${stock > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stock} in stock
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100/50">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 bg-white rounded-xl border border-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStock(product)}
                  className="flex-1 py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-xl"
                >
                  {product.availability?.isAvailable ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
