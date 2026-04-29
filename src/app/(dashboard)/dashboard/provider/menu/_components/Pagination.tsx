import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationFooterProps {
  startIndex: number;
  itemsPerPage: number;
  processedProducts: Product[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}
export default function PaginationFooter({
  startIndex,
  itemsPerPage,
  processedProducts,
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationFooterProps) {
  return (
    <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
      <p className="text-sm text-gray-500 font-medium">
        Showing{" "}
        <span className="text-gray-800 font-bold">{startIndex + 1}</span> to{" "}
        <span className="text-gray-800 font-bold">
          {Math.min(startIndex + itemsPerPage, processedProducts.length)}
        </span>{" "}
        of {processedProducts.length} items
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${currentPage !== 1 ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm" : "bg-transparent text-gray-300"}`}
        >
          <ChevronLeft size={18} />
        </button>
        {[...Array(totalPages)].map((_, i: number) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
              currentPage === i + 1
                ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
                : "bg-white border border-gray-200 text-gray-500 hover:border-rose-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((p: number) => Math.min(totalPages, p + 1))
          }
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border border-gray-200 disabled:opacity-30 transition-all ${currentPage !== totalPages ? "bg-white text-gray-700 hover:border-rose-500 shadow-sm" : "bg-transparent text-gray-300"}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
