"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Star, CheckCircle2, MapPin } from "lucide-react";
import {
  AdminErrorState,
  AdminLoadingState,
  AdminProductsEmptyState,
} from "@/components/admin/AdminStates";
import { AdminPaginator } from "@/components/admin/AdminPaginator";
import { getApiErrorMessage } from "@/utils/apiError";
import { useAdminListControls } from "@/module/useAdminListControls";
import { useAdminProductsList } from "@/module/hooks/useAdminProducts";
import { useCategory } from "@/module/hooks/useCategory";
import { ProductsFilters } from "@/components/admin/products/ProductsFilters";
import ProductsTable from "@/components/admin/products/ProductsTable";

// --- Interface ---
interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  thumbnail: string;
  category: {
    name: string;
    slug: string;
  };
  provider: {
    name: string;
  };
  rating: {
    average: number;
    totalReviews: number;
  };
  availability: {
    stock: number;
    status: string;
    isAvailable: boolean;
  };
  foodInfo: {
    calories: number;
  };
}

export default function ProductsManagement() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const itemsPerPage = 8;
  const {
    searchInput,
    setSearchInput,
    debouncedSearch,
    page: currentPage,
    setPage: setCurrentPage,
  } = useAdminListControls({ debounceMs: 450 });

  const sortFieldMap: Record<string, string> = {
    newest: "createdAt",
    "price-asc": "price",
    "price-desc": "price",
    rating: "rating",
    name: "name",
  };

  const { adminCategories } = useCategory();

  const uniqueCategories = useMemo(() => {
    const cats = new Set(adminCategories.map((c) => c.title));
    return ["All", ...Array.from(cats)];
  }, [adminCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedCategory,
    stockFilter,
    ratingFilter,
    sortBy,
    setCurrentPage,
  ]);

  const { data, isLoading, error, refetch } = useAdminProductsList({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    category: selectedCategory,
    inStock: stockFilter === "all" ? undefined : stockFilter === "in-stock",
    minRating:
      ratingFilter === "all" ? undefined : ratingFilter === "4.5+" ? 4.5 : 4.0,
    sortBy: sortFieldMap[sortBy] ?? "createdAt",
    sortOrder:
      sortBy === "price-desc"
        ? "desc"
        : sortBy === "price-asc" || sortBy === "name"
          ? "asc"
          : "desc",
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? 0;
  const errorMessage = error
    ? getApiErrorMessage(error, "Failed to load products")
    : null;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, stockFilter, ratingFilter, sortBy]);

  const totalStock = products.reduce(
    (sum, p) => sum + (p.availability?.stock ?? 0),
    0,
  );
  const avgStock = products.length
    ? Math.floor(totalStock / products.length)
    : 0;
  const avgRating =
    products.reduce((acc, p) => acc + (p.rating?.average ?? 0), 0) /
    (products.length || 1);

  return (
    <div className="space-y-6 lg:space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-800">
            Inventory Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Tracking {totalItems} menu items across{" "}
            {uniqueCategories.length - 1} categories.
          </p>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: "Total Items",
            value: totalItems,
            color: "text-rose-600",
            icon: Package,
          },
          {
            label: "Avg Stock",
            value: avgStock,
            color: "text-orange-600",
            icon: CheckCircle2,
          },
          {
            label: "Reviews",
            value: products
              .reduce((acc, p) => acc + (p.rating?.totalReviews ?? 0), 0)
              .toLocaleString(),
            color: "text-blue-600",
            icon: MapPin,
          },
          {
            label: "Avg Rating",
            value: `${avgRating.toFixed(1)} ★`,
            color: "text-green-600",
            icon: Star,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-4 md:p-6 shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1">
              <p className={`text-2xl md:text-3xl font-bold  ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs md:text-sm font-medium text-gray-500">
                {stat.label}
              </p>
            </div>
            <div
              className={`absolute top-0 right-0 p-4 opacity-10 ${stat.color}`}
            >
              <stat.icon size={40} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden">
        {isLoading ? <AdminLoadingState label="Loading products..." /> : null}
        {errorMessage ? (
          <AdminErrorState
            description={errorMessage}
            onAction={() => refetch()}
          />
        ) : null}
        {!isLoading && !errorMessage && products.length === 0 ? (
          <AdminProductsEmptyState />
        ) : null}

        {/* Toolbar */}
        <ProductsFilters
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          uniqueCategories={uniqueCategories}
        />

        <ProductsTable products={products} />

        {/* Pagination Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-sm text-gray-500 font-medium">
            Page <span className="text-gray-800 font-bold">{currentPage}</span>{" "}
            of {totalPages}
          </p>

          <AdminPaginator
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
